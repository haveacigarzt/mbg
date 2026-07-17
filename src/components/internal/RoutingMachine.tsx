import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

interface Props {
  currLat: number;
  currLng: number;
  tujuanLat: number;
  tujuanLng: number;
  onDistanceChange?: (distance: number) => void;
}

export default function RoutingMachine({ currLat, currLng, tujuanLat, tujuanLng, onDistanceChange }: Props) {
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

    routing.on('routesfound', (e: any) => {
      const route = e.routes[0];

      const distance = route.summary.totalDistance; // meter
      const time = route.summary.totalTime; // detik

      console.log('Jarak:', distance);
      console.log('Waktu:', time);

      onDistanceChange?.(distance);
    });

    return () => {
      map.removeControl(routing);
    };
  }, [map, currLat, currLng, tujuanLat, tujuanLng]);

  return null;
}
