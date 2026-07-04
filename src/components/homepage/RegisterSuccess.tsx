import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function RegisterSuccess() {
  return (
    <div className="flex items-center justify-center ">
      <Card className="w-full max-w-lg shadow-xl border-0">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Registrasi Berhasil</h1>

          <p className="mt-3 text-slate-600 leading-relaxed">
            Akun <strong>SPPG</strong> Anda berhasil didaftarkan dan saat ini sedang <strong>menunggu konfirmasi admin</strong> untuk pengaktifan.
          </p>
          <p className="mt-3 text-slate-600 leading-relaxed">Setelah akun diaktifkan, Anda dapat login menggunakan email dan password yang telah didaftarkan.</p>

          <div className="mt-5">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              <Link to="/login">
                Ke Halaman Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-slate-500">Jika membutuhkan bantuan, silakan hubungi admin.</p>
        </CardContent>
      </Card>
    </div>
  );
}
