import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Typography } from '@mui/material';
import {renderToStaticMarkup} from 'react-dom/server'
import 'leaflet/dist/leaflet.css';
import RoomIcon from '@mui/icons-material/Room';
import Leaflet from 'leaflet'
import styles from '../../styles/Explore.module.css'

function Map({ rooms,setSelectedRoom }) {
  const center = [59.35, 18.07]; // coordinates for Stockholm
  const iconHTML = renderToStaticMarkup(<RoomIcon />)
  const customMarkerIcon = new Leaflet.DivIcon({
      html: iconHTML,
      className: 'dummy'
  });
  return (
    <MapContainer center={center} zoom={15} style={{ height: '500px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {rooms.map((room) => (
        <Marker 
          key={room.id}
          position={[room.lat, room.lng]}
          icon={customMarkerIcon}
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
    </MapContainer>
  );
}

export default Map;