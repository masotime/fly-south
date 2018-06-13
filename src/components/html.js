import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BUNDLE_PATHNAME, SHARED_STATE_NAME, MAPBOX_ACCESS_TOKEN } from 'common/constants';
import serialize from 'serialize-javascript';

const { node, oneOfType, arrayOf, object } = PropTypes;

export default class Html extends Component {
	render() {
		const { model, children } = this.props;
		const { title } = model;
		return (
			<html>
				<head>
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta charSet="utf-8" />
					<link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/v0.45.0/mapbox-gl.css" />
					<link rel="stylesheet" href="/static/styles.css" />
					<title>{title}</title>
				</head>
				<body>
					{children}
					<input type="hidden" id="mapbox-access-token" value={MAPBOX_ACCESS_TOKEN} />
					<script type="text/javascript" dangerouslySetInnerHTML={
						{ __html: `window.${SHARED_STATE_NAME} = ${serialize(model, { isJSON: true })}` }
					}></script>
					<script src={BUNDLE_PATHNAME}></script>
				</body>
			</html>
		);
	}
}

Html.propTypes = {
	model: object,
	children: oneOfType([node, arrayOf(node)])
};
