import polylabel from '@mapbox/polylabel';
import { ARC_RESOLUTION } from 'common/constants';

export function getBoundingBox(lngLatArray = []) {
  let hasBoundingBox = false;
  let minLng = 180;
  let maxLng = -180;
  let minLat = 90;
  let maxLat = -90;

  lngLatArray.forEach(([lng, lat]) => {
    minLng = Math.min(lng, minLng);
    maxLng = Math.max(lng, maxLng);
    minLat = Math.min(lat, minLat);
    maxLat = Math.max(lat, maxLat);
    hasBoundingBox = true;
  });

  return hasBoundingBox ? ([[minLng, minLat], [maxLng, maxLat]]) : null;
}

export function tweetToPin(tweet) {
  const { id_str, coordinates, place } = tweet;
  const { bounding_box } = place;

  let latitude = 0;
  let longitude = 0;

  if (coordinates) {
    [ longitude, latitude ] = coordinates.coordinates;
  } else if (bounding_box) {
    [ longitude, latitude ] = polylabel(bounding_box.coordinates, 1.0);
  }

  return {
    tweetId: id_str, lngLat: [ longitude, latitude ]
  };
}

export function pinToCoordinates(pin) {
  return pin.lngLat;
}

// ref: https://www.mapbox.com/mapbox-gl-js/example/animate-point-along-route/
async function drawLine(origin, destination) {
  const routeFeature = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        origin,
        destination
      ]
    }
  };

  const turf = await import(/* webpackChunkName: "turf" */ '@turf/turf');
  const distance = turf.lineDistance(routeFeature, { units: 'kilometers' });
  const arc = [];
  const stepDistance = distance / ARC_RESOLUTION;

  for (let i = 0; i <= ARC_RESOLUTION; i += 1) {
    const segment = turf.along(routeFeature, i * stepDistance, { units: 'kilometers' });
    arc.push(segment.geometry.coordinates);
  }

  // update the route with the arc coordinates
  routeFeature.geometry.coordinates = arc;

  return routeFeature;
}

export async function generateSource(coordinates) {
  const source = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  };

  const count = coordinates.length;
  // const count = 2;
  for (let i = 0; i < count - 1; i += 1) {
    const segmentFeature = await drawLine(coordinates[i], coordinates[i+1]);
    source.data.features.push(segmentFeature);
  }

  return source;
}