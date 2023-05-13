import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { v4 as uuid } from 'uuid';
import { Subject } from 'rxjs';

// Change API key
mapboxgl.accessToken = 'pk.eyJ1IjoiY2h1bGkiLCJhIjoiY2xoZmd5NjJqMDN5bDNzbDludHN5MXdsOSJ9.vBf_vyOrGnaRFzxgJ3W2zw';


export const useMapbox = (startingPoint) => {

  // Reference to the map div
  const mapDiv = useRef();
  const setRef = useCallback( (node) => {
    mapDiv.current = node;
  }, []);

  // Reference the markers
  const markers = useRef({});


  // rxjs observables
  const newMarker = useRef( new Subject() );
  const markerMovement= useRef( new Subject() );


  // Map and coords
  const map = useRef();
  const [ coords, setCoords] = useState( startingPoint );


  // Function to add markers
  const addMarker = useCallback( ({ lngLat: {lat, lng} }) => {

    const marker = new mapboxgl.Marker();
    marker.id = uuid(); // TODO: if the mark already has id

    marker
      .setLngLat([ lng, lat ])
      .addTo( map.current )
      .setDraggable( true );

    markers.current[ marker.id ] = marker;

    // TODO: If marker has ID don't emit
    newMarker.current.next({
      id: marker.id,
      lat,
      lng
    });

    // Listen to marker movements
    marker.on( 'drag', ({ target }) => {
      const { id } = target;
      const { lat,lng } = target.getLngLat();
      markerMovement.current.next({ id, lat, lng });
    });
  }, []);


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


  // Add markers when i click
  useEffect( () => {
    map.current?.on( 'click', addMarker );
  }, [addMarker]);


  return {
    addMarker,
    coords,
    newMarker$: newMarker.current,
    markerMovement$: markerMovement.current,
    setRef
  };
}
