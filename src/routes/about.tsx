import { createFileRoute } from "@tanstack/react-router";
import Navbar from "../components/Navbar";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="p-2">
      Hello from About!
      <Navbar />
    </div>
  );
}
