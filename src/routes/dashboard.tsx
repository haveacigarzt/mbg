import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "../components/internal/Dashboard";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/dashboard"!
      <Dashboard />
    </div>
  );
}
