// this is the root component
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Html from 'components/html';
import SplashPage from 'components/pages/splash';

const { object } = PropTypes;

export default class App extends Component {
	render() {
		const { model } = this.props;
		const { title, message } = model;
		return (
			<Html model={model}>
				<SplashPage title={title} message={message} />
			</Html>
		);
	}
}

App.propTypes = {
	model: object
};
