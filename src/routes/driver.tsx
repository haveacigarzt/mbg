import { requireAuth } from "@/api/auth";
import Driver from "@/components/internal/DriverPage/Driver";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/driver")({
  beforeLoad: async () => {
    const { user } = await requireAuth();
    if (user.role_id !== 4) {
      toast.error("Access denied", {
        style: {
          "--normal-bg":
            "color-mix(in oklab, var(--destructive) 10%, var(--background))",
          "--normal-text": "var(--destructive)",
          "--normal-border": "var(--destructive)",
        } as React.CSSProperties,
      });
      throw redirect({ to: "/dashboard" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Driver />;
}
