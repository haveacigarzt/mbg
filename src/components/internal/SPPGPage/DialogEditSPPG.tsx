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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  getKelurahanQueryOptions,
  updateSPPGMutationOptions,
} from "@/queryOptions/sppg";
import { sppgSchema } from "@/schema/sppg";
import type { Distrik, PostSPPG, SPPG } from "@/types/sppg";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  data: SPPG;
  kecamatan: Distrik[];
  kelurahan: Distrik[];
  onSPPGUpdate?: () => void;
}

export function DialogEditSPPG({
  data,
  kecamatan,
  kelurahan,
  onSPPGUpdate,
}: Props) {
  const [open, setOpen] = useState(false);
  const initialForm = {
    nama: data.nama || "",
    alamat: data.alamat || "",
    kepala_sppg: data.kepala_sppg || "",
    nomor_telepon: data.nomor_telepon || "",
    email: data.email || "",
    kelurahan_id: data.kelurahan_id || 0,
    kecamatan_id: data.kecamatan_id || 0,
    kapasitas_porsi: data.kapasitas_porsi || 0,
    status_aktif: data.status_aktif || false,
    latitude: data.latitude || 0,
    longitude: data.longitude || 0,
    sosmed_url: data.sosmed_url || [],
  };

  const [form, setForm] = useState(initialForm);

  function normalizeForm(form: typeof initialForm) {
    return {
      ...form,
      sosmed_url: form.sosmed_url.map((url) => url.trim()).filter(Boolean),
    };
  }

  const isDirty =
    JSON.stringify(normalizeForm(form)) !==
    JSON.stringify(normalizeForm(initialForm));

  function updateField(field: string, value: any) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  const mutation = useMutation({
    ...updateSPPGMutationOptions(),
    onSuccess: () => {
      toast.success("Berhasil memperbarui data SPPG.", {
        style: {
          "--normal-bg":
            "color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))",
          "--normal-text":
            "light-dark(var(--color-green-600), var(--color-green-400))",
          "--normal-border":
            "light-dark(var(--color-green-600), var(--color-green-400))",
        } as React.CSSProperties,
      });
      onSPPGUpdate?.();
      setOpen(false);
    },
    onError: (error: ApiError) => {
      toast.error("Gagal memperbarui data SPPG.", {
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = sppgSchema.safeParse(form);

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
      sppg_id: data.id,
      input: result.data as PostSPPG,
    });
  }

  const { data: kelurahanNew } = useQuery({
    ...getKelurahanQueryOptions(form.kecamatan_id),
    enabled: form.kecamatan_id !== null,
    initialData: kelurahan,
  });

  function updateKelurahan(id: number) {
    updateField("kecamatan_id", id);
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

  const MAX_URL = 3;

  const addSosmed = () => {
    if (form.sosmed_url.length >= MAX_URL) return;
    updateField("sosmed_url", [...form.sosmed_url, ""]);
  };

  const updateSosmed = (index: number, value: string) => {
    const urls = [...form.sosmed_url];
    urls[index] = value;
    updateField("sosmed_url", urls);
  };

  const removeSosmed = (index: number) => {
    updateField(
      "sosmed_url",
      form.sosmed_url.filter((_, i) => i !== index),
    );
  };
  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Edit</Button>
        </DialogTrigger>
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
          <form onSubmit={onSubmit}>
            <DialogHeader className="gap-0">
              <DialogTitle className="text-lg font-semibold">
                Edit data SPPG
              </DialogTitle>
              <DialogDescription>
                Ubah data SPPG anda. Klik simpan saat selesai.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-4 py-5">
              <div className="flex flex-1 flex-col gap-5">
                <div>
                  <Label htmlFor="sppg" className="mb-1">
                    Nama SPPG
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
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="kecamatan" className="mb-1">
                      Kecamatan
                    </Label>
                    <NativeSelect
                      id="kecamatan"
                      onChange={(e) => {
                        updateField("kecamatan", e.target.value);
                        updateKelurahan(Number(e.target.value));
                      }}
                      defaultValue={form.kecamatan_id}
                      className="w-full"
                    >
                      {" "}
                      <NativeSelectOption
                        disabled
                        value=""
                        className="text-center"
                      >
                        --- Pilih Kecamatan ---
                      </NativeSelectOption>
                      {kecamatan.map((el) => (
                        <NativeSelectOption key={el.id} value={el.id}>
                          {el.name}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </div>
                  <div>
                    <Label htmlFor="kelurahan" className="mb-1">
                      Kelurahan
                    </Label>
                    <NativeSelect
                      id="kelurahan"
                      onChange={(e) => updateField("kelurahan", e.target.value)}
                      defaultValue={form.kelurahan_id || 0}
                      className="w-full"
                    >
                      <NativeSelectOption
                        disabled
                        value=""
                        className="text-center"
                      >
                        --- Pilih Kelurahan ---
                      </NativeSelectOption>
                      {kelurahanNew.map((el) => (
                        <NativeSelectOption key={el.id} value={el.id}>
                          {el.name}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-3">
                    <Label htmlFor="email" className="mb-1">
                      Email
                    </Label>
                    <Input
                      id="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="telepon" className="mb-1">
                      No. Telepon
                    </Label>
                    <Input
                      id="telepon"
                      placeholder="No. Telepon"
                      value={form.nomor_telepon}
                      onChange={(e) =>
                        updateField("nomor_telepon", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="kepala_sppg" className="mb-1">
                      Kepala SPPG
                    </Label>
                    <Input
                      id="kepala_sppg"
                      placeholder="Kepala SPPG"
                      value={form.kepala_sppg}
                      onChange={(e) =>
                        updateField("kepala_sppg", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="kapasitas" className="mb-1">
                      Kapasitas Porsi
                    </Label>
                    <Input
                      id="kapasitas"
                      type="number"
                      placeholder="Kapasitas Porsi"
                      value={form.kapasitas_porsi}
                      onChange={(e) =>
                        updateField("kapasitas_porsi", Number(e.target.value))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between border p-3 rounded">
                  <span>Status Aktif</span>
                  <Switch
                    checked={form.status_aktif}
                    onCheckedChange={(val) => updateField("status_aktif", val)}
                    required
                  />
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
                      onChange={(e) =>
                        updateField("latitude", Number(e.target.value))
                      }
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
                      onChange={(e) =>
                        updateField("longitude", Number(e.target.value))
                      }
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
                <div>
                  <Label>Sosial Media</Label>

                  <div className="space-y-2 mt-2">
                    {form.sosmed_url.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={url}
                          placeholder="https://..."
                          onChange={(e) => updateSosmed(index, e.target.value)}
                        />

                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeSosmed(index)}
                        >
                          Hapus
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={addSosmed}
                  >
                    Tambah URL
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <Button type="submit" disabled={!isDirty || mutation.isPending}>
                {mutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </form>
    </Dialog>
  );
}
