import type { Posyandu } from '@/types/posyandu';
import type { Sekolah } from '@/types/sekolah';
import React from 'react';
import type { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { pengirimanSchema } from '@/schema/formValidation';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { createPengirimanMutationOptions } from '@/queryOptions/pengiriman';
import type { CreatePengirimanInput } from '@/types/pengiriman';

interface Props {
  onPengirimanUpdate: () => void;
  children: React.ReactNode;
  sekolah: Sekolah[];
  posyandu: Posyandu[];
}

const DialogTambahPengiriman = ({ onPengirimanUpdate, children, sekolah, posyandu }: Props) => {
  const [open, setOpen] = useState(false);
  const initialForm = {
    tujuan: [] as {
      tujuan_id: number;
      tujuan_type: 'sekolah' | 'posyandu';
    }[]
  };

  const [form, setForm] = useState(initialForm);

  function handleCheckboxChange(checked: boolean, tujuan_id: number, tujuan_type: 'sekolah' | 'posyandu') {
    setForm((prev) => {
      if (checked) {
        return {
          ...prev,
          tujuan: [...prev.tujuan, { tujuan_id, tujuan_type }]
        };
      }

      return {
        ...prev,
        tujuan: prev.tujuan.filter((item) => !(item.tujuan_id === tujuan_id && item.tujuan_type === tujuan_type))
      };
    });
  }

  const totalItems = sekolah.length + posyandu.length;

  const isAllSelected = form.tujuan.length === totalItems;

  function handleToggleAll() {
    if (isAllSelected) {
      setForm((prev) => ({
        ...prev,
        tujuan: []
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      tujuan: [
        ...sekolah.map((el) => ({
          tujuan_id: el.id,
          tujuan_type: 'sekolah' as const
        })),
        ...posyandu.map((el) => ({
          tujuan_id: el.id,
          tujuan_type: 'posyandu' as const
        }))
      ]
    }));
  }

  const mutation = useMutation({
    ...createPengirimanMutationOptions(),
    onSuccess: () => {
      toast.success('Berhasil menambahkan data Pengiriman.', {
        style: {
          '--normal-bg': 'color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))',
          '--normal-text': 'light-dark(var(--color-green-600), var(--color-green-400))',
          '--normal-border': 'light-dark(var(--color-green-600), var(--color-green-400))'
        } as React.CSSProperties
      });
      onPengirimanUpdate();
      setOpen(false);
    },
    onError: (error: ApiError) => {
      toast.error('Gagal menambahkan data Pengiriman.', {
        style: {
          '--normal-bg': 'color-mix(in oklab, light-dark(var(--color-red-600), var(--color-red-400)) 10%, var(--background))',
          '--normal-text': 'light-dark(var(--color-red-600), var(--color-red-400))',
          '--normal-border': 'light-dark(var(--color-red-400), var(--color-red-400))'
        } as React.CSSProperties
      });
      console.log('ERROR:', error);
    }
  });
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = pengirimanSchema.safeParse(form);

    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors).flat()[0];

      if (firstError) {
        toast.error(firstError, {
          style: {
            '--normal-bg': 'color-mix(in oklab, light-dark(var(--color-red-600), var(--color-red-400)) 10%, var(--background))',
            '--normal-text': 'light-dark(var(--color-red-600), var(--color-red-400))',
            '--normal-border': 'light-dark(var(--color-red-400), var(--color-red-400))'
          } as React.CSSProperties
        });
      }
      return;
    }
    console.log('SUBMITING', form);
    await mutation.mutateAsync({
      input: result.data as CreatePengirimanInput
    });
  }

  const items = [
    ...sekolah.map((el) => ({
      ...el,
      tujuan_type: 'sekolah' as const
    })),
    ...posyandu.map((el) => ({
      ...el,
      tujuan_type: 'posyandu' as const
    }))
  ];

  const middle = Math.ceil(items.length / 2);

  const leftColumn = items.slice(0, middle);
  const rightColumn = items.slice(middle);

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
            <DialogTitle className="text-lg font-semibold">Tambah data Pengiriman</DialogTitle>
            <DialogDescription>Pilih tujuan pengiriman untuk hari ini. Klik simpan saat selesai.</DialogDescription>
          </DialogHeader>
          <Button
            className="bg-blue-600 hover:bg-blue-700
                             text-white text-sm font-semibold my-4 rounded-xl transition-colors"
            type="button"
            onClick={handleToggleAll}
          >
            {isAllSelected ? 'Unselect All' : 'Select All'}
          </Button>
          <div className="grid grid-cols-2 gap-6 pb-5">
            <div className="flex flex-col gap-3">
              {leftColumn.map((el) => (
                <div key={`${el.tujuan_type}-${el.id}`} className="flex gap-2">
                  <Checkbox
                    id={`${el.tujuan_type}-${el.id}`}
                    checked={form.tujuan.some((item) => item.tujuan_id === el.id && item.tujuan_type === el.tujuan_type)}
                    onCheckedChange={(checked) => handleCheckboxChange(checked === true, el.id, el.tujuan_type)}
                  />
                  <Label htmlFor={`${el.tujuan_type}-${el.id}`}>{el.nama}</Label>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {rightColumn.map((el) => (
                <div key={`${el.tujuan_type}-${el.id}`} className="flex gap-2">
                  <Checkbox
                    id={`${el.tujuan_type}-${el.id}`}
                    checked={form.tujuan.some((item) => item.tujuan_id === el.id && item.tujuan_type === el.tujuan_type)}
                    onCheckedChange={(checked) => handleCheckboxChange(checked === true, el.id, el.tujuan_type)}
                  />
                  <Label htmlFor={`${el.tujuan_type}-${el.id}`}>{el.nama}</Label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-blue-600 hover:bg-blue-700
                             text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogTambahPengiriman;
