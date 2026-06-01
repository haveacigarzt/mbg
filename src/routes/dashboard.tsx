import { createFileRoute, redirect } from "@tanstack/react-router";
import Dashboard from "../components/internal/Dashboard";
import { requireAuth } from "@/api/auth";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { user } = await requireAuth();
    if (user.role_id === 4) {
      throw redirect({ to: "/driver" });
    }
    return {
      user,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useRouteContext();
  return <Dashboard role_id={user.role_id} />;
}
