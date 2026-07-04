import type { ApiError } from '@/api/client';
import { deleteAuthTokenMutationOptions } from '@/queryOptions/auth';
import { useMutation } from '@tanstack/react-query';
import { Link, useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { LayoutDashboard, Building2, Truck, LogOut, UserStar } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { errorToast, successToast } from '@/lib/constants';

interface Props {
  role_id: number;
}

const Navbar = ({ role_id }: Props) => {
  const router = useRouter();
  const mutation = useMutation({
    ...deleteAuthTokenMutationOptions(),
    onSuccess: () => {
      toast.success('Berhasil logout. Sampai jumpa lagi', {
        style: successToast as React.CSSProperties
      });
      router.navigate({ to: '/login' });
    },
    onError: (error: ApiError) => {
      toast.error('Terjadi kesalahan server. Harap menunggu beberapa saat', {
        position: 'top-center',
        style: errorToast as React.CSSProperties
      });
      console.log(error);
    }
  });

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    await mutation.mutateAsync();
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-[15%] bg-white border-r border-gray-100 flex flex-col p-4 gap-2 z-40">
      {/* Logo */}
      <div className="px-2 py-4 mb-2 border-b border-gray-100">
        <p className="text-blue-600 font-bold text-base">SIAP-MBG</p>
        <p className="text-gray-400 text-xs tracking-widest">BGN NEW ERIDU</p>
      </div>

      {/* Nav links */}
      <div className="flex flex-col gap-1 flex-1">
        {role_id !== 4 ? (
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500
                       hover:bg-blue-50 hover:text-blue-600 transition-all
                       [&.active]:bg-blue-50 [&.active]:text-blue-600 [&.active]:font-semibold"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        ) : (
          <Link
            to="/driver"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500
                       hover:bg-blue-50 hover:text-blue-600 transition-all
                       [&.active]:bg-blue-50 [&.active]:text-blue-600 [&.active]:font-semibold"
          >
            <Truck className="w-4 h-4" />
            Driver
          </Link>
        )}

        {role_id === 1 && (
          <Link
            to="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500
                       hover:bg-blue-50 hover:text-blue-600 transition-all
                       [&.active]:bg-blue-50 [&.active]:text-blue-600 [&.active]:font-semibold"
          >
            <UserStar className="w-4 h-4" />
            Admin
          </Link>
        )}

        {role_id === 3 && (
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1" className="max-h-125">
              <AccordionTrigger
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500
                       hover:bg-blue-50 hover:text-blue-600 transition-all
                       [&.active]:bg-blue-50 [&.active]:text-blue-600 [&.active]:font-semibold"
              >
                <Building2 className="w-4 h-4" />
                SPPG
              </AccordionTrigger>
              <AccordionContent>
                <Link
                  to="/sppg/profil"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 ms-7
                       hover:bg-blue-50 hover:text-blue-600 transition-all
                       [&.active]:bg-blue-50 [&.active]:text-blue-600 [&.active]:font-semibold"
                >
                  Profil
                </Link>
                <Link
                  to="/sppg/keuangan"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 ms-7
                       hover:bg-blue-50 hover:text-blue-600 transition-all
                       [&.active]:bg-blue-50 [&.active]:text-blue-600 [&.active]:font-semibold"
                >
                  Keuangan
                </Link>
                <Link
                  to="/sppg/pengiriman"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 ms-7
                       hover:bg-blue-50 hover:text-blue-600 transition-all
                       [&.active]:bg-blue-50 [&.active]:text-blue-600 [&.active]:font-semibold"
                >
                  Pengiriman
                </Link>
                <Link
                  to="/sppg/produksi"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 ms-7
                       hover:bg-blue-50 hover:text-blue-600 transition-all
                       [&.active]:bg-blue-50 [&.active]:text-blue-600 [&.active]:font-semibold"
                >
                  Produksi
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>

      {/* Logout — di paling bawah */}
      <div className="border-t border-gray-100 pt-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400
                     hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
