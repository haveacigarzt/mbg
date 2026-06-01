import type { ApiError } from "@/api/client";
import { deleteAuthTokenMutationOptions } from "@/queryOptions/auth";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

interface Props {
  role_id: number;
}

const Navbar = ({ role_id }: Props) => {
  const router = useRouter();
  const mutation = useMutation({
    ...deleteAuthTokenMutationOptions(),
    onSuccess: () => {
      toast.success("Berhasil logout. Sampai jumpa lagi", {
        style: {
          "--normal-bg":
            "color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))",
          "--normal-text":
            "light-dark(var(--color-green-600), var(--color-green-400))",
          "--normal-border":
            "light-dark(var(--color-green-600), var(--color-green-400))",
        } as React.CSSProperties,
      });
      router.navigate({ to: "/login" });
    },
    onError: (error: ApiError) => {
      toast.error("Terjadi kesalahan server. Harap menunggu beberapa saat", {
        position: "top-center",
        style: {
          "--normal-bg":
            "color-mix(in oklab, var(--destructive) 10%, var(--background))",
          "--normal-text": "var(--destructive)",
          "--normal-border": "var(--destructive)",
        } as React.CSSProperties,
      });
      console.log(error);
    },
  });
  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // mencegah href="#"
    e.stopPropagation(); // menghentikan bubbling

    await mutation.mutateAsync();
  };
  return (
    <div className="p-2 flex flex-col gap-4 w-[15%] bg-green-200">
      <b>Navbar</b>
      {role_id !== 4 ? (
        <Link to="/dashboard" className="[&.active]:font-bold">
          Dashboard
        </Link>
      ) : (
        <Link to="/driver" className="[&.active]:font-bold">
          Driver
        </Link>
      )}
      {role_id === 1 && (
        <Link to="/admin" className="[&.active]:font-bold">
          Admin
        </Link>
      )}
      {role_id === 3 && (
        <Link to="/sppg" className="[&.active]:font-bold">
          SPPG
        </Link>
      )}
      <a href="#" onClick={handleLogout} className="[&.active]:font-bold">
        Logout
      </a>
    </div>
  );
};

export default Navbar;
