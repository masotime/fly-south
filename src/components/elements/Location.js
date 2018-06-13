/* eslint-disable react/prop-types */
import React from 'react';
import polylabel from '@mapbox/polylabel';

import { Globe, Guesstimate, Pin } from 'components/elements/icons';

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

export default Location;