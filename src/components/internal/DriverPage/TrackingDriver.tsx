import { Button } from "@/components/ui/button";
import type { Pengiriman } from "@/types/pengiriman";
import { useEffect, useState } from "react";
import DriverMap from "./DriverMap";

interface Props {
  pengiriman: Pengiriman;
}

const dummyTracking = [
  {
    latitude: 0.12338290023859251,
    longitude: 110.60558480347815,
  },
  {
    latitude: 0.12311224693583053,
    longitude: 110.6054043675256,
  },
  {
    latitude: 0.12300914091500435,
    longitude: 110.60478572997395,
  },
  {
    latitude: 0.12285448188302084,
    longitude: 110.60408976272834,
  },
  {
    latitude: 0.12275137586120231,
    longitude: 110.60349690174134,
  },
  {
    latitude: 0.12269982285014676,
    longitude: 110.60309736498924,
  },
  {
    latitude: 0.12295758790444496,
    longitude: 110.60299425873063,
  },
  {
    latitude: 0.123318458976287,
    longitude: 110.6028782641897,
  },
  {
    latitude: 0.12378243606144913,
    longitude: 110.60272360480178,
  },
  {
    latitude: 0.12438818391041155,
    longitude: 110.60260761026085,
  },
  {
    latitude: 0.12487793748027519,
    longitude: 110.60251739228457,
  },
  {
    latitude: 0.1252774732805117,
    longitude: 110.60241428602595,
  },
  {
    latitude: 0.12553523830968352,
    longitude: 110.60227251492037,
  },
  {
    latitude: 0.12594766235108124,
    longitude: 110.6020405258385,
  },
  {
    latitude: 0.1261925391225784,
    longitude: 110.60166676565105,
  },
  {
    latitude: 0.12651474539733873,
    longitude: 110.60075169760592,
  },
  {
    latitude: 0.1266178514044249,
    longitude: 110.60071303275892,
  },
  {
    latitude: 0.12686272816959912,
    longitude: 110.60095791012311,
  },
  {
    latitude: 0.12719782268660207,
    longitude: 110.6010996812287,
  },
  {
    latitude: 0.1272880404404282,
    longitude: 110.60116412264034,
  },
  {
    latitude: 0.12770046445395156,
    longitude: 110.60128011718128,
  },
];

const TrackingDriver = ({ pengiriman }: Props) => {
  // useEffect(() => {
  //   if (!pengiriman) return;

  //   const sendLocation = () => {
  //     navigator.geolocation.getCurrentPosition(
  //       async (position) => {
  //         const payload = {
  //           pengirimanId: pengiriman.id,
  //           latitude: position.coords.latitude,
  //           longitude: position.coords.longitude,
  //           speed: position.coords.speed ?? 0,
  //           accuracy: position.coords.accuracy,
  //         };
  //         console.log(payload);
  //         // await trackingMutation.mutateAsync();
  //       },
  //       console.error,
  //       {
  //         enableHighAccuracy: true,
  //       },
  //     );
  //   };

  //   sendLocation();

  //   const interval = setInterval(sendLocation, 30000);

  //   return () => clearInterval(interval);
  // }, [pengiriman]);

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % dummyTracking.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const currentPosition = dummyTracking[idx];

  const [position, setPosition] = useState({
    lat: dummyTracking[0].latitude,
    lng: dummyTracking[0].longitude,
  });

  useEffect(() => {
    const target = dummyTracking[idx];

    const start = {
      lat: position.lat,
      lng: position.lng,
    };

    const duration = 30000; // sama dengan interval GPS
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);

      setPosition({
        lat: start.lat + (target.latitude - start.lat) * progress,
        lng: start.lng + (target.longitude - start.lng) * progress,
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [idx]);

  const path = dummyTracking
    .slice(0, idx + 1)
    .map((p) => [p.latitude, p.longitude] as [number, number]);

  return (
    <>
      <b>Pengiriman Anda</b>
      {pengiriman ? (
        <div>
          <p>
            <span className="font-bold">Tujuan: </span>
            {pengiriman.tujuan_nama}
          </p>
          <p>
            <span className="font-bold">Waktu Berangkat:</span>
            {pengiriman.waktu_berangkat}
          </p>
          <p>
            <span className="font-bold">Pos:</span>
            {currentPosition.latitude}, {currentPosition.longitude}
          </p>
          <div className="bg-amber-200 h-100">
            <DriverMap
              latitude={position.lat}
              longitude={position.lng}
              path={path}
              tujuan={pengiriman.tujuan_nama}
              tujuan_pos={[
                pengiriman.tujuan_latitude,
                pengiriman.tujuan_longitude,
              ]}
            />
          </div>
          <div className="flex justify-center gap-5">
            <Button className="bg-red-600 hover:bg-red-700 text-white py-0.5 px-5">
              Batal
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white py-0.5 px-5">
              Sampai
            </Button>
          </div>
        </div>
      ) : (
        <p>Tidak ada pengiriman aktif</p>
      )}
    </>
  );
};

export default TrackingDriver;
