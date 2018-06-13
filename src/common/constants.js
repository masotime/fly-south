import { resolve } from 'path';

export const BUNDLE_PATHNAME = '/bundle.js';
export const BUNDLE_SOURCE = resolve(process.cwd(), 'src/client/bundle.js');
export const SHARED_STATE_NAME = '__MODEL__';
export const PORT = 8000;