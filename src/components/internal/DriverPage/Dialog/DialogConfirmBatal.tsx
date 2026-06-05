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
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  antarPengirimanMutationOptions,
  updatePengirimanMutationOptions,
} from "@/queryOptions/pengiriman";

interface Props {
  children: React.ReactNode;
  refetchAll: () => void;
  id: number;
  nama: string;
}

const DialogConfirmBatal = ({ children, refetchAll, id, nama }: Props) => {
  const [open, setOpen] = useState(false);
  const mutation = useMutation({
    ...updatePengirimanMutationOptions(),
    onSuccess: () => {
      toast.success(`Berhasil update status pengiriman ke ${nama}`, {
        style: {
          "--normal-bg":
            "color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))",
          "--normal-text":
            "light-dark(var(--color-green-600), var(--color-green-400))",
          "--normal-border":
            "light-dark(var(--color-green-600), var(--color-green-400))",
        } as React.CSSProperties,
      });
      refetchAll();
      setOpen(false);
    },
    onError: (error: ApiError) => {
      toast.error(
        `Gagal update status pengiriman ke ${nama}. ${error.message}`,
        {
          position: "top-center",
          style: {
            "--normal-bg":
              "color-mix(in oklab, var(--destructive) 10%, var(--background))",
            "--normal-text": "var(--destructive)",
            "--normal-border": "var(--destructive)",
          } as React.CSSProperties,
        },
      );
      setOpen(false);
    },
  });

  const handleAntar = async (id: number) => {
    await mutation.mutateAsync({ id, status: "dibatalkan" });
  };
  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="
            data-[state=open]:animate-in
            data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0
            data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95
            data-[state=open]:zoom-in-95
            duration-300
          "
      >
        <DialogHeader>
          <DialogTitle className="text-lg me-7">
            Pembatalan pengantaran
          </DialogTitle>
          <DialogDescription>Batalkan pengantaran ke {nama}?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Kembali</Button>
          </DialogClose>
          <Button onClick={() => handleAntar(id)} disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Lanjut"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogConfirmBatal;
