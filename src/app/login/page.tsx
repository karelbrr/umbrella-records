// import Dither from "@/components/Dither";
import { LoginForm } from "@/components/LoginForm";


export const metadata = {
  title: "Login | Umbrella Records",
  description:
    "Login to Umbrella Records to access your account, manage your beats, and explore exclusive content.",
};

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center   relative" style={{ width: "100%", height: "600px" }}>
      <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}>
        {/* <Dither
          waveColor={[0.5, 0.5, 0.5]}
          disableAnimation={false}
          enableMouseInteraction={false}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.03}
        /> */}
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm md:max-w-3xl z-10">
        <LoginForm />
      </div>
    </div>
  );
}
