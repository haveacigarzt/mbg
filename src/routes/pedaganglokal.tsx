import PedagangLokal from '@/components/internal/PedagangLokal';
import { requireAuth } from '@/main';
import { WebSocketProvider } from '@/provider/websocket-provider';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/pedaganglokal')({
  beforeLoad: async () => {
    const { user } = await requireAuth();
    if (user.role.role_id === 4) {
      throw redirect({ to: '/driver' });
    }
    if (user.role.role_id !== 3) {
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
  return (
    <WebSocketProvider room_id={'open'}>
      <PedagangLokal role_id={user.role.role_id} />
    </WebSocketProvider>
  );
}
