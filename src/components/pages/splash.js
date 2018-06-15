/* eslint-disable react/prop-types */
/* global fetch */
import React, { Component } from 'react';
import { string } from 'prop-types';

import TweetsList from 'components/sections/TweetsList';
import TweetMap from 'components/sections/TweetMap';

import { tweetToPin, generateSource, pinToCoordinates } from 'common/maputils';
import { Provider } from 'components/contexts/store';

export default class SplashPage extends Component {
	state = {
		tweets: [],
		username: '',
		fetching: false,
		selectedTweetId: null,
		store: {}
	};

	isBusy = () => this.state.fetching;

	fetchTweets = async () => {
		this.setState({ fetching: true });
		try {
			const body = JSON.stringify({ screen_name: this.state.username });
			const apiResponse = await fetch('/getTweets', {
				method: 'POST',
				body,
				credentials: 'include',
				headers: {
					'content-type': 'application/json'
				}
			});
			const timeline = await apiResponse.json();
			const pins = timeline.filter(tweet => tweet.place).map(tweetToPin);
			const source = await generateSource(pins.map(pinToCoordinates));

			return this.setState({ tweets: timeline, pins, source });
		} catch (err) {
			console.error('Could not fetch timeline', err);
		} finally {
			this.setState({ fetching: false });
		}
	};

	handlePinClick= tweetId => {
		this.setState({ selectedTweetId: tweetId });
	}

	renderForm = () => {
		return (
			<div>
				<button
					type="button"
					disabled={this.isBusy()}
					onClick={this.fetchTweets}
				>Fetch Tweets for</button>
				<input
					onKeyUp={e => {
						if (e.key === 'Enter') {
							e.preventDefault();
							this.fetchTweets();
						}
					}}
					onChange={e => this.setState({ username: e.target.value })}
					value={this.state.username}
				/>
			</div>
		);
	};

	render() {
		const { title, message } = this.props;
		const { pins, source, selectedTweetId, tweets, store } = this.state;

		return (
			<Provider value={store}>
				<div className="grid-wrapper">
					<div className="grid-header">
						<h1>{title}</h1>
						<p>{message}</p>
						{ this.renderForm() }
					</div>
					<div className="grid-map">
						<TweetMap pins={pins} route={source} onPinClick={this.handlePinClick} selectedTweetId={selectedTweetId} />
					</div>
					<TweetsList className="grid-tweets" selectedTweetId={selectedTweetId} tweets={tweets} />
				</div>
			</Provider>
		);
	}
}

SplashPage.propTypes = {
	title: string,
	message: string
};