import Dither from "@/components/backgrounds/Dither";
import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export const metadata = {
  title: "Login | Umbrella Records Admin",
  description: "Login to umbrella records admin page",
};

export default function Page() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <Image
              src="/images/ur-logo.png"
              alt="Umbrella Records Logo"
              width={60}
              height={60}
              className="object-contain"
              priority
            />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block ">
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          disableAnimation={false}
          mouseRadius={0}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.02}
        />
      </div>
    </div>
  );
}
