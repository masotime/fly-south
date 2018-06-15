/* global document */
import PropTypes from 'prop-types';
import { Component } from 'react';
import {
  unmountComponentAtNode,
  createPortal, // eslint-disable-line camelcase
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

  state = {
    portalEl: null
  };

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
      this.setState({ portalEl: createPortal(children, this.container) });
    }
  }

  componentDidMount() {
    this.positionMarker(this.props.lngLat);
    this.renderIntoMarker(this.props.children);
  }

  componentDidUpdate(prevProps) {
    const { lngLat, children } = prevProps;

    if (latLngChanged(this.props.lngLat, lngLat)) {
      this.positionMarker(lngLat);
    }

    if (nodeChanged(children, this.props.children)) {
      this.renderIntoMarker(this.props.children);
    }

    if (this.container) {
      const wasSelected = this.props.selected && !prevProps.selected;
      const wasDeselected = !this.props.selected && prevProps.selected;
      const zIndex = this.props.selected ? 1000: '';

      if (wasSelected || wasDeselected) {
        this.container.style.zIndex = zIndex
      }
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
    return this.state.portalEl;
  }
}

Marker.propTypes = {
  children: PropTypes.node.isRequired,
  lngLat: PropTypes.arrayOf(PropTypes.number),
  selected: PropTypes.bool
};

Marker.contextTypes = {
  map: PropTypes.object,
  mapboxgl: PropTypes.object,
};
