/* global window, document */
import React from 'react';
import { hydrate } from 'react-dom';
import App from 'components';
import { SHARED_STATE_NAME } from 'common/constants';

import 'common/timeago';

const model = window[SHARED_STATE_NAME];

hydrate(<App model={model} />, document);