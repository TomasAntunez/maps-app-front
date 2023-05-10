import { useCallback, useEffect, useRef, useState } from 'react';

import mapboxgl from 'mapbox-gl';

// Change API key
mapboxgl.accessToken = 'pk.eyJ1IjoiY2h1bGkiLCJhIjoiY2xoZmd5NjJqMDN5bDNzbDludHN5MXdsOSJ9.vBf_vyOrGnaRFzxgJ3W2zw';


export const useMapbox = (startingPoint) => {

  // Reference to the map div
  const mapDiv = useRef();
  const setRef = useCallback( (node) => {
    mapDiv.current = node;
  }, []);

  const map = useRef();
  const [ coords, setCoords] = useState( startingPoint );


  useEffect( () => {
    map.current = new mapboxgl.Map({
      container: mapDiv.current, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [ startingPoint.lng, startingPoint.lat ], // starting position [lng, lat]
      zoom: startingPoint.zoom, // starting zoom
    });
  }, [ startingPoint ]);

  // When the map moves
  useEffect( () => {
    map.current?.on( 'move', () => {
      const { lat, lng } = map.current.getCenter();
      setCoords({
        lat: lat.toFixed(4),
        lng: lng.toFixed(4),
        zoom: map.current.getZoom().toFixed(2)
      });
    });
  }, []);

  return {
    coords,
    setRef
  };
}
