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

const Login = () => {
  const mutation = useMutation(postLoginMutationOptions());
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      await mutation.mutateAsync(value);
    },
  });
  const [isShowed, setShowed] = React.useState(false);
  const error = false;
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold">SIAP MBG</h1>
        <p className="text-center">BGN SANGGAU</p>
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
        {error && (
          <Alert
            variant="destructive"
            className="max-w-md mt-5 bg-red-100 border-red-300"
          >
            <AlertCircleIcon />
            <AlertTitle>Email atau Password salah</AlertTitle>
            <AlertDescription>Silakan coba lagi. {error}</AlertDescription>
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
    </div>
  );
};

export default Login;
