import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

interface Props {
  currLat: number;
  currLng: number;
  tujuanLat: number;
  tujuanLng: number;
}

export default function RoutingMachine({ currLat, currLng, tujuanLat, tujuanLng }: Props) {
  const map = useMap();

  useEffect(() => {
    const routing = L.Routing.control({
      waypoints: [L.latLng(currLat, currLng), L.latLng(tujuanLat, tujuanLng)],
      createMarker: () => false,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false
    } as any).addTo(map);

    return () => {
      map.removeControl(routing);
    };
  }, [map, currLat, currLng, tujuanLat, tujuanLng]);

  return null;
}
