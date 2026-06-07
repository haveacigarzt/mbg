import React from "react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Mail, KeyRound, EyeOff, Eye, AlertCircleIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { postLoginMutationOptions } from "@/queryOptions/auth";
import { Link, useRouter } from "@tanstack/react-router";
import type { ApiError } from "@/api/client";
import { toast } from "sonner";

const Login = () => {
  const router = useRouter();
  const errorMap: Record<number, string[]> = {
    401: ["Email atau password salah", "Harap periksa dan coba lagi"],
    403: ["Akses ditolak", ""],
    500: ["Terjadi kesalahan server", "Harap menunggu beberapa saat"],
  };
  const mutation = useMutation({
    ...postLoginMutationOptions(),
    onSuccess: () => {
      toast.success("Berhasil login. Selamat datang", {
        style: {
          "--normal-bg":
            "color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))",
          "--normal-text":
            "light-dark(var(--color-green-600), var(--color-green-400))",
          "--normal-border":
            "light-dark(var(--color-green-600), var(--color-green-400))",
        } as React.CSSProperties,
      });
      router.navigate({ to: "/dashboard" });
    },
    onError: (error: ApiError) => {
      setErrorMsg(
        errorMap[error.status][0] ||
          error.message ||
          "Kesalahan yang tidak dikenali",
      );
      setErrorMsgDesc(
        errorMap[error.status][1] ||
          error.message ||
          "Harap menghubungi penyedia layanan",
      );
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });
  const loginCepat = async (email: string, password: string) => {
    form.setFieldValue("email", email);
    form.setFieldValue("password", password);
  };
  const [isShowed, setShowed] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [errorMsgDesc, setErrorMsgDesc] = React.useState("");
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold">SIAP MBG</h1>
        <p className="text-center">BGN SANGGAU</p>
      </div>
      <div>
        <Button
          onClick={() => loginCepat("afriandy193@gmail.com", "pas55word")}
        >
          Admin
        </Button>
        <Button onClick={() => loginCepat("dinassgu@gmail.com", "password")}>
          Stakeholder
        </Button>
        <Button
          onClick={() => loginCepat("admin_pontim@sppg.id", "password123")}
        >
          SPPG A
        </Button>
        <Button onClick={() => loginCepat("admin_ponbar@sppg.id", "password")}>
          SPPG B
        </Button>
        <Button
          onClick={() => loginCepat("driver.sppg.bunut@mbg.id", "rahasia123")}
        >
          Driver A
        </Button>
        <Button
          onClick={() => loginCepat("budi.driver@example.com", "password123")}
        >
          Driver B
        </Button>
      </div>
      <form
        onSubmit={(e) => {
          (e.preventDefault(), e.stopPropagation(), form.handleSubmit());
        }}
        className="w-full max-w-sm p-8 border shadow-md"
      >
        <FieldSet>
          <h2 className="text-xl">Login Operator</h2>
          <FieldGroup>
            <form.Field
              name="email"
              children={(field) => {
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Email Terdaftar
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type="email"
                        placeholder="operator@email.com"
                        className="ms-2"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      <InputGroupAddon>
                        <Mail />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                );
              }}
            />
            <form.Field
              name="password"
              children={(field) => {
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type={isShowed ? "text" : "password"}
                        placeholder="••••••••"
                        className="mx-2"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      <InputGroupAddon>
                        <KeyRound />
                      </InputGroupAddon>
                      <InputGroupAddon
                        align="inline-end"
                        onClick={() => setShowed(!isShowed)}
                        className="cursor-pointer"
                      >
                        {isShowed ? <Eye /> : <EyeOff />}
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </FieldSet>
        {errorMsg && (
          <Alert
            variant="destructive"
            className="max-w-md mt-5 bg-red-100 border-red-300"
          >
            <AlertCircleIcon />
            <AlertTitle>{errorMsg}</AlertTitle>
            <AlertDescription>{errorMsgDesc}</AlertDescription>
          </Alert>
        )}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit}
              className="w-full cursor-pointer shadow-sm mt-5 btn"
            >
              {isSubmitting ? "Loading..." : "Masuk"}
            </Button>
          )}
        />
      </form>
      <Link
        to="/"
        className="mt-4 text-xs text-gray-400 hover:text-blue-500 transition-colors tracking-wide"
      >
        ← Kembali ke Beranda
      </Link>
    </div>
  );
};

export default Login;
