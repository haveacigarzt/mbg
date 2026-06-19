import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface Props {
  children: React.ReactNode;
  waktu_mulai: string;
  estimasi_waktu_selesai: string;
}

const DialogEditDriver = ({ children, waktu_mulai, estimasi_waktu_selesai }: Props) => {
  const [open, setOpen] = useState(false);
  const initialForm = {
    waktu_mulai: toTimeInput(waktu_mulai),
    estimasi_waktu_selesai: toTimeInput(estimasi_waktu_selesai)
  };
  const [form, setForm] = useState(initialForm);

  function updateField(field: string, value: any) {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log('form', form);
  }
  function toTimeInput(datetime: string): string {
    return datetime.slice(11, 16);
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
            <DialogTitle className="text-lg font-semibold">Atur waktu Produksi Hari Ini</DialogTitle>
            <DialogDescription>Atur waktu Produksi Hari Ini di SPPG anda. Klik simpan saat selesai.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 py-5">
            <div className="flex-1">
              <Label htmlFor="waktu_mulai" className="mb-1">
                Waktu Mulai
              </Label>
              <Input id="waktu_mulai" type="time" value={form.waktu_mulai} onChange={(e) => updateField('waktu_mulai', e.target.value)} required />
            </div>
            <div className="flex-1">
              <Label htmlFor="estimasi_waktu_selesai" className="mb-1">
                Estimasi Waktu Selesai
              </Label>
              <Input id="estimasi_waktu_selesai" type="time" value={form.estimasi_waktu_selesai} onChange={(e) => updateField('estimasi_waktu_selesai', e.target.value)} required />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditDriver;
