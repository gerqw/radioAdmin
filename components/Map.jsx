import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// SVG como un string
const customIconSvg = `
<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16.2429 5.75732C18.586 8.10047 18.586 11.8995 16.2429 14.2426M7.75758 14.2426C5.41443 11.8995 5.41443 8.10047 7.75758 5.75732M4.92893 17.0711C1.02369 13.1658 1.02369 6.8342 4.92893 2.92896M19.0715 2.92896C22.9768 6.8342 22.9768 13.1658 19.0715 17.0711M12.0002 12C13.1048 12 14.0002 11.1046 14.0002 10C14.0002 8.89543 13.1048 8 12.0002 8C10.8957 8 10.0002 8.89543 10.0002 10C10.0002 11.1046 10.8957 12 12.0002 12ZM12.0002 12V21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const customIcon = L.divIcon({
  className: 'custom-icon',
  html: customIconSvg,
  iconSize: [24, 24],
});

export default function Map() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/estaciones') 
      .then((response) => response.json())
      .then((data) => setStations(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <MapContainer center={[-40.106404, -64.453560]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {stations.map((station) => (
        <Marker key={station.estacion} position={station.gps} icon={customIcon}>
          <Popup>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>{station.estacion}</h3>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: station.ping ? 'green' : 'red',
                  marginLeft: '10px',
                }}
              />
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
  
}
