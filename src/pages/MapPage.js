import { useMapbox } from '../hooks/useMapbox';


const startingPoint = {
  lng: -89.6127,
  lat: 36.5985,
  zoom: 5.10
};


export const MapPage = () => {

  const { coords, setRef } = useMapbox( startingPoint );


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
