import { useEffect } from 'react';
import { useMapbox } from '../hooks/useMapbox';


const startingPoint = {
  lng: -89.6127,
  lat: 36.5985,
  zoom: 5.10
};


export const MapPage = () => {

  const { coords, setRef, newMarker$, markerMovement$ } = useMapbox( startingPoint );

  // New marker
  useEffect( () => {
    newMarker$.subscribe( marker => {
      // TODO: new marker to emit
    });

  }, [newMarker$]);


  // Marker movement
  useEffect( () => {
    markerMovement$.subscribe( marker => {
      console.log(marker);
    });

  }, [markerMovement$]);


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
