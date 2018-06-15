
import { resolve } from 'path';

export const BUNDLE_PATHNAME = '/bundle.js';
export const BUNDLE_SOURCE = resolve(process.cwd(), 'src/client/bundle.js');
export const SHARED_STATE_NAME = '__MODEL__';
export const PORT = 8000;

// "secret" environment variables
export const MAPBOX_ACCESS_TOKEN = (() => {
  if (typeof document !== 'undefined') {
    return document.getElementById('mapbox-access-token').value; // eslint-disable-line no-undef
  }

  if (typeof process !== 'undefined') {
    return process.env.MAPBOX_ACCESS_TOKEN;
  }
})();

export const ARC_RESOLUTION = 20;

if (!MAPBOX_ACCESS_TOKEN) throw new Error('Could not find MAPBOX_ACCESS_TOKEN in the environment');