/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import ReactTimeAgo from 'react-time-ago';

import Photos from 'components/sections/Photos';
import Location from 'components/elements/Location';

class TweetsList extends Component {

	tweetRefs = {};

	componentDidUpdate(prevProps) {
		const { selectedTweetId: prevSelectedTweetId } = prevProps;
		const { selectedTweetId } = this.props;

		if (selectedTweetId !== prevSelectedTweetId && this.tweetRefs[selectedTweetId]) {
			// this.containerRef.scrollTop = this.tweetRefs[selectedTweetId].offsetTop;
			this.tweetRefs[selectedTweetId].scrollIntoView({ behavior: 'smooth' });
		}
	}

	render() {
		const { tweets, className } = this.props;
		this.tweetRefs = {};

		return (
			<ul className={className} ref={ref => this.containerRef = ref}>
				{ 
					tweets
						.filter(tweet => tweet.place)
						.map(tweet => {
						const { id_str, full_text: text, created_at, entities: { media }, place, coordinates } = tweet;
						const relativeTime = <small><ReactTimeAgo>{new Date(created_at)}</ReactTimeAgo></small>;
	
						return (
							<li key={id_str} ref={ref => this.tweetRefs[id_str] = ref}>
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

}

export default TweetsList;