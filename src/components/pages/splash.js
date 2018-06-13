/* eslint-disable react/prop-types */
/* global fetch */
import React, { Component } from 'react';
import { string } from 'prop-types';

import TweetsList from 'components/sections/TweetsList';
import TweetMap from 'components/sections/TweetMap';

import { tweetToPin } from 'common/maputils';
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

			return this.setState({ tweets: timeline });
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
		const pins = this.state.tweets.filter(tweet => tweet.place).map(tweetToPin);

		return (
			<Provider value={this.state.store}>
				<div className="grid-wrapper">
					<div className="grid-header">
						<h1>{title}</h1>
						<p>{message}</p>
						{ this.renderForm() }
					</div>
					<div className="grid-map">
						<TweetMap pins={pins} onPinClick={this.handlePinClick}/>
					</div>
					<TweetsList className="grid-tweets" selectedTweetId={this.state.selectedTweetId} tweets={this.state.tweets} />
				</div>
			</Provider>
		);
	}
}

SplashPage.propTypes = {
	title: string,
	message: string
};