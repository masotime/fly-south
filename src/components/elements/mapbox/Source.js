import PropTypes from 'prop-types';
import { Component } from 'react';

// This doesn't render anything, but allows for dynamically add and
// removing sources to the current map "context"
export default class Source extends Component {

  addSource() {
    const { map } = this.context;
    const { id, ...sourceOptions } = this.props;

    if (map) {
      let existingSource = map.getSource(id);

      if (existingSource && existingSource !== sourceOptions) {
        map.removeSource(id);
        existingSource = null;
      }

      if (!existingSource) {
        map.addSource(id, sourceOptions);
      }
    }
  }

  componentDidMount() {
    this.addSource();
  }

  UNSTABLE_componentWillReceiveProps() {
    this.addSource();
  }

  componentWillUnmount() {
    const { map } = this.context;
    const { id } = this.props;

    if (map && id) {
      map.removeSource(id);
    }
  }

  render() {
    return null;
  }
}

Source.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['vector', 'raster', 'geojson', 'image', 'video']).isRequired,
};

Source.contextTypes = {
  map: PropTypes.object,
};
