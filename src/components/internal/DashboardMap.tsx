import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet';
import { Fragment, useEffect, useState, useRef, useCallback } from 'react';
import type { Tracking } from '@/types/tracking';
import AnimatedMarker from './AnimatedMarker';
import RoutingMachine from './RoutingMachine';
import AutoPopupMarker from './AutoPopupMarker';
import type { PengeluaranHarianWithCoords } from '@/types/sppg';
import { getPengirimanColor } from '@/lib/pengirimancolors';

const CtrlScrollZoom = ({ onRequireCtrl }: { onRequireCtrl: () => void }) => {
  const map = useMap();

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const zoomDelta = e.deltaY > 0 ? -1 : 1;
        const currentZoom = map.getZoom();
        map.setZoomAround(map.mouseEventToLatLng(e), currentZoom + zoomDelta);
      } else {
        onRequireCtrl();
      }
    };

    const container = map.getContainer();
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [map, onRequireCtrl]);

  return null;
};

// Otomatis geser map ke posisi truk yang lagi dipilih tiap kali ganti pengiriman
const FlyToSelected = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), { duration: 1 });
  }, [lat, lng, map]);
  return null;
};

interface Props {
  tracking: Tracking[] | undefined;
  pengeluaranBaru: PengeluaranHarianWithCoords | null;
  selectedPengirimanId: number | null;
}

const DashboardMap = ({ tracking, pengeluaranBaru, selectedPengirimanId }: Props) => {
  // State dan ref overlay
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleRequireCtrl = useCallback(() => {
    setShowOverlay(true);
    if (overlayTimeoutRef.current) clearTimeout(overlayTimeoutRef.current);
    overlayTimeoutRef.current = setTimeout(() => {
      setShowOverlay(false);
    }, 1500);
  }, []);
  useEffect(() => {
    return () => {
      if (overlayTimeoutRef.current) clearTimeout(overlayTimeoutRef.current);
    };
  }, []);

  const [distance, setDistance] = useState(0);

  // Cuma ambil 1 tracking yang lagi dipilih dari panel kanan.
  // Fallback ke tracking pertama HANYA kalau belum ada seleksi sama sekali (selectedPengirimanId null).
  // Kalau selectedPengirimanId sudah ada tapi datanya belum ketemu di `tracking`
  // (misal truk itu belum pernah kirim posisi lewat WebSocket), JANGAN fallback ke tracking lain —
  // biar keliatan jelas kalau memang datanya belum ada, bukan diam-diam nampilin data truk yang salah.
  const selectedTracking = selectedPengirimanId ? tracking?.find((el) => el.pengiriman_id === selectedPengirimanId) : tracking?.[0];

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      {/* Overlay Alert */}
      <div className={`absolute inset-0 z-[9999] pointer-events-none flex items-center justify-center bg-black/40 transition-opacity duration-300 ${showOverlay ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-white text-2xl font-semibold tracking-wide text-center px-4">Use ctrl + scroll to zoom the map</span>
      </div>

      <MapContainer center={[0.12174351770078276, 110.59555590575488]} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        {/*Passing fungsi trigger alert ke komponen CtrlScrollZoom */}
        <CtrlScrollZoom onRequireCtrl={handleRequireCtrl} />

        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {selectedTracking && (
          <Fragment key={selectedTracking.pengiriman_id}>
            <FlyToSelected lat={selectedTracking.latitude} lng={selectedTracking.longitude} />

            <AnimatedMarker color={getPengirimanColor(selectedTracking.pengiriman_id).name} tracking={selectedTracking} distance={distance} />

            <Marker position={[selectedTracking.tujuan_lat, selectedTracking.tujuan_lng]}>
              <Tooltip permanent direction="top" offset={[-15, -13]}>
                {selectedTracking.tujuan_nama}
              </Tooltip>
            </Marker>

            <RoutingMachine
              currLat={selectedTracking.latitude}
              currLng={selectedTracking.longitude}
              tujuanLat={selectedTracking.tujuan_lat}
              tujuanLng={selectedTracking.tujuan_lng}
              onDistanceChange={setDistance}
            />
          </Fragment>
        )}
        {pengeluaranBaru && <AutoPopupMarker pengeluaranBaru={pengeluaranBaru} />}
      </MapContainer>

      {/* Muncul kalau pengiriman sudah dipilih tapi datanya belum ada di `tracking`
          (misal truk itu belum pernah kirim posisi lewat WebSocket) */}
      {selectedPengirimanId && !selectedTracking && (
        <div className="absolute inset-x-0 top-4 z-[999] flex justify-center pointer-events-none">
          <div className="bg-white/90 rounded-full px-4 py-1.5 text-xs font-medium text-gray-500 shadow">Menunggu data lokasi truk...</div>
        </div>
      )}
    </div>
  );
};

export default DashboardMap;
