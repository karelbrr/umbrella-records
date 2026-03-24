"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Loader2, AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useAuth } from "@/components/context/auth-provider";

type FormValues = {
  email: string;
  password: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setSubmitError(null);

    const result = await login(data.email, data.password);

    if (result.error) {
      setSubmitError("Invalid credentials. Access denied.");
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(" w-full overflow-hidden  bg-black ", className)}
      {...props}
    >
      {/* LEFT SIDE: FORM */}
      <div className="flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto w-full max-w-[450px] space-y-6"
        >
          <FieldGroup>
            <div className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Login to Umbrella Records
              </h1>
            </div>

            {submitError && (
              <div className="flex items-center gap-2 rounded-md bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                <AlertCircle className="h-4 w-4" />
                <span>{submitError}</span>
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="email" className="text-zinc-200">
                Email
              </FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="admin@umbrella.com"
                className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-zinc-700"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email format",
                  },
                })}
              />
              {errors.email && (
                <span className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </span>
              )}
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password" university-="text-zinc-200">
                  Password
                </FieldLabel>
                {/* <a
                  href="#"
                  className="text-xs text-zinc-500 hover:text-white transition-colors underline-offset-4 hover:underline"
                >
                  Forgot password?
                </a> */}
              </div>
              <Input
                id="password"
                type="password"
                className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-zinc-700"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors.password && (
                <span className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </span>
              )}
            </Field>

            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-zinc-200 transition-all font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
