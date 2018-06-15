/* eslint-disable react/prop-types */
/* global fetch */
import React, { Component } from 'react';
import { string } from 'prop-types';

import TweetsList from 'components/sections/TweetsList';
import TweetMap from 'components/sections/TweetMap';

import { tweetToPin, generateSource, pinToCoordinates } from 'common/maputils';
import { Provider } from 'components/contexts/store';

import { Search } from 'components/elements/icons';

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

	handlePinClick = tweetId => {
		this.setState({ selectedTweetId: tweetId, doNotScroll: false });
	}

	handleTweetClick = (tweetId, coordinates) => {
		// maybe also move the map
		this.setState({ selectedTweetId: tweetId, doNotScroll: true, flyTo: coordinates });
	}

	renderForm = () => {
		return (
			<div className="search-bar">
				<input
					className="fancy-input"
					onKeyUp={e => {
						if (e.key === 'Enter') {
							e.preventDefault();
							this.fetchTweets();
						}
					}}
					onChange={e => this.setState({ username: e.target.value })}
					value={this.state.username}
					placeholder="e.g. couch, vjo, wickman"
				/>
				<button
					className="search-button"
					type="button"
					disabled={this.isBusy()}
					onClick={this.fetchTweets}
				><Search /></button>				
			</div>
		);
	};

	render() {
		const { pins, source, selectedTweetId, tweets, store, doNotScroll, flyTo } = this.state;

		return (
			<Provider value={store}>
				<div className="grid-wrapper">
					<div className="grid-header">
						{ this.renderForm() }
					</div>
					<div className="grid-map">
						<TweetMap pins={pins} route={source} onPinClick={this.handlePinClick} selectedTweetId={selectedTweetId} flyTo={flyTo} />
					</div>
					<TweetsList className="grid-tweets" onTweetClick={this.handleTweetClick} selectedTweetId={selectedTweetId} tweets={tweets} doNotScroll={doNotScroll} />
				</div>
			</Provider>
		);
	}
}

SplashPage.propTypes = {
	title: string,
	message: string
};