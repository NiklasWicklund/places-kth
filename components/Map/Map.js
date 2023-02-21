import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Typography } from '@mui/material';
import {renderToStaticMarkup} from 'react-dom/server'
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import RoomIcon from '@mui/icons-material/Room';
import Leaflet from 'leaflet'
import styles from '../../styles/Explore.module.css'
import { MarkerCluster } from './MarkerCluster';

function Map({ rooms,setSelectedRoom }) {
  const center = [59.35, 18.07]; // coordinates for Stockholm
  const iconHTML = renderToStaticMarkup(<RoomIcon />)
  const customMarkerIcon = new Leaflet.DivIcon({
      html: iconHTML,
      className: 'dummy'
  });
  Leaflet.Marker.prototype.options.icon = Leaflet.icon({
    iconUrl: 'marker.svg',
    iconRetinaUrl: 'marker.svg',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    shadowUrl: 'marker-shadow.png',
    shadowRetinaUrl: 'marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  })

  return (
    <MapContainer center={center} zoom={15} maxZoom={19} style={{ height: '500px' }}>
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
      />
      <MarkerCluster>

      
      {rooms.map((room) => (
        <Marker 
          key={room.id}
          position={[room.lat, room.lng]}
          
          eventHandlers={{
            click: (e) => {
              setSelectedRoom(room);  // will print 'FooBar' in console
            },
          }}
        >
          <Popup>
            {room.name}
          </Popup>
        </Marker>
        ))}
        </MarkerCluster>
    </MapContainer>
  );
}

export default Map;