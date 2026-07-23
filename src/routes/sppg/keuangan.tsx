import { createFileRoute, redirect } from '@tanstack/react-router';
import { toast } from 'sonner';
import { requireAuth } from '@/main';
import Keuangan from '@/components/internal/SPPGPage/Keuangan';
import { errorToast } from '@/lib/constants';

export const Route = createFileRoute('/sppg/keuangan')({
  beforeLoad: async () => {
    const { user } = await requireAuth();
    if (user.role.role_id !== 3) {
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
  // return <p>Hello</p>;
  return <Keuangan user={{ user }}></Keuangan>;
}
