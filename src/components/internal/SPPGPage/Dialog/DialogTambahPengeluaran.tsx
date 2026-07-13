import type { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { errorToast, successToast } from '@/lib/constants';
import { formatNumber, formatRupiah } from '@/lib/utils';
import { createPengeluaranMutationOptions } from '@/queryOptions/sppg';
import { pengeluaranSchema } from '@/schema/formValidation';
import type { PedagangLokalType } from '@/types/pedaganglokal';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DialogTambahPengeluaranProps {
  onPengeluaranUpdate: () => void;
  children: React.ReactNode;
  sppg_id: number;
  alokasi_harian_id: number;
  pedagangLokal: PedagangLokalType[] | undefined;
}

const DialogTambahPengeluaran = ({ onPengeluaranUpdate, children, pedagangLokal, sppg_id, alokasi_harian_id }: DialogTambahPengeluaranProps) => {
  const [open, setOpen] = useState(false);
  const initialForm = { produk: '', jumlah: '', satuan: '', harga_satuan: '', pedagang_lokal_id: null, nama_pedagang_non_lokal: '' };
  const [form, setForm] = useState(initialForm);

  function updateField(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  const mutation = useMutation({
    ...createPengeluaranMutationOptions(),
    onSuccess: () => {
      toast.success('Berhasil mengirim pengeluaran harian.', {
        style: successToast as React.CSSProperties
      });
      onPengeluaranUpdate();
      setOpen(false);
    },
    onError: (error: ApiError) => {
      toast.error('Gagal mengirim pengeluaran harian.', {
        style: errorToast as React.CSSProperties
      });
      console.log('ERROR:', error);
    }
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      jumlah: Number(form.jumlah),
      harga_satuan: Number(form.harga_satuan)
    };

    const result = pengeluaranSchema.safeParse(payload);

    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors).flat()[0];

      if (firstError) {
        toast.error(firstError, {
          style: errorToast as React.CSSProperties
        });
      }
      return;
    }
    await mutation.mutateAsync({ sppg_id: sppg_id, input: { ...payload, alokasi_harian_id } });
    console.log({
      // input: result.data as PostDriver
      input: result.data
    });
  }
  const [isPedagangNonLokal, setIsPedagangNonLokal] = useState(false);
  const [pedagangValue, setPedagangValue] = useState<string | null>(null);
  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)} modal={false}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-md
            data-[state=open]:animate-in
            data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0
            data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95
            data-[state=open]:zoom-in-95
            duration-300
          "
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader className="gap-0">
            <DialogTitle className="text-lg font-semibold">Tambah data Pengeluaran</DialogTitle>
            <DialogDescription>Insert data Pengeluaran Hari Ini di SPPG anda. Klik simpan saat selesai.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-5">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Switch
                  id="pedagang-lokal"
                  checked={isPedagangNonLokal}
                  onCheckedChange={(checked) => {
                    setIsPedagangNonLokal(checked);

                    if (checked) {
                      updateField('pedagang_lokal_id', null);
                      setPedagangValue('');
                    } else {
                      updateField('nama_pedagang_non_lokal', '');
                    }
                  }}
                />
                <Label htmlFor="pedagang-lokal">Pedagang Non Lokal</Label>
              </div>
              {isPedagangNonLokal ? (
                <Input
                  placeholder="Nama/identitas pedagang"
                  value={form.nama_pedagang_non_lokal}
                  onChange={(e) => updateField('nama_pedagang_non_lokal', e.target.value)}
                  required={isPedagangNonLokal}
                />
              ) : (
                <Combobox
                  items={pedagangLokal}
                  value={pedagangValue}
                  onValueChange={(value) => {
                    setPedagangValue(value);

                    const selected = pedagangLokal?.find((item) => `${item.nama} - ${item.jenis_produk}` === value);

                    if (selected) {
                      updateField('pedagang_lokal_id', selected.id);
                    }
                  }}
                >
                  <ComboboxInput placeholder="Pilih pedagang" disabled={isPedagangNonLokal} required={!isPedagangNonLokal} />
                  <ComboboxContent>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.id} value={`${item.nama} - ${item.jenis_produk}`}>
                          {item.nama} - {item.jenis_produk}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )}
            </div>
            <div>
              <Label htmlFor="produk" className="mb-1">
                Produk
              </Label>
              <Input id="produk" placeholder="Beras" value={form.produk} onChange={(e) => updateField('produk', e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="satuan" className="mb-1">
                Satuan
              </Label>
              <Input id="satuan" placeholder="kg" value={form.satuan} onChange={(e) => updateField('satuan', e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="jumlah" className="mb-1">
                Jumlah {form.satuan && `(berapa ${form.satuan}?)`}
              </Label>
              <Input
                id="jumlah"
                value={formatNumber(Number(form.jumlah))}
                onChange={(e) => {
                  const angka = Number(e.target.value.replace(/\D/g, ''));
                  updateField('jumlah', angka);
                }}
              />
            </div>
            <div>
              <Label htmlFor="harga_satuan" className="mb-1">
                Harga Satuan {form.satuan && `(harga per ${form.satuan})`}
              </Label>
              <Input
                value={formatRupiah(Number(form.harga_satuan))}
                onChange={(e) => {
                  const angka = Number(e.target.value.replace(/\D/g, ''));
                  updateField('harga_satuan', angka);
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending} className="text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Tambah'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogTambahPengeluaran;
