import { MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet';
import { Fragment, useEffect, useState, useRef, useCallback } from 'react';
import type { Tracking } from '@/types/tracking';
import AnimatedMarker from './AnimatedMarker';
import RoutingMachine from './RoutingMachine';
import AutoPopupMarker from './AutoPopupMarker';
import type { PengeluaranHarianWithCoords } from '@/types/sppg';

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

interface Props {
  tracking: Tracking[] | undefined;
  pengeluaranBaru: PengeluaranHarianWithCoords | null;
}

const DashboardMap = ({ tracking, pengeluaranBaru }: Props) => {
  const colors = ['red', 'blue', 'green', 'orange', 'purple'];

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

        {tracking?.map((el) => (
          /* 2. OPTIMASI: Fragment eksternal dihapus, key diletakkan di Fragment utama yang membungkus semua elemen anak. */
          <Fragment key={el.pengiriman_id}>
            <AnimatedMarker color={colors[el.pengiriman_id % colors.length]} tracking={el} />

            <Marker position={[el.tujuan_lat, el.tujuan_lng]}>
              <Tooltip permanent direction="top" offset={[-15, -13]}>
                {el.tujuan_nama}
              </Tooltip>
            </Marker>

            <RoutingMachine currLat={el.latitude} currLng={el.longitude} tujuanLat={el.tujuan_lat} tujuanLng={el.tujuan_lng} />
          </Fragment>
        ))}
        {pengeluaranBaru && <AutoPopupMarker pengeluaranBaru={pengeluaranBaru} />}
      </MapContainer>
    </div>
  );
};

export default DashboardMap;
