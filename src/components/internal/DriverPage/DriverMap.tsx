import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import driverIconPng from "@/assets/delivery-truck.png";
import L from "leaflet";
import { useEffect } from "react";

interface Props {
  latitude: number;
  longitude: number;
  path: [number, number][];
  tujuan_pos: [number, number];
  tujuan: string;
}

const DriverMap = ({
  latitude,
  longitude,
  path,
  tujuan,
  tujuan_pos,
}: Props) => {
  const driverIcon = L.icon({
    iconUrl: driverIconPng,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -40],
  });
  function FollowMarker({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();

    useEffect(() => {
      map.panTo([lat, lng], {
        animate: true,
      });
    }, [lat, lng, map]);

    return null;
  }

  return (
    <MapContainer center={[0, 0]} zoom={15} className="h-full w-full z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} icon={driverIcon}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <Marker position={[tujuan_pos[0], tujuan_pos[1]]}>
        <Popup>{tujuan}</Popup>
      </Marker>
      <Polyline positions={path} />
      <FollowMarker lat={latitude} lng={longitude} />
    </MapContainer>
  );
};

export default DriverMap;
