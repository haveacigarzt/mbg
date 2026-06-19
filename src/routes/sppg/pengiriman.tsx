import { createFileRoute, redirect } from '@tanstack/react-router';
import { toast } from 'sonner';
import { requireAuth } from '@/main';
import Pengiriman from '@/components/internal/SPPGPage/Pengiriman';
import { WebSocketProvider } from '@/provider/websocket-provider';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getSPPGByIDQueryOptions } from '@/queryOptions/sppg';

export const Route = createFileRoute('/sppg/pengiriman')({
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
  const { data: sppg, refetch: refetchSPPG } = useSuspenseQuery(getSPPGByIDQueryOptions(user.role.id_in_role));
  return (
    <WebSocketProvider room_id={`sppg/${String(sppg.id)}`}>
      <Pengiriman sppg_id={sppg.id}></Pengiriman>;
    </WebSocketProvider>
  );
}
