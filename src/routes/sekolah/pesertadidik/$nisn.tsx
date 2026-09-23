import DetailPesertaDidik from '@/components/internal/SekolahPage/DetailPesertaDidik';
import { errorToast } from '@/lib/constants';
import { requireAuth } from '@/main';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { toast } from 'sonner';

export const Route = createFileRoute('/sekolah/pesertadidik/$nisn')({
  beforeLoad: async () => {
    const { user } = await requireAuth();
    if (user.role.role_id !== 6) {
      toast.error('Access denied', {
        style: errorToast as React.CSSProperties
      });
      throw redirect({ to: '/dashboard' });
    }
    return {
      user
    };
  },
  component: RouteComponent
});

function RouteComponent() {
  const { nisn } = Route.useParams();

  return <DetailPesertaDidik nisn={nisn} />;
}
