import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, MapPin } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

interface DialogTambahPedagangProps {
  children: React.ReactNode;
  updateField(field: string, value: any): void;
}

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

const DialogGetCoords = ({ children, updateField }: DialogTambahPedagangProps) => {
  const [open, setOpen] = useState(false);

  const [getLocLoading, setGetLocLoading] = useState(false);

  async function getLocation() {
    setGetLocLoading(true);
    type Location = {
      latitude: number;
      longitude: number;
    };
    async function getLocation(): Promise<Location> {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            resolve({
              latitude: coords.latitude,
              longitude: coords.longitude
            });
          },
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });
    }
    const location = await getLocation();
    setPosition({ lat: location.latitude, lng: location.longitude });
    setGetLocLoading(false);
  }

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

  const markerRef = useRef<L.Marker>(null);

  const [position, setPosition] = useState({
    lat: 0.12174351770078276,
    lng: 110.59555590575488
  });

  const handlePakai = () => {
    updateField('latitude', position.lat);
    updateField('longitude', position.lng);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)} modal={false}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-md
            data-[state=open]:animate-in
            data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0
            data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95
            data-[state=open]:zoom-in-95
            duration-300 gap-4
          "
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="gap-0">
          <DialogTitle className="text-lg font-semibold">Tentukan koordinat lokasi</DialogTitle>
          <DialogDescription>Geser marker atau pakai lokasi saat ini. Klik tambah saat selesai.</DialogDescription>
        </DialogHeader>
        <div className="w-100 h-80 relative">
          {/* Overlay Alert */}
          <div className={`absolute inset-0 z-9999 pointer-events-none flex items-center justify-center bg-black/40 transition-opacity duration-300 ${showOverlay ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-white text-2xl font-semibold tracking-wide text-center px-4">Use ctrl + scroll to zoom the map</span>
          </div>

          <MapContainer center={[0.12174351770078276, 110.59555590575488]} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
            {/*Passing fungsi trigger alert ke komponen CtrlScrollZoom */}
            <CtrlScrollZoom onRequireCtrl={handleRequireCtrl} />

            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              draggable
              position={position}
              ref={markerRef}
              eventHandlers={{
                dragend: () => {
                  const marker = markerRef.current;
                  if (!marker) return;
                  const { lat, lng } = marker.getLatLng();
                  setPosition({ lat, lng });
                }
              }}
            />
          </MapContainer>
        </div>
        <div className="grid grid-cols-7 gap-2 items-end">
          <div className="col-span-3">
            <Label htmlFor="lat" className="mb-1">
              Laltitude
            </Label>
            <Input id="lat" type="number" placeholder="Latitude" value={position.lat} required disabled />
          </div>
          <div className="col-span-3">
            <Label htmlFor="lon" className="mb-1">
              Longitude
            </Label>
            <Input id="lon" type="number" placeholder="Longitude" value={position.lng} required disabled />
          </div>
          <Button title="Pakai lokasi perangkat saat ini" className="col-span-1 bg-blue-600 rounded-xl text-white hover:bg-blue-700" type="button" onClick={getLocation}>
            {getLocLoading ? <Loader2 className="animate-spin" /> : <MapPin />}
          </Button>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              Batal
            </Button>
          </DialogClose>
          <Button type="submit" className="text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors" onClick={handlePakai}>
            Pakai
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogGetCoords;
