/* eslint-disable react/prop-types */
import React from 'react';
import polylabel from '@mapbox/polylabel';

import { Globe, Guesstimate } from 'components/elements/icons';

function LngLat({ coordinates, disabled, isEstimate }) {
	if (disabled) return null;

	const [ longitude, latitude ] = coordinates;
return <span>{isEstimate ? <Guesstimate /> : <Globe />} [ {longitude}, {latitude} ]</span>;
}

function Location({ coordinates, place }) {
	const { full_name, bounding_box } = place;

	function renderCoordinates() {
		if (coordinates) {
			return <span><LngLat disabled coordinates={coordinates.coordinates} /></span>;
		} else if (bounding_box) {
			return <span><LngLat disabled isEstimate coordinates={polylabel(bounding_box.coordinates, 1.0)} /></span>;
		}
		return null;
	}

	return <small>{full_name} {renderCoordinates()}</small>;
}

export default Location;