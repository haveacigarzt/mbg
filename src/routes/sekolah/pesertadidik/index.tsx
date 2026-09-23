import { errorToast } from '@/lib/constants';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { requireAuth } from '@/main';
import { toast } from 'sonner';
import PesertaDidik from '@/components/internal/SekolahPage/PesertaDidik';

export const Route = createFileRoute('/sekolah/pesertadidik/')({
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
  const { user } = Route.useRouteContext();
  return <PesertaDidik user={{ user }} />;
}
