import type { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { deletePosyanduMutationOptions } from '@/queryOptions/posyandu';
import { Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { errorToast, successToast } from '@/lib/constants';

interface Props {
  children: React.ReactNode;
  onSuccess: () => void;
  id: number;
  nama: string;
}

const DialogHapusPedagang = ({ children, onSuccess, id, nama }: Props) => {
  const [open, setOpen] = useState(false);
  const mutation = useMutation({
    ...deletePosyanduMutationOptions(),
    onSuccess: () => {
      toast.success(`Berhasil menghapus data Pedagang Lokal ${nama}`, {
        style: successToast as React.CSSProperties
      });
      onSuccess();
      setOpen(false);
    },
    onError: (error: ApiError) => {
      toast.error('Terjadi kesalahan server. Harap menunggu beberapa saat', {
        position: 'top-center',
        style: errorToast as React.CSSProperties
      });
      console.log(error);
    }
  });

  const handleDelete = async (id: number) => {
    // await mutation.mutateAsync(id);
    console.log('delete', id);
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
          <DialogTitle className="text-lg me-7">Hapus data ini?</DialogTitle>
          <DialogDescription>
            Tindakan ini akan menghapus data <strong>{nama}</strong> dari server secara permanen.
          </DialogDescription>
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
            {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Hapus'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogHapusPedagang;
