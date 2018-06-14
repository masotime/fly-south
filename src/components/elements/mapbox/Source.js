import PropTypes from 'prop-types';
import { Component } from 'react';

const STATES = {
  LOADING: 'loading',
  LOADED: 'loaded',
  UNLOADING: 'unloading'
};

// lazy comparison
function isEqual(propsToCompare, currentSource, newSource) {
  if (!currentSource && newSource || currentSource && !newSource) return false;

  for (const prop of propsToCompare) {
    // stupid exception
    if (prop === 'data') {
      if (JSON.stringify(currentSource._data.data) !== JSON.stringify(newSource.data.data)) {
        return false;
      }
    } else if (JSON.stringify(currentSource[prop]) !== JSON.stringify(newSource[prop])) {
      return false;
    }
  }

  return true;
}

// This doesn't render anything, but allows for dynamically add and
// removing sources to the current map "context"
export default class Source extends Component {

  state = {
    sourceState: STATES.LOADING
  };

  addSource() {
    const { map } = this.context;
    const { children, id, ...sourceOptions } = this.props; /* eslint-disable-line no-unused-vars */

    // compare only matching props
    const propsToCompare = Object.keys(sourceOptions);

    if (map) {
      console.log(this.state.sourceState);
      switch (this.state.sourceState) {
        case STATES.LOADING:
          map.addSource(id, sourceOptions);
          this.setState({ sourceState: STATES.LOADED });
          break;

        case STATES.LOADED: {
          const currentSource = map.getSource(id);
          if (!isEqual(propsToCompare, currentSource, sourceOptions)) {
            this.setState({ sourceState: STATES.UNLOADING }); // we need to unload first
          }
          break;

        }

        case STATES.UNLOADING:
          if (map.getSource(id)) { map.removeSource(id); }
          this.setState({ sourceState: STATES.LOADING});
          break;

        default:
      }
    }
  }

  componentDidMount() {
    this.addSource();
  }

  componentDidUpdate() {
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
    return this.state.sourceState === STATES.LOADED && this.props.children || null;
  }
}

Source.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['vector', 'raster', 'geojson', 'image', 'video']).isRequired,
  children: PropTypes.node
};

Source.contextTypes = {
  map: PropTypes.object,
};
