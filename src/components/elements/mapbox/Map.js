import PropTypes from 'prop-types';
import React, { Component } from 'react';

// refer to https://www.mapbox.com/mapbox-gl-js/api/#Map
// it should be noted that a style already contains sources
// and layers, either directly or indirectly. Additional
// <Source> and <Layer> elements add or remove to the list
const MAP_PROP_TYPES = {
  style: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  hash: PropTypes.bool,
  interactive: PropTypes.bool,
  bearingSnap: PropTypes.number,
  classes: PropTypes.arrayOf(PropTypes.string), // not what you think
  attributionControl: PropTypes.bool,
  failIfMajorPerformanceCaveat: PropTypes.bool,
  preserveDrawingBuffer: PropTypes.bool,
  maxBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  scrollZoom: PropTypes.bool,
  boxZoom: PropTypes.bool,
  dragRotate: PropTypes.bool,
  dragPen: PropTypes.bool,
  keyboard: PropTypes.bool,
  doubleClickZoom: PropTypes.bool,
  touchZoomRotate: PropTypes.bool,
  trackResize: PropTypes.bool,
  center: PropTypes.arrayOf(PropTypes.number),
  zoom: PropTypes.number,
  bearing: PropTypes.number,
  pitch: PropTypes.number,
};

const MAP_DEFAULT_PROPS = {
  style: 'mapbox://styles/mapbox/streets-v10',
  minZoom: 0,
  maxZoom: 20,
  hash: false,
  interactive: true,
  bearingSnap: 7,
  attributionControl: true,
  failIfMajorPerformanceCaveat: false,
  preserveDrawingBuffer: false,
  scrollZoom: true,
  boxZoom: true,
  dragRotate: true,
  dragPen: true,
  keyboard: true,
  doubleClickZoom: true,
  touchZoomRotate: true,
  trackResize: true,
  center: [0, 0],
  zoom: 0,
  bearing: 0,
  pitch: 0,
};

function boundingBoxesMatch(box1, box2) {
  if (box1 && !box2 || box2 && !box1) return false;
  if (!box1 && !box2) return true;

  return (
    box1[0][0] === box2[0][0] &&
    box1[0][1] === box2[0][1] &&
    box1[1][0] === box2[1][0] &&
    box1[1][1] === box2[1][1]
  );
}

// this creates a "Mapbox GL Context" which will be consumed
// by all child components of this class (that define "map")
// as part of the child context
//
// this is in line with most implementations of MapBox
// GL in React. In most cases, MapBoxGL's reliance of WebGL for
// rendering and web workers to load vector tiles make it very
// difficult to render server side, so the map context is "defined"
// only when loading is completed on the web.
export default class Map extends Component {
  getChildContext() {
    return {
      map: this.map, // set in componentDidMount
      mapboxgl: this.mapboxgl,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.updateMap(nextProps);
  }

  focusArea(boundingBox) {
    // TODO: Make this configurable? Use named constants?
    if (this.map) {
      this.map.fitBounds(boundingBox, {
        padding: 20,
        speed: 2,
        maxZoom: 12,
      });
    }
  }

  toggleNavControl(navControlPosition) {
    if (this.map && this.navControl) {
      if (navControlPosition) {
        return this.map.addControl(this.navControl, navControlPosition);
      }

      return this.map.removeControl(this.navControl);
    }
  }

  updateMap(nextProps) {
    const {
      boundingBox: nextBoundingBox,
      navControl: nextNavControl,
    } = nextProps || {};

    const {
      boundingBox,
      navControl,
    } = this.props;

    if (!boundingBoxesMatch(boundingBox, nextBoundingBox)) {
      this.focusArea(nextBoundingBox || boundingBox);
    }

    // If there are no next props, then render a navControl if
    // it is initially true. Otherwise detect toggling between
    // current and next props
    if (navControl && !nextProps || !navControl && nextNavControl) {
      this.toggleNavControl(nextNavControl || navControl);
    } else if (navControl && !nextNavControl) {
      this.toggleNavControl();
    }
  }

  // By avoiding imports, using require(.ensure) and componentDidMount,
  // we bypass rendering (even loading libraries) server side
  async componentDidMount() {
    const mapboxgl = await import(/* webpackChunkName: "mapbox-gl" */ 'mapbox-gl');
    const { accessToken } = this.props;
    const { container } = this;

    if (!container) return;
    const mapInitProps = Object.keys(MAP_PROP_TYPES).reduce(
      (map, key) => {
        if (this.props[key]) {
          map[key] = this.props[key];
        }
        return map;
      },
    {});

    this.mapboxgl = mapboxgl;
    this.navControl = new mapboxgl.NavigationControl();

    mapboxgl.accessToken = accessToken;
    const map = new mapboxgl.Map({ container, ...mapInitProps });

    map.on('load', () => {
      this.map = map;
      this.updateMap();
      this.forceUpdate();
    });
  }

  componentDidUpdate(prevProps) {
    if (this.map && JSON.stringify(prevProps.flyTo) !== JSON.stringify(this.props.flyTo)) {
      this.map.flyTo({ center: this.props.flyTo, zoom: 6 });
    }
  }

  render() {
    return (
      <div
        className={this.props.className}
        ref={ref => (this.container = ref)}
      >
        {this.map && this.props.children}
      </div>
    );
  }
}

Map.defaultProps = {
  className: 'MapBox--container',
  navControl: 'bottom-right',
  ...MAP_DEFAULT_PROPS,
};

Map.propTypes = {
  className: PropTypes.string,
  accessToken: PropTypes.string.isRequired,
  children: PropTypes.node,
  boundingBox: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  navControl: PropTypes.string,
  flyTo: PropTypes.arrayOf(PropTypes.number),
  ...MAP_PROP_TYPES,
};

Map.childContextTypes = {
  map: PropTypes.object,
  mapboxgl: PropTypes.object,
};
