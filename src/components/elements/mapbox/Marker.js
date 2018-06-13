/* global document */
import PropTypes from 'prop-types';
import { Component } from 'react';
import {
  unmountComponentAtNode,
  unstable_renderSubtreeIntoContainer, // eslint-disable-line camelcase
} from 'react-dom';

function latLngChanged(a, b) {
  if (a && !b || !a && b) return true;
  return a[0] !== b[0] || a[1] !== b[1];
}

function nodeChanged(a, b) {
  if (a && !b || !a && b) return true;

  // for single element children, use the key as
  // a hash to determine content changes
  if (a.key && b.key) return a.key !== b.key;

  // for arrays, test each element individually
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.some((elem, idx) => nodeChanged(elem, b[idx]));
  }

  // fallback comparison
  return a !== b;
}

export default class Marker extends Component {

  positionMarker(lngLat) {
    const { mapboxgl, map } = this.context;

    if (mapboxgl && lngLat && map) {
      if (!this.container) {
        this.container = document.createElement('div');
      }

      if (!this.marker) {
        this.marker = new mapboxgl.Marker(this.container);
      }

      this.marker
        .setLngLat(lngLat)
        .addTo(map);
    }
  }

  renderIntoMarker(children) {
    if (this.container) {
      unstable_renderSubtreeIntoContainer(this, children, this.container);
    }
  }

  componentDidMount() {
    this.positionMarker(this.props.lngLat);
    this.renderIntoMarker(this.props.children);
  }

  UNSTABLE_componentWillReceiveProps({ lngLat, children }) {
    if (latLngChanged(this.props.lngLat, lngLat)) {
      this.positionMarker(lngLat);
    }

    if (nodeChanged(this.props.children, children)) {
      this.renderIntoMarker(children);
    }
  }

  componentWillUnmount() {
    const { map } = this.context;
    const { marker } = this;

    unmountComponentAtNode(this.container);

    if (marker && map) {
      marker.remove(map);
    }
  }

  render() {
    return null;
  }
}

Marker.propTypes = {
  children: PropTypes.node.isRequired,
  lngLat: PropTypes.arrayOf(PropTypes.number),
};

Marker.contextTypes = {
  map: PropTypes.object,
  mapboxgl: PropTypes.object,
};
