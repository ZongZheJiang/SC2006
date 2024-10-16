import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import "leaflet/dist/leaflet.css"
import L from "leaflet";

const position = [51.505, -0.09]

const icon = L.icon({
    iconUrl:"./locationpin.png",
    iconSize: [40, 40]
})

export default function Maps() {
  
    function LocationMarker() {
        const [position, setPosition] = useState(null)
        
        const map = useMapEvents({
          locationfound(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
          },
        });
      
        useEffect(() => {
          // dependency array --> everytime the mapEvent changes, it will locate
          map.locate();
        }, [map]);
      
        return position === null ? null : (
          <Marker position={position} icon={icon}>
            <Popup>You are here</Popup>
          </Marker>
        )
      }
    return(
        <MapContainer center={position} zoom={13} scrollWheelZoom={true} style= {{ width: '100%', height: '100%'}}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={icon}>
            <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
            </Marker>
            <LocationMarker />
        </MapContainer>
    )
}