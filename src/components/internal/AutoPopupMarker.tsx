import type { PengeluaranHarianWithCoords } from '@/types/sppg';
import { useEffect, useRef } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface Props {
  pengeluaranBaru: PengeluaranHarianWithCoords | null;
}

export default function AutoPopupMarker({ pengeluaranBaru }: Props) {
  const markerRef = useRef<L.Marker>(null);

  const invisibleIcon = L.divIcon({
    className: '',
    html: '',
    iconSize: [1, 1]
  });

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    marker.openPopup();

    const timeout = setTimeout(() => {
      marker.closePopup();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [pengeluaranBaru]);

  if (!pengeluaranBaru) return;

  return (
    <Marker ref={markerRef} position={[pengeluaranBaru.latitude_pedagang_lokal, pengeluaranBaru.longitude_pedagang_lokal]} icon={invisibleIcon}>
      <Popup>
        <div>
          <b>{pengeluaranBaru.nama_pedagang_lokal}</b>
          <br />
          {pengeluaranBaru.produk}
          <br />
          {pengeluaranBaru.jumlah} {pengeluaranBaru.satuan}
        </div>
      </Popup>
    </Marker>
  );
}
