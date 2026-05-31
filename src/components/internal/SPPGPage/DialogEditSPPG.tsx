import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { SPPG } from "@/types/sppg";
import { useState } from "react";

interface Props {
  data: SPPG;
}

export function DialogEditSPPG({ data }: Props) {
  const [form, setForm] = useState({
    nama: data.nama || "",
    alamat: data.alamat || "",
    kepala_sppg: data.kepala_sppg || "",
    nomor_telepon: data.nomor_telepon || "",
    email: data.email || "",
    kelurahan: data.kelurahan || "",
    kecamatan: data.kecamatan || "",
    kapasitas_porsi: data.kapasitas_porsi || 0,
    status_aktif: data.status_aktif || false,
    latitude: data.latitude || 0,
    longitude: data.longitude || 0,
    sosmed_url: data.sosmed_url || [],
  });

  function updateField(field: string, value: any) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("SUBMIT:", form);
    // TODO: kirim ke API Go kamu
  }
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl">
          <form onSubmit={onSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Edit data SPPG
              </DialogTitle>
              <DialogDescription>
                Ubah data SPPG anda. Klik simpan saat selesai.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-3">
                <Input
                  placeholder="Nama"
                  value={form.nama}
                  onChange={(e) => updateField("nama", e.target.value)}
                  required
                />

                <Textarea
                  placeholder="Alamat"
                  value={form.alamat}
                  onChange={(e) => updateField("alamat", e.target.value)}
                  required
                />

                <Input
                  placeholder="Kepala SPPG"
                  value={form.kepala_sppg}
                  onChange={(e) => updateField("kepala_sppg", e.target.value)}
                  required
                />

                <div className="grid grid-cols-5 gap-2">
                  <Input
                    className="col-span-3"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    required
                  />

                  <Input
                    className="col-span-2"
                    placeholder="Telepon"
                    value={form.nomor_telepon}
                    onChange={(e) =>
                      updateField("nomor_telepon", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Kelurahan"
                    value={form.kelurahan}
                    onChange={(e) => updateField("kelurahan", e.target.value)}
                    required
                  />

                  <Input
                    placeholder="Kecamatan"
                    value={form.kecamatan}
                    onChange={(e) => updateField("kecamatan", e.target.value)}
                    required
                  />
                </div>
                <Input
                  type="number"
                  placeholder="Kapasitas Porsi"
                  value={form.kapasitas_porsi}
                  onChange={(e) =>
                    updateField("kapasitas_porsi", Number(e.target.value))
                  }
                  required
                />

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Latitude"
                    value={form.latitude}
                    onChange={(e) =>
                      updateField("latitude", Number(e.target.value))
                    }
                    required
                  />

                  <Input
                    type="number"
                    placeholder="Longitude"
                    value={form.longitude}
                    onChange={(e) =>
                      updateField("longitude", Number(e.target.value))
                    }
                    required
                  />
                </div>

                <div className="flex items-center justify-between border p-3 rounded">
                  <span>Status Aktif</span>
                  <Switch
                    checked={form.status_aktif}
                    onCheckedChange={(val) => updateField("status_aktif", val)}
                    required
                  />
                </div>

                <Textarea
                  placeholder="Sosmed URL (pisahkan dengan enter)"
                  value={form.sosmed_url.join("\n")}
                  onChange={(e) =>
                    updateField(
                      "sosmed_url",
                      e.target.value.split("\n").filter(Boolean),
                    )
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </form>
    </Dialog>
  );
}
