import { createFileRoute } from "@tanstack/react-router";
import SPPG from "../components/internal/SPPGPage/SPPG";

export const Route = createFileRoute("/sppg")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/sppg"!
      <SPPG />
    </div>
  );
}
