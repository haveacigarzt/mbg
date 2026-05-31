import Login from "@/components/homepage/Login";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Login />
    </>
  );
}
