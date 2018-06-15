/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import ReactTimeAgo from 'react-time-ago';

import Photos from 'components/sections/Photos';
import Location from 'components/elements/Location';
import { determineCoordinates } from 'common/maputils';

class TweetsList extends Component {

	tweetRefs = {};

	componentDidUpdate(prevProps) {
		const { selectedTweetId: prevSelectedTweetId } = prevProps;
		const { selectedTweetId, doNotScroll } = this.props;

		if (selectedTweetId !== prevSelectedTweetId && this.tweetRefs[selectedTweetId] && !doNotScroll) {
			// this.containerRef.scrollTop = this.tweetRefs[selectedTweetId].offsetTop;
			this.tweetRefs[selectedTweetId].scrollIntoView({ block: 'start', behavior: 'auto' });
		}
	}

	render() {
		const { tweets, className, selectedTweetId, onTweetClick } = this.props;
		this.tweetRefs = {};

		return (
			<ul className={className} ref={ref => this.containerRef = ref}>
				{ 
					tweets
						.filter(tweet => tweet.place)
						.map(tweet => {
							const { id_str, full_text: text, created_at, entities: { media }, place, coordinates } = tweet;
							const relativeTime = <small><ReactTimeAgo>{new Date(created_at)}</ReactTimeAgo></small>;
							const isSelected = selectedTweetId === id_str;
							const className = isSelected ? 'selected' : '';
		
							return (
								<li className={className} onClick={() => onTweetClick(id_str, determineCoordinates({ place, coordinates }))} key={id_str} ref={ref => this.tweetRefs[id_str] = ref}>
									<div>
										<div className="tweet-header">{ relativeTime }&nbsp;·&nbsp;<Location coordinates={coordinates} place={place} /></div>
										<p>{text}</p>
										<Photos media={media} />
									</div>
								</li>
							);
						})
				}
			</ul>
		)		

	}

}

TweetsList.defaultProps = {
	onTweetClick: () => {}
};

export default TweetsList;