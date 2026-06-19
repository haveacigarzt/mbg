import { createFileRoute, redirect } from '@tanstack/react-router';
import SPPG from '@/components/internal/SPPGPage/SPPG';
import { toast } from 'sonner';
import { requireAuth } from '@/main';
import Produksi from '@/components/internal/SPPGPage/Produksi';

export const Route = createFileRoute('/sppg/produksi')({
  beforeLoad: async () => {
    const { user } = await requireAuth();
    if (user.role.role_id !== 3) {
      toast.error('Access denied', {
        style: {
          '--normal-bg': 'color-mix(in oklab, var(--destructive) 10%, var(--background))',
          '--normal-text': 'var(--destructive)',
          '--normal-border': 'var(--destructive)'
        } as React.CSSProperties
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
  return <Produksi user={{ user }} />;
}
