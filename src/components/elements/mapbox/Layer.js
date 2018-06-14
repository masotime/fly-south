import PropTypes from 'prop-types';
import { Component } from 'react';

export default class Layer extends Component {
  addLayer() {
    const { map } = this.context;
    const { id, ...layerOptions } = this.props;

    if (map) {
      let existingLayer = map.getLayer(id);

      if (existingLayer && existingLayer !== layerOptions) {
        map.removeLayer(id);
        existingLayer = null;
      }

      if (!existingLayer) {
        map.addLayer({
          id,
          ...layerOptions
        });
      }
    }
  }

  componentDidMount() {
    this.addLayer();
  }

  componentDidUpdate() {
    this.addLayer();
  }

  componentWillUnmount() {
    const { map } = this.context;
    const { id } = this.props;

    if (map && id) {
      map.removeLayer(id);
    }
  }

  render() {
    return null;
  }
}

// https://www.mapbox.com/mapbox-gl-js/style-spec/#layers
Layer.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['fill', 'line', 'symbol', 'circle', 'heatmap', 'fill-extrusion', 'raster', 'hillshade', 'background']).isRequired,
  source: PropTypes.string, // required for everything except background
  'source-layer': PropTypes.string,

};

Layer.contextTypes = {
  map: PropTypes.object,
};
