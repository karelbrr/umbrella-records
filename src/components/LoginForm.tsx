"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useForm, SubmitHandler } from "react-hook-form";
import { Loader2 } from "lucide-react"; // Volitelné pro loading spinner

// Definice typu pro formulářová data
type FormValues = {
  email: string;
  password: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Poznámka: Ujistěte se, že zde předáváte URL a KEY, pokud to nemáte globálně
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Inicializace React Hook Form
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

  // const onSubmit: SubmitHandler<FormValues> = async (data) => {
  //   setIsLoading(true);

  //   try {
  //     const { error } = await supabase.auth.signInWithPassword({
  //       email: data.email,
  //       password: data.password,
  //     });

  //     if (error) {
  //       alert("Chyba přihlášení: " + error.message);
  //     } else {
  //       router.refresh();
  //       router.push("/admin/dashboard");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden bg-black">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to Umbrella Records
                </p>
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  // Validace přímo zde v register
                  {...register("email", {
                    required: "Email je povinný",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Neplatný formát emailu",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-sm text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Heslo */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  // Validace přímo zde v register
                  {...register("password", {
                    required: "Heslo je povinné",
                  })}
                />
                {errors.password && (
                  <span className="text-sm text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>
            </div>
          </form>
          <div className="hidden md:flex justify-center items-center bg-black">
            <Image
              src="/images/ur-logo.png"
              alt="Image"
              width={310}
              height={200}
              className=""
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-white [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
