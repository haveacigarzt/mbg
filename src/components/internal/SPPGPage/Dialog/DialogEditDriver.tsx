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
import { Switch } from "@/components/ui/switch";
import { updateDriverMutationOptions } from "@/queryOptions/drivers";
import { driverPatchSchema } from "@/schema/formValidation";
import type { Drivers, PatchDriver } from "@/types/drivers";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DialogEditDriverProps {
  onDriverUpdate: () => void;
  children: React.ReactNode;
  driver: Drivers;
}

const DialogEditDriver = ({
  onDriverUpdate,
  children,
  driver,
}: DialogEditDriverProps) => {
  const [open, setOpen] = useState(false);
  const initialForm = {
    nama: driver.nama,
    nomor_telepon: driver.nomor_telepon,
    status_aktif: driver.status_aktif,
  };
  const [form, setForm] = useState(initialForm);

  function updateField(field: string, value: any) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }
  const mutation = useMutation({
    ...updateDriverMutationOptions(),
    onSuccess: () => {
      toast.success("Berhasil mengubah data Driver.", {
        style: {
          "--normal-bg":
            "color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))",
          "--normal-text":
            "light-dark(var(--color-green-600), var(--color-green-400))",
          "--normal-border":
            "light-dark(var(--color-green-600), var(--color-green-400))",
        } as React.CSSProperties,
      });
      onDriverUpdate();
      setOpen(false);
    },
    onError: (error: ApiError) => {
      toast.error("Gagal mengubah data Driver.", {
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

    const result = driverPatchSchema.safeParse(form);

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
      input: result.data as PatchDriver,
      id: driver.id,
    });
  }
  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-xl
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
              Ubah data Driver
            </DialogTitle>
            <DialogDescription>
              Ubah data Driver di SPPG anda. Klik simpan saat selesai.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 py-5">
            <div className="flex flex-col flex-1 gap-4">
              <div>
                <Label htmlFor="nama" className="mb-1">
                  Nama Driver
                </Label>
                <Input
                  id="nama"
                  placeholder="Nama"
                  value={form.nama}
                  onChange={(e) => updateField("nama", e.target.value)}
                  required
                />
              </div>
              <div></div>
            </div>
            <div className="flex flex-col flex-1 gap-4">
              <div>
                <Label htmlFor="telepon" className="mb-1">
                  No Telepon
                </Label>
                <Input
                  id="telepon"
                  placeholder="No Telepon"
                  value={form.nomor_telepon}
                  onChange={(e) => updateField("nomor_telepon", e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between border p-3 rounded">
                <span>Status Aktif</span>
                <Switch
                  checked={form.status_aktif}
                  onCheckedChange={(val) => updateField("status_aktif", val)}
                />
              </div>
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

export default DialogEditDriver;
