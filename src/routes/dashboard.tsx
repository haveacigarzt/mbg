import { createFileRoute, redirect } from "@tanstack/react-router";
import Dashboard from "../components/internal/Dashboard";
import { requireAuth } from "@/main";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { user } = await requireAuth();
    console.log(user);
    if (user.role.role_id === 4) {
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
  return <Dashboard role_id={user.role.role_id} />;
}
