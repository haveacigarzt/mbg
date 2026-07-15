import React from 'react';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Mail, KeyRound, EyeOff, Eye, AlertCircleIcon } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { postLoginMutationOptions } from '@/queryOptions/auth';
import { Link, useRouter } from '@tanstack/react-router';
import type { ApiError } from '@/api/client';
import { toast } from 'sonner';
import { successToast } from '@/lib/constants';

const quickLogins = [
  {
    label: 'Admin',
    email: 'afriandy193@gmail.com',
    password: 'pas55word',
    color: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
  },
  {
    label: 'Stakeholder',
    email: 'dinassgu@gmail.com',
    password: 'password',
    color: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100'
  },
  {
    label: 'SPPG A',
    email: 'admin_pontim@sppg.id',
    password: 'password123',
    color: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
  },
  {
    label: 'SPPG B',
    email: 'admin_ponbar@sppg.id',
    password: 'password',
    color: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
  },
  {
    label: 'Driver A',
    email: 'driver.ilirkota@gmail.com',
    password: 'rahasia123',
    color: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100'
  },
  {
    label: 'Driver B',
    email: 'driver.bunut2@gmail.com',
    password: 'password123',
    color: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100'
  }
];

const Login = () => {
  const router = useRouter();
  const errorMap: Record<number, string[]> = {
    401: ['Email atau password salah', 'Harap periksa dan coba lagi'],
    403: ['Akses ditolak', ''],
    500: ['Terjadi kesalahan server', 'Harap menunggu beberapa saat']
  };

  const mutation = useMutation({
    ...postLoginMutationOptions(),
    onSuccess: () => {
      toast.success('Berhasil login. Selamat datang', {
        style: successToast as React.CSSProperties
      });
      router.navigate({ to: '/dashboard' });
    },
    onError: (error: ApiError) => {
      setErrorMsg(errorMap[error.status]?.[0] || error.message || 'Kesalahan yang tidak dikenali');
      setErrorMsgDesc(errorMap[error.status]?.[1] || error.message || 'Harap menghubungi penyedia layanan');
    }
  });

  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    }
  });

  const loginCepat = (email: string, password: string) => {
    form.setFieldValue('email', email);
    form.setFieldValue('password', password);
  };

  const [isShowed, setShowed] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [errorMsgDesc, setErrorMsgDesc] = React.useState('');

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="text-center mb-8">
        <p className="text-blue-600 font-black text-3xl tracking-tight">SIAP-MBG</p>
        <p className="text-gray-400 text-xs tracking-widest mt-1">BGN SANGGAU</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Quick login badges — dev helper */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100">
          <p className="text-xs text-gray-400 tracking-widest mb-3">QUICK LOGIN</p>
          <div className="flex flex-wrap gap-2">
            {quickLogins.map((ql) => (
              <button key={ql.label} type="button" onClick={() => loginCepat(ql.email, ql.password)} className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${ql.color}`}>
                {ql.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="px-6 py-6 flex flex-col gap-4"
        >
          <div>
            <h2 className="text-lg font-black text-gray-800">Login Operator</h2>
            <p className="text-xs text-gray-400 tracking-widest mt-0.5">MASUKKAN KREDENSIAL ANDA</p>
          </div>

          <FieldSet>
            <FieldGroup>
              <form.Field
                name="email"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email Terdaftar</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type="email"
                        placeholder="operator@email.com"
                        className="ms-2"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      <InputGroupAddon>
                        <Mail />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                )}
              />
              <form.Field
                name="password"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type={isShowed ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="mx-2"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      <InputGroupAddon>
                        <KeyRound />
                      </InputGroupAddon>
                      <InputGroupAddon align="inline-end" onClick={() => setShowed(!isShowed)} className="cursor-pointer">
                        {isShowed ? <Eye /> : <EyeOff />}
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>

          {errorMsg && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertCircleIcon className="w-4 h-4" />
              <AlertTitle>{errorMsg}</AlertTitle>
              <AlertDescription>{errorMsgDesc}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit} className="w-full cursor-pointer mt-2">
                {isSubmitting ? 'Loading...' : 'Masuk'}
              </Button>
            )}
          />
        </form>
      </div>

      {/* Back to home */}
      <Link to="/" className="mt-6 text-xs text-gray-400 hover:text-blue-500 transition-colors tracking-wide">
        ← Kembali ke Beranda
      </Link>
    </main>
  );
};

export default Login;
