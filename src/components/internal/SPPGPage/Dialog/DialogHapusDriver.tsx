import type { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteDriverMutationOptions } from '@/queryOptions/drivers';

interface Props {
  children: React.ReactNode;
  onSuccess: () => void;
  id: number;
  nama: string;
}

const DialogHapusDriver = ({ children, onSuccess, id, nama }: Props) => {
  const [open, setOpen] = useState(false);
  const mutation = useMutation({
    ...deleteDriverMutationOptions(),
    onSuccess: () => {
      toast.success(`Berhasil menghapus driver ${nama}`, {
        style: {
          '--normal-bg': 'color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))',
          '--normal-text': 'light-dark(var(--color-green-600), var(--color-green-400))',
          '--normal-border': 'light-dark(var(--color-green-600), var(--color-green-400))'
        } as React.CSSProperties
      });
      onSuccess();
      setOpen(false);
    },
    onError: (error: ApiError) => {
      toast.error(`Gagal menghapus driver ${nama}. ${error.message}`, {
        position: 'top-center',
        style: {
          '--normal-bg': 'color-mix(in oklab, var(--destructive) 10%, var(--background))',
          '--normal-text': 'var(--destructive)',
          '--normal-border': 'var(--destructive)'
        } as React.CSSProperties
      });
      setOpen(false);
    }
  });

  const handleDelete = async (id: number) => {
    await mutation.mutateAsync(id);
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
          <DialogTitle className="text-lg me-7">Apakah Anda yakin ingin menghapus driver ini?</DialogTitle>
          <DialogDescription>Tindakan ini akan secara permanen menghapus driver {nama} dari server.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              Batal
            </Button>
          </DialogClose>
          <Button
            onClick={() => handleDelete(id)}
            disabled={mutation.isPending}
            className="bg-blue-600 hover:bg-blue-700
                             text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Lanjutkan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogHapusDriver;
