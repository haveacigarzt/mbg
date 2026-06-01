import { getMeOrNull } from "@/api/auth";
import Login from "@/components/homepage/Login";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const me = await getMeOrNull();
    if (me) {
      throw redirect({ to: "/dashboard" });
    }
  },
  validateSearch: z.object({
    reason: z.string().optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  useEffect(() => {
    if (search.reason === "login_required") {
      requestAnimationFrame(() => {
        toast.error("Harap login terlebih dahulu", {
          position: "top-center",
          style: {
            "--normal-bg":
              "color-mix(in oklab, light-dark(var(--color-amber-600), var(--color-amber-400)) 10%, var(--background))",
            "--normal-text":
              "light-dark(var(--color-amber-600), var(--color-amber-400))",
            "--normal-border":
              "light-dark(var(--color-amber-600), var(--color-amber-400))",
          } as React.CSSProperties,
        });
      });
    }
  }, [search.reason]);
  return <Login />;
}
