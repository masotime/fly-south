/* eslint-disable react/prop-types */
import React, { Component, Fragment } from 'react';
import Map from 'components/elements/mapbox/Map';
import Source from 'components/elements/mapbox/Source';
import Layer from 'components/elements/mapbox/Layer';
import Marker from 'components/elements/mapbox/Marker';
import Pin from 'components/elements/mapbox/Pin';

import { MAPBOX_ACCESS_TOKEN } from 'common/constants';
import { getBoundingBox } from 'common/maputils';

const DEFAULT_PINS = [];
const DEFAULT_ON_PIN_CLICK = (tweetId) => console.log(`Tweet ${tweetId} clicked`);
const LINE_PAINT_STYLE = {
  'line-width': 2,
  'line-color': '#007cbf'
};

export default class TweetMap extends Component {

  renderRoute = () => {
    const { route } = this.props;
    if (route) {
      return (
        <Fragment>
          <Source id="route" {...route}>
            <Layer id="route" source="route" type="line" paint={LINE_PAINT_STYLE} />
          </Source>
        </Fragment>
      );
    }

    return null;
  }

  render() {
    const { pins = DEFAULT_PINS, onPinClick = DEFAULT_ON_PIN_CLICK, selectedTweetId } = this.props;
    const boundingBox = getBoundingBox(
      pins.map(({ lngLat }) => [lngLat[0], lngLat[1]])
    );

    return (
      <Map
        accessToken={MAPBOX_ACCESS_TOKEN}
        center={[0, 0]}
        maxBounds={[[-180, -90], [180, 90]]}
        boundingBox={boundingBox}
        zoom={0}
        navControl="top-left"
      >
        {
          pins.map(({ lngLat, tweetId }) => {
            return (
              <Marker key={tweetId} lngLat={lngLat} selected={selectedTweetId === tweetId}>
                <div onClick={() => onPinClick(tweetId)} className="tweet-marker">
                  <Pin selected={selectedTweetId === tweetId} />
                </div>
              </Marker>
            );
          })
        }
        { this.renderRoute() }
      </Map>
    );
  }

}

TweetMap.defaultProps = {
  pins: DEFAULT_PINS,
  onPinClick: DEFAULT_ON_PIN_CLICK
};