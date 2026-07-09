import { CircleMarker, Tooltip } from 'react-leaflet';
import { useEffect, useRef, useState } from 'react';
import type { Tracking } from '@/types/tracking';
import { ArrowRight } from 'lucide-react';

interface Props {
  tracking: Tracking;
  color: string;
}

export default function AnimatedMarker({ tracking, color }: Props) {
  const [position, setPosition] = useState({
    lat: tracking.latitude,
    lng: tracking.longitude
  });

  const animationRef = useRef<number>(0);

  useEffect(() => {
    const startLat = position.lat;
    const startLng = position.lng;

    const endLat = tracking.latitude;
    const endLng = tracking.longitude;

    const duration = 10000;
    const startTime = performance.now();

    cancelAnimationFrame(animationRef.current!);

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);

      setPosition({
        lat: startLat + (endLat - startLat) * progress,
        lng: startLng + (endLng - startLng) * progress
      });

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current!);
    };
  }, [tracking.latitude, tracking.longitude]);

  return (
    <>
      <CircleMarker
        center={[position.lat, position.lng]}
        radius={14}
        pathOptions={{
          color: 'transparent',
          fillColor: color,
          fillOpacity: 0.4
        }}
        className="pulse"
      />

      <CircleMarker
        center={[position.lat, position.lng]}
        radius={6}
        pathOptions={{
          color,
          fillColor: color,
          fillOpacity: 1
        }}
      >
        <Tooltip permanent direction="top" offset={[1, -13]}>
          {tracking.sppg_nama}
          <br />
          Driver: {tracking.driver_nama}
          <br />
          <div className="flex items-center gap-1">
            <ArrowRight size={15} />
            {tracking.tujuan_nama}
          </div>
        </Tooltip>
      </CircleMarker>
    </>
  );
}
