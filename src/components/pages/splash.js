import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactTimeAgo from 'react-time-ago';
import polylabel from '@mapbox/polylabel';

const { string } = PropTypes;

function Pin() { return <span>📌</span>; }
function Globe() { return <span>🌐</span>; }
function Guesstimate() { return <span>❓</span>; }

function Location({ coordinates, place }) {
	const { full_name, bounding_box } = place;

	function renderCoordinates() {
		if (coordinates) {
			const [ longitude, latitude ] = coordinates.coordinates;
			return <span><Globe />[ {longitude}, {latitude} ]</span>;
		} else if (bounding_box) {
			const [ longitude, latitude ] = polylabel(bounding_box.coordinates, 1.0);
			return <span><Guesstimate />[ {longitude}, {latitude} ]</span>;
		}
		return null;
	}

	return <p><Pin />{full_name} {renderCoordinates()} </p>;
}

function Photos({ media = [] }) {
	return (
		<Fragment>
			{
				media
					.filter(item => item.type === 'photo')
					.map(item => <img key={item.id} src={item.media_url} />)
			}
		</Fragment>
	);
}

function TweetsList({ tweets }) {
	return (
		<ul>
			{ 
				tweets
					.filter(tweet => tweet.place)
					.map(tweet => {
					const { id_str, text, created_at, entities: { media }, place, coordinates } = tweet;
					const relativeTime = <small><ReactTimeAgo>{new Date(created_at)}</ReactTimeAgo></small>;

					return (
						<li key={id_str}>
							<div>
								<p>{text}</p>
								<Location coordinates={coordinates} place={place} />
								<Photos media={media} />
								{ relativeTime }
							</div>
						</li>
					);
				})
			}
		</ul>
	)
}

export default class SplashPage extends Component {
	state = {
		tweets: [],
		username: '',
		fetching: false,
	};

	isBusy = () => this.state.fetching;
	
	fetchTweets = async (e) => {
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

		return (
			<div>
				<h1>{title}</h1>
				<p>{message}</p>
				{ this.renderForm() }
				<TweetsList tweets={this.state.tweets} />
			</div>
		);
	}
}

SplashPage.propTypes = {
	title: string,
	message: string
};