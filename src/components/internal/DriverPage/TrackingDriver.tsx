import { Button } from "@/components/ui/button";
import type { Pengiriman } from "@/types/pengiriman";
import { useEffect, useState } from "react";
import DriverMap from "./DriverMap";
import { useMutation } from "@tanstack/react-query";
import { createTrackingMutationOptions } from "@/queryOptions/tracking";
import type { ApiError } from "@/api/client";
import DialogConfirmBatal from "./Dialog/DialogConfirmBatal";
import DialogConfirmSampai from "./Dialog/DialogConfirmSampai";
import type { CreateTrackingInput } from "@/types/tracking";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Props {
  pengiriman: Pengiriman;
  refetchAll: () => void;
  sppg_id: number;
}

const dummyTrackingA = [
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

const dummyTrackingB = [
  {
    latitude: 0.12024148387039542,
    longitude: 110.58510601939116,
  },
  {
    latitude: 0.12088521259630856,
    longitude: 110.58347523626813,
  },
  {
    latitude: 0.12114270408239662,
    longitude: 110.58270276005197,
  },
  {
    latitude: 0.1214431108130936,
    longitude: 110.58235943728923,
  },
  {
    latitude: 0.1220010090183523,
    longitude: 110.58167279176374,
  },
  {
    latitude: 0.12212975475639014,
    longitude: 110.58150113038238,
  },
  {
    latitude: 0.1223443309850707,
    longitude: 110.58064282347551,
  },
  {
    latitude: 0.12225850049380457,
    longitude: 110.57995617795002,
  },
  {
    latitude: 0.12225850049380457,
    longitude: 110.57905495569783,
  },
  {
    latitude: 0.12212975475639014,
    longitude: 110.57841122551767,
  },
  {
    latitude: 0.12208683951044537,
    longitude: 110.57841122551767,
  },
  {
    latitude: 0.12225850049380457,
    longitude: 110.57789624137357,
  },
  {
    latitude: 0.122043924264437,
    longitude: 110.57725251119344,
  },
  {
    latitude: 0.12165768704724472,
    longitude: 110.57648003497727,
  },
  {
    latitude: 0.12221558524806338,
    longitude: 110.57566464341575,
  },
  {
    latitude: 0.12238724623060836,
    longitude: 110.57549298203438,
  },
  {
    latitude: 0.12315802391352076,
    longitude: 110.57469462658389,
  },
  {
    latitude: 0.12303664127232755,
    longitude: 110.57396632902287,
  },
  {
    latitude: 0.12324906089407536,
    longitude: 110.57363252597408,
  },
  {
    latitude: 0.1237042457921284,
    longitude: 110.57275249975451,
  },
  {
    latitude: 0.12394701106788657,
    longitude: 110.57211523938864,
  },
  {
    latitude: 0.12412908502325803,
    longitude: 110.5720242021935,
  },
  {
    latitude: 0.12443254161274916,
    longitude: 110.57138694182763,
  },
  {
    latitude: 0.12516083741326883,
    longitude: 110.57087106438857,
  },
  {
    latitude: 0.12531256570250568,
    longitude: 110.57002138390072,
  },
  {
    latitude: 0.1268353398297325,
    longitude: 110.5690282709128,
  },
];

const TrackingDriver = ({ pengiriman, refetchAll, sppg_id }: Props) => {
  const [usingDummy, setUsingDummy] = useState(false);

  const dummyTracking = sppg_id === 4 ? dummyTrackingB : dummyTrackingA;

  const mutation = useMutation({
    ...createTrackingMutationOptions(),
    onSuccess: () => {
      console.log(`Berhasil mengirim tracking posisi`);
    },
    onError: (error: ApiError) => {
      console.log(`Gagal mengirim tracking posisi. ${error.message}`);
    },
  });
  const [idx, setIdx] = useState(0);

  function getCurrentLocation() {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
      });
    });
  }

  useEffect(() => {
    if (!pengiriman) return;

    const interval = setInterval(async () => {
      let payload = {} as CreateTrackingInput;

      if (usingDummy) {
        const point = dummyTracking[idx];

        payload = {
          ...point,
          pengiriman_id: pengiriman.id,
          speed: 20,
          accuracy: 5,
        };
      } else {
        const position = await getCurrentLocation();

        payload = {
          pengiriman_id: pengiriman.id,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          speed: position.coords.speed ?? 0,
          accuracy: position.coords.accuracy,
        };
      }

      try {
        await mutation.mutateAsync({ input: payload });

        setIdx((prev) => (prev + 1) % dummyTracking.length);
      } catch (err) {
        console.error(err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [pengiriman, idx, usingDummy]);

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

    const duration = 10000; // sama dengan interval GPS
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
          <div className="flex items-center space-x-2">
            <Switch
              id="airplane-mode"
              checked={usingDummy}
              onCheckedChange={setUsingDummy}
            />
            <Label htmlFor="airplane-mode">Pakai Data Dummy</Label>
          </div>
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
            <DialogConfirmBatal
              nama={pengiriman.tujuan_nama}
              id={pengiriman.id}
              refetchAll={refetchAll}
            >
              <Button className="bg-red-600 hover:bg-red-700 text-white py-0.5 px-5">
                Batal
              </Button>
            </DialogConfirmBatal>
            <DialogConfirmSampai
              nama={pengiriman.tujuan_nama}
              id={pengiriman.id}
              refetchAll={refetchAll}
            >
              <Button className="bg-green-600 hover:bg-green-700 text-white py-0.5 px-5">
                Sampai
              </Button>
            </DialogConfirmSampai>
          </div>
        </div>
      ) : (
        <p>Tidak ada pengiriman aktif</p>
      )}
    </>
  );
};

export default TrackingDriver;
