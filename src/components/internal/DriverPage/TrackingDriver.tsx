import { Button } from "@/components/ui/button";
import { getPengirimanAktifByDriverIDQueryOptions } from "@/queryOptions/pengiriman";
import type { Pengiriman } from "@/types/pengiriman";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
  pengiriman: Pengiriman;
}

const TrackingDriver = ({ pengiriman }: Props) => {
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
          <div className="bg-amber-200 h-100">Maps</div>
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
