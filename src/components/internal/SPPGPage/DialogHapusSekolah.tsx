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
import { deleteSekolahMutationOptions } from "@/queryOptions/sekolah";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode;
  onSuccess: () => void;
  id: number;
  nama: string;
}

const DialogHapusSekolah = ({ children, onSuccess, id, nama }: Props) => {
  const [open, setOpen] = useState(false);
  const mutation = useMutation({
    ...deleteSekolahMutationOptions(),
    onSuccess: () => {
      toast.success(`Berhasil menghapus sekolah ${nama}`, {
        style: {
          "--normal-bg":
            "color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))",
          "--normal-text":
            "light-dark(var(--color-green-600), var(--color-green-400))",
          "--normal-border":
            "light-dark(var(--color-green-600), var(--color-green-400))",
        } as React.CSSProperties,
      });
      onSuccess();
      setOpen(false);
    },
    onError: (error: ApiError) => {
      toast.error("Terjadi kesalahan server. Harap menunggu beberapa saat", {
        position: "top-center",
        style: {
          "--normal-bg":
            "color-mix(in oklab, var(--destructive) 10%, var(--background))",
          "--normal-text": "var(--destructive)",
          "--normal-border": "var(--destructive)",
        } as React.CSSProperties,
      });
      console.log(error);
    },
  });

  const handleDelete = async (id: number) => {
    await mutation.mutateAsync(id);
  };
  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg me-7">
            Apakah Anda yakin ingin menghapus sekolah ini?
          </DialogTitle>
          <DialogDescription>
            Tindakan ini akan secara permanen menghapus sekolah {nama} dari
            server.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button
            onClick={() => handleDelete(id)}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Lanjutkan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogHapusSekolah;
