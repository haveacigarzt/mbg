import type { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { antarPengirimanMutationOptions, updatePengirimanMutationOptions } from '@/queryOptions/pengiriman';
import { errorToast, successToast } from '@/lib/constants';

interface Props {
  children: React.ReactNode;
  refetchAll: () => void;
  id: number;
  nama: string;
}

const DialogConfirmSampai = ({ children, refetchAll, id, nama }: Props) => {
  const [open, setOpen] = useState(false);
  const mutation = useMutation({
    ...updatePengirimanMutationOptions(),
    onSuccess: () => {
      toast.success(`Berhasil update status pengiriman ke ${nama}`, {
        style: successToast as React.CSSProperties
      });
      refetchAll();
      setOpen(false);
    },
    onError: (error: ApiError) => {
      toast.error(`Gagal update status pengiriman ke ${nama}. ${error.message}`, {
        position: 'top-center',
        style: errorToast as React.CSSProperties
      });
      setOpen(false);
    }
  });

  const handleAntar = async (id: number) => {
    await mutation.mutateAsync({ id, status: 'sampai' });
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
          <DialogTitle className="text-lg me-7">Pengantaran sampai</DialogTitle>
          <DialogDescription>Tandai pengantaran ke {nama} telah sampai?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              Kembali
            </Button>
          </DialogClose>
          <Button
            onClick={() => handleAntar(id)}
            disabled={mutation.isPending}
            className="bg-blue-600 hover:bg-blue-700
                             text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Lanjut'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogConfirmSampai;
