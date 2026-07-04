import { ApiError } from '@/api/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { errorToast, successToast } from '@/lib/constants';
import { createUserMutationOptions } from '@/queryOptions/akun';
import { tambahUserSchema } from '@/schema/formValidation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircleIcon } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  children: React.ReactNode;
  role_id: number;
}

const DialogTambahUser = ({ children, role_id }: Props) => {
  const [password, setPassword] = useState('password123');
  const [konfPassword, setKonfPassword] = useState('password123');
  const [name, setName] = useState(role_id == 3 ? 'SPPG Test' : 'Dinas XXX');
  const [email, setEmail] = useState(role_id == 3 ? 'sppg_test@gmail.com' : 'dinasxxx@gmail.com');
  const [isLoading, setIsLoading] = useState(false);
  const [isInput, setIsInput] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    ...createUserMutationOptions(),
    onSuccess: () => {
      toast.success('Berhasil menambahkan user.', {
        style: successToast as React.CSSProperties
      });
      queryClient.invalidateQueries({ queryKey: ['akun'] });
      queryClient.invalidateQueries({ queryKey: ['users-summary'] });
    }
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      role_id: String(role_id),
      name,
      email,
      password,
      konfirmasi_password: konfPassword
    };

    const result = tambahUserSchema.safeParse(payload);

    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors).flat()[0];

      if (firstError) {
        toast.error(firstError, {
          style: errorToast as React.CSSProperties
        });
      }
      setIsLoading(false);
      return;
    }
    try {
      // console.log(payload);
      await mutation.mutateAsync({ input: { role_id: Number(payload.role_id), name: payload.name, email: payload.email, password: payload.password } });
    } catch (err) {
      let message = 'Gagal menambahkan user.';
      if (err instanceof ApiError) {
        const errors = err.data?.error;
        if (errors?.email) {
          message = `Gagal: ${errors.email}`;
        }
        if (errors?.password) {
          message = `Gagal: ${errors.password}`;
        }
      }
      toast.error(message, {
        style: errorToast as React.CSSProperties
      });
    } finally {
      setIsLoading(false);
      setIsInput(false);
    }
  };
  function validatePassword(password: string) {
    if (password.length < 8) {
      return 'Password minimal 8 karakter';
    }

    if (password.length > 15) {
      return 'Password maksimal 15 karakter';
    }

    if (!/[A-Za-z]/.test(password)) {
      return 'Password harus mengandung huruf';
    }

    if (!/\d/.test(password)) {
      return 'Password harus mengandung angka';
    }

    return '';
  }
  const invalidPass = password && validatePassword(password);
  const unMatchedPass = Boolean(konfPassword) && password != konfPassword;
  return (
    <Dialog open={isInput} onOpenChange={setIsInput}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base">Buat akun {role_id === 2 ? 'stakeholder' : 'SPPG'} baru</DialogTitle>
            <DialogDescription>Lengkapi data akun, pilih Simpan untuk mendaftarkan.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="gap-5 mt-4 mb-5">
            <Field className="gap-2">
              <Label htmlFor="nama_instansi">Nama {role_id === 2 ? 'instansi' : 'SPPG'}</Label>
              <Input id="nama_instansi" name="nama" required value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field className="gap-2">
              <Label htmlFor="email">Email akun</Label>
              <Input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field className="gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            <Field className="gap-2">
              <Label htmlFor="konfirmasi_password">Konfirmasi Password</Label>
              <Input id="konfirmasi_password" name="konfirmasi_password" required value={konfPassword} onChange={(e) => setKonfPassword(e.target.value)} />
            </Field>
            {invalidPass ? (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertCircleIcon className="w-4 h-4" />
                <AlertDescription>{invalidPass}</AlertDescription>
              </Alert>
            ) : (
              unMatchedPass && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertCircleIcon className="w-4 h-4" />
                  <AlertDescription>Password dan Konfirmasi Password tidak sesuai</AlertDescription>
                </Alert>
              )
            )}
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="rounded-xl">
                Batal
              </Button>
            </DialogClose>
            <Button
              disabled={Boolean(invalidPass) || unMatchedPass}
              type="submit"
              className=" bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {isLoading ? <Spinner /> : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogTambahUser;
