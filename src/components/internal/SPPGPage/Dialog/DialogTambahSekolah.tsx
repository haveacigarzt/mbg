import type { ApiError } from "@/api/client";
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
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { createSekolahMutationOptions } from "@/queryOptions/sekolah";
import { sekolahSchema } from "@/schema/formValidation";
import type { PostSekolah } from "@/types/sekolah";
import type { Distrik } from "@/types/sppg";
import { useMutation } from "@tanstack/react-query";
import { Loader2, MapPin } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface DialogTambahSekolahProps {
  onSekolahUpdate: () => void;
  kelurahan: Distrik[];
  children: React.ReactNode;
  kecamatan: string;
  kecamatan_id: number;
  kelurahan_id: number;
}

const DialogTambahSekolah = ({
  children,
  kelurahan,
  onSekolahUpdate,
  kecamatan,
  kecamatan_id,
  kelurahan_id,
}: DialogTambahSekolahProps) => {
  const [open, setOpen] = useState(false);
  const initialForm = {
    nama: "",
    alamat: "",
    latitude: "",
    longitude: "",
    jumlah_siswa: "",
    tingkat: "SD" as "SD" | "SMP" | "SMA",
    kelurahan_id,
    kecamatan_id,
  };

  const [form, setForm] = useState(initialForm);

  function updateField(field: string, value: any) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  const mutation = useMutation({
    ...createSekolahMutationOptions(),
    onSuccess: () => {
      toast.success("Berhasil memperbarui data Sekolah.", {
        style: {
          "--normal-bg":
            "color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))",
          "--normal-text":
            "light-dark(var(--color-green-600), var(--color-green-400))",
          "--normal-border":
            "light-dark(var(--color-green-600), var(--color-green-400))",
        } as React.CSSProperties,
      });
      onSekolahUpdate?.();
      setOpen(false);
    },
    onError: (error: ApiError) => {
      toast.error("Gagal memperbarui data Sekolah.", {
        style: {
          "--normal-bg":
            "color-mix(in oklab, light-dark(var(--color-red-600), var(--color-red-400)) 10%, var(--background))",
          "--normal-text":
            "light-dark(var(--color-red-600), var(--color-red-400))",
          "--normal-border":
            "light-dark(var(--color-red-400), var(--color-red-400))",
        } as React.CSSProperties,
      });
      console.log("ERROR:", error);
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      jumlah_siswa: Number(form.jumlah_siswa),
      kelurahan_id: Number(form.kelurahan_id),
    };
    const result = sekolahSchema.safeParse(payload);

    if (!result.success) {
      const firstError = Object.values(
        result.error.flatten().fieldErrors,
      ).flat()[0];

      if (firstError) {
        toast.error(firstError, {
          style: {
            "--normal-bg":
              "color-mix(in oklab, light-dark(var(--color-red-600), var(--color-red-400)) 10%, var(--background))",
            "--normal-text":
              "light-dark(var(--color-red-600), var(--color-red-400))",
            "--normal-border":
              "light-dark(var(--color-red-400), var(--color-red-400))",
          } as React.CSSProperties,
        });
      }
      return;
    }
    await mutation.mutateAsync({
      input: result.data as PostSekolah,
    });
  }

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
              longitude: coords.longitude,
            });
          },
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          },
        );
      });
    }
    const location = await getLocation();
    updateField("latitude", Number(location.latitude));
    updateField("longitude", Number(location.longitude));
    setGetLocLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-4xl
            data-[state=open]:animate-in
            data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0
            data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95
            data-[state=open]:zoom-in-95
            duration-300
          "
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader className="gap-0">
            <DialogTitle className="text-lg font-semibold">
              Tambah data Sekolah
            </DialogTitle>
            <DialogDescription>
              Tambah data Sekolah di SPPG anda. Klik simpan saat selesai.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 py-5">
            <div className="flex flex-1 flex-col gap-5">
              <div>
                <Label htmlFor="sppg" className="mb-1">
                  Nama Sekolah
                </Label>
                <Input
                  id="sppg"
                  placeholder="Nama"
                  value={form.nama}
                  onChange={(e) => updateField("nama", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="alamat" className="mb-1">
                  Alamat
                </Label>
                <Textarea
                  id="alamat"
                  placeholder="Alamat"
                  value={form.alamat}
                  onChange={(e) => updateField("alamat", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="mb-1">Kecamatan</Label>
                  <NativeSelect disabled defaultValue={0} className="w-full">
                    <NativeSelectOption value="0">
                      {kecamatan}
                    </NativeSelectOption>
                  </NativeSelect>
                </div>
                <div>
                  <Label htmlFor="kelurahan" className="mb-1">
                    Kelurahan
                  </Label>
                  <NativeSelect
                    id="kelurahan"
                    onChange={(e) => {
                      updateField("kelurahan_id", Number(e.target.value));
                    }}
                    defaultValue={form.kelurahan_id}
                    className="w-full"
                  >
                    {kelurahan.map((el) => (
                      <NativeSelectOption key={el.id} value={el.id}>
                        {el.name}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="tingkat" className="mb-1">
                    Tingkat
                  </Label>
                  <NativeSelect
                    className="w-full"
                    id="tingkat"
                    value={form.tingkat}
                    onChange={(e) => updateField("tingkat", e.target.value)}
                  >
                    <NativeSelectOption value="SD">SD</NativeSelectOption>
                    <NativeSelectOption value="SMP">SMP</NativeSelectOption>
                    <NativeSelectOption value="SMA">SMA</NativeSelectOption>
                  </NativeSelect>
                </div>
                <div>
                  <Label htmlFor="jumlah_siswa" className="mb-1">
                    Jumlah Siswa
                  </Label>
                  <Input
                    id="jumlah_siswa"
                    type="number"
                    placeholder="Jumlah Siswa"
                    value={form.jumlah_siswa}
                    onChange={(e) =>
                      updateField("jumlah_siswa", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 items-end">
                <div className="col-span-3">
                  <Label htmlFor="lat" className="mb-1">
                    Laltitude
                  </Label>
                  <Input
                    id="lat"
                    type="number"
                    placeholder="Latitude"
                    value={form.latitude}
                    onChange={(e) => updateField("latitude", e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor="lon" className="mb-1">
                    Longitude
                  </Label>
                  <Input
                    id="lon"
                    type="number"
                    placeholder="Longitude"
                    value={form.longitude}
                    onChange={(e) => updateField("longitude", e.target.value)}
                    required
                  />
                </div>
                <Button
                  className="col-span-1"
                  type="button"
                  onClick={getLocation}
                >
                  {getLocLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <MapPin />
                  )}
                </Button>
              </div>
              <div></div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogTambahSekolah;
