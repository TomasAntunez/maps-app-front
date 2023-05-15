import { useEffect, useContext } from 'react';

import { useMapbox } from '../hooks/useMapbox';
import { SocketContext } from '../context/SocketProvider';


const startingPoint = {
  lng: -89.6127,
  lat: 36.5985,
  zoom: 5.10
};


export const MapPage = () => {

  const { coords, setRef, newMarker$, markerMovement$, addMarker, updateLocation } = useMapbox( startingPoint );
  const { socket } = useContext( SocketContext );

  // Listen to existing markers and new markers
  useEffect( () => {
    socket.on( 'active-markers', markers => {
      for( const key of Object.keys(markers) ) {
        addMarker( markers[key], key );
      }
    });

    socket.on( 'new-marker', marker => {
      addMarker( marker, marker.id );
    });

  }, [socket, addMarker]);

  // New marker
  useEffect( () => {
    newMarker$.subscribe( marker => {
      socket.emit( 'new-marker', marker );
    });

  }, [newMarker$, socket]);


  // Marker movement
  useEffect( () => {
    markerMovement$.subscribe( marker => {
      socket.emit( 'update-marker', marker );
    });

  }, [markerMovement$, socket]);


  useEffect( () => {
    socket.on( 'update-marker', marker => {
      updateLocation( marker );
    });
  }, [socket, updateLocation]);


  return (
    <>
      <div className='info'>
        Lat: { coords.lat } | Lng: { coords.lng } | zoom: { coords.zoom }
      </div>

      <div
        ref={ setRef }
        className='mapContainer'
      />
    </>
  )
}
