import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl';

// Change API key
mapboxgl.accessToken = 'pk.eyJ1IjoiY2h1bGkiLCJhIjoiY2xoZmd5NjJqMDN5bDNzbDludHN5MXdsOSJ9.vBf_vyOrGnaRFzxgJ3W2zw';

const startingPoint = {
  lng: -89.6127,
  lat: 36.5985,
  zoom: 5.10
};


export const MapPage = () => {

  const mapDiv = useRef();
  const [ map, setMap ] = useState(null);
  const [ coords, setCoords] = useState( startingPoint );


  useEffect( () => {
    const mapMapbox = new mapboxgl.Map({
      container: mapDiv.current, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [ startingPoint.lng, startingPoint.lat ], // starting position [lng, lat]
      zoom: startingPoint.zoom, // starting zoom
    });

    setMap( mapMapbox );
  }, []);

  // When the map moves
  useEffect( () => {
    map?.on( 'move', () => {
      const { lat, lng } = map.getCenter();
      setCoords({
        lat: lat.toFixed(4),
        lng: lng.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
  }, [map]);


  return (
    <>
      <div className='info'>
        Lat: { coords.lat } | Lng: { coords.lng } | zoom: { coords.zoom }
      </div>

      <div
        ref={ mapDiv }
        className='mapContainer'
      />
    </>
  )
}
