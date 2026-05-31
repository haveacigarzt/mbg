import DataPage from "@/components/homepage/Data";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/data")({
  component: RouteComponent,
});

function RouteComponent() {
  return <DataPage />;
}
