"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Loader2, AlertCircle } from "lucide-react";
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
    console.log("Submitting form with data:", data);

    const result = await login(data.email, data.password);

    if (result.error) {
      setSubmitError("Incorrect email or password. ");
      console.log("Login error:", result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden bg-black border-zinc-800">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-white">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to Umbrella Records
                </p>
              </div>

              {/* Zobrazení chyby při přihlášení */}
              {submitError && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                  placeholder="admin@umbrella.com"
                  {...register("email", {
                    required: "Email je povinný",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Neplatný formát emailu",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-xs text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  {/* Odkaz na reset hesla zatím raději schováme nebo zakomentujeme, pokud není funkční */}
                  {/* <a href="#" className="ml-auto text-sm text-white hover:underline">Forgot password?</a> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  className="bg-zinc-900 border-zinc-800 text-white"
                  {...register("password", {
                    required: "Heslo je povinné",
                  })}
                />
                {errors.password && (
                  <span className="text-xs text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>
            </div>
          </form>

          <div className="hidden md:flex justify-center items-center bg-zinc-950 p-8">
            {/* Ujistěte se, že cesta k obrázku existuje */}
            <Image
              src="/images/ur-logo.png"
              alt="Umbrella Records Logo"
              width={310}
              height={200}
              className="object-contain"
              priority
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground">
        <span>
          © {new Date().getFullYear()} Umbrella Records. All rights reserved.
        </span>
      </div>
    </div>
  );
}
