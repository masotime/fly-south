/* eslint-disable react/prop-types */
import React from 'react';
import Map from 'components/elements/mapbox/Map';
import Marker from 'components/elements/mapbox/Marker';
import Pin from 'components/elements/mapbox/Pin';

import { MAPBOX_ACCESS_TOKEN } from 'common/constants';
import { getBoundingBox } from 'common/maputils';

const DEFAULT_PINS = [];
const DEFAULT_ON_PIN_CLICK = (tweetId) => console.log(`Tweet ${tweetId} clicked`);

export default function TweetMap({ pins = DEFAULT_PINS, onPinClick = DEFAULT_ON_PIN_CLICK }) {
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
            <Marker key={tweetId} lngLat={lngLat}>
              <div onClick={() => onPinClick(tweetId)} className="tweet-marker">
                <Pin fill="black"/>
              </div>
            </Marker>
          );
        })
      }
    </Map>
  );
}
