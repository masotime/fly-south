import polylabel from '@mapbox/polylabel';

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