import {
  LoaderCircle,
  Pause,
  SkipBack,
  SkipForward,
  Play,
  ChevronDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import { Button } from "./ui/button";

function AudioPlayer({
  media_url,
  isLoading,
  error,
  name,
  cover,
  producer,
}: {
  media_url: string | undefined;
  isLoading: boolean;
  error: any;
  name: string | null | undefined;
  cover: string | null | undefined;
  producer: string | null | undefined;
}) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [isMobilePlayerOpen, setIsMobilePlayerOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const desktopProgressRef = useRef<HTMLDivElement | null>(null);
  const mobileCollapsedProgressRef = useRef<HTMLDivElement | null>(null);
  const mobileFullscreenProgressRef = useRef<HTMLDivElement | null>(null);

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs) || !isFinite(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${("0" + s).slice(-2)}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = async () => {
      setDuration(audio.duration || 0);
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.log("Autoplay blocked:", err);
      }
    };

    const onTimeUpdate = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
        setProgress(((audio.currentTime || 0) / (audio.duration || 1)) * 100);
      }
    };
    const onEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [media_url, isSeeking]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.error("Audio play failed:", err);
      setIsPlaying(!audio.paused && !audio.ended);
    }
  };

  const seekTo = (clientX: number, bar: HTMLDivElement | null) => {
    const audio = audioRef.current;
    if (!audio || !bar || !duration || isNaN(duration) || duration === Infinity)
      return;

    const rect = bar.getBoundingClientRect();
    if (rect.width === 0) return; // <- ochrana

    const x = Math.min(Math.max(0, clientX - rect.left), rect.width);
    const pct = x / rect.width;
    if (!isFinite(pct)) return; // ochrana

    const newTime = pct * duration;
    if (!isFinite(newTime)) return; // ochrana

    audio.currentTime = newTime;
    setProgress(pct * 100);
    setCurrentTime(newTime);
  };

  const onPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    bar: HTMLDivElement | null
  ) => {
    if (!bar) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    setIsSeeking(true);
    seekTo(e.clientX, bar);

    const onPointerMove = (ev: PointerEvent) => seekTo(ev.clientX, bar);
    const onPointerUp = (ev: PointerEvent) => {
      seekTo(ev.clientX, bar);
      setIsSeeking(false);

      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  return (
    <section className="relative">
      {isMobilePlayerOpen && (
        <div className="fixed flex flex-col top-[10vh] left-0 w-full container px-4 h-full bg-black z-[9999]">
          <div className="flex w-full justify-start">
            <Button
              variant={"ghost"}
              className="!p-0"
              onClick={() => setIsMobilePlayerOpen(false)}
            >
              <ChevronDown className="scale-200" strokeWidth={1} />
            </Button>
          </div>
          <div className="flex flex-col mt-6">
            <Image
              src={cover || "/images/missing-image.png"}
              alt={"Cover Art"}
              width={250}
              height={250}
              className="w-full"
            />
            <div className="space-y-3 mt-4">
              <h1 className="text-4xl md:text-6xl  lg:text-7xl font-satoshi tracking-tighter text-balance leading-none">
                {name}
              </h1>

              <p className="text-2xl text-muted-foreground  font-satoshi font-medium">
                {producer ?? "unknown"}
              </p>
            </div>
            <div className="w-full justify-between flex mt-4">
              <p className=" mt-1.5 flex justify-center  w-[10%] text-muted-foreground">
                {formatTime(currentTime)}
              </p>
              <div
                ref={mobileFullscreenProgressRef}
                className={`bg-zinc-300/20 h-[4px] mt-4 w-[75%] relative cursor-pointer ${
                  (isLoading && "opacity-30 animate-pulse") ||
                  (error && "opacity-30 animate-pulse")
                }`}
                onPointerDown={(e) =>
                  onPointerDown(e, mobileFullscreenProgressRef.current)
                }
                role="slider"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.floor(progress)}
              >
                <div
                  className="h-full absolute top-0 left-0 rounded"
                  style={{
                    width: `${
                      isNaN(progress) ? 0 : Math.max(0, Math.min(100, progress))
                    }%`,
                  }}
                />

                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-[2px] h-5 bg-white"
                  style={{
                    left: `calc(${
                      isNaN(progress) ? 0 : Math.max(0, Math.min(100, progress))
                    }% - 6px)`,
                  }}
                />
              </div>
              <p className="mt-1.5 w-[10%] flex justify-center  text-muted-foreground">
                {formatTime(duration)}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 mt-4  text-white">
              <Button size="icon" variant="ghost" className="h-8 flex w-8">
                <SkipBack className="h-4 scale-150 w-4" strokeWidth={1} />
              </Button>
              {isLoading || error ? (
                <LoaderCircle className="animate-spin opacity-50" />
              ) : (
                <button
                  onClick={togglePlay}
                  className="opacity-80 disabled:opacity-50"
                  aria-label="Play/Pause"
                  disabled={!media_url}
                >
                  {isPlaying ? (
                    <Pause strokeWidth={1} className="scale-125" />
                  ) : (
                    <Play strokeWidth={1} className="scale-125" />
                  )}
                </button>
              )}

              <Button
                size="icon"
                variant="ghost"
                className="h-8 flex w-8 z-[9999]"
              >
                <SkipForward className="h-4 scale-150 w-4" strokeWidth={1} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Player */}
      <section className="fixed bottom-0 left-0 w-full z-1000 hidden h-[100px] bg-black lg:block border-t">
        <div className="container mx-auto px-4 h-full flex items-center justify-center">
          {/* Left: Description / Cover */}
          <div className="flex items-center gap-3 flex-none w-1/2 lg:w-1/4 min-w-[180px]">
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden bg-gray-200 dark:bg-gray-800">
              <Image
                src={cover || "/images/missing-image.png"}
                alt={"Cover Art"}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-sm truncate text-white">
                {name}
              </h4>
              <p className="text-xs text-gray-400 truncate">
                {producer || "2mjz"}
              </p>
            </div>
          </div>

          {/* Center: Player (progress + controls) */}
          <div className="flex flex-col items-end lg:items-center  w-1/2 px-4">
            <div className="flex items-center gap-2  text-white">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 hidden lg:flex w-8"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              {isLoading || error ? (
                <LoaderCircle className="animate-spin opacity-50" />
              ) : (
                <button
                  onClick={togglePlay}
                  className="hover:opacity-80 disabled:opacity-50"
                  aria-label="Play/Pause"
                  disabled={!media_url}
                >
                  {isPlaying ? (
                    <Pause strokeWidth={1} />
                  ) : (
                    <Play strokeWidth={1} />
                  )}
                </button>
              )}

              <Button
                size="icon"
                variant="ghost"
                className="h-8 hidden lg:flex w-8"
              >
                <SkipForward className="h-4  w-4" />
              </Button>
            </div>
            <div className="w-full hidden lg:flex">
              <p className=" mt-2 flex justify-center  w-[10%]  text-sm text-muted-foreground">
                {formatTime(currentTime)}
              </p>
              <div
                ref={desktopProgressRef}
                className={`bg-zinc-300/20 h-[4px] mt-4 w-[80%] relative cursor-pointer ${
                  (isLoading && "opacity-30 animate-pulse") ||
                  (error && "opacity-30 animate-pulse")
                }`}
                onPointerDown={(e) =>
                  onPointerDown(e, desktopProgressRef.current)
                }
                role="slider"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.floor(progress)}
              >
                <div
                  className="h-full absolute top-0 left-0 rounded"
                  style={{
                    width: `${
                      isNaN(progress) ? 0 : Math.max(0, Math.min(100, progress))
                    }%`,
                  }}
                />

                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-[2px] h-5 bg-white"
                  style={{
                    left: `calc(${
                      isNaN(progress) ? 0 : Math.max(0, Math.min(100, progress))
                    }% - 6px)`,
                  }}
                />
              </div>
              <p className="mt-2 w-[10%] flex justify-center text-sm text-muted-foreground">
                {formatTime(duration)}
              </p>
            </div>
          </div>

          {/* Right spacer to keep center alignment */}
          <div className="flex-none hidden lg:flex w-1/4 min-w-[180px]" />
        </div>

        <audio ref={audioRef} src={media_url} preload="metadata" />
      </section>

      {/* Mobile Player */}
      <section
        onClick={() => setIsMobilePlayerOpen(true)}
        className="lg:hidden fixed bottom-0 left-0 w-full z-1000 h-[100px] bg-black border-t"
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-center">
          {/* Left: Description / Cover */}
          <div className="flex items-center gap-3 flex-none w-1/2 lg:w-1/4 min-w-[180px]">
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden bg-gray-200 dark:bg-gray-800">
              <Image
                src={cover || "/images/missing-image.png"}
                alt={"Cover Art"}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-sm truncate text-white">
                {name}
              </h4>
              <p className="text-xs text-gray-400 truncate">
                {producer || "2mjz"}
              </p>
            </div>
          </div>

          {/* Center: Player (progress + controls) */}
          <div className="flex flex-col items-end lg:items-center  w-1/2 px-4">
            <div className="flex items-center gap-2  text-white">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 hidden lg:flex w-8"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              {isLoading || error ? (
                <LoaderCircle className="animate-spin opacity-50" />
              ) : (
                <button
                  onClick={togglePlay}
                  className="hover:opacity-80 disabled:opacity-50"
                  aria-label="Play/Pause"
                  disabled={!media_url}
                >
                  {isPlaying ? (
                    <Pause strokeWidth={1} />
                  ) : (
                    <Play strokeWidth={1} />
                  )}
                </button>
              )}

              <Button
                size="icon"
                variant="ghost"
                className="h-8 hidden lg:flex w-8 z-[9999]"
              >
                <SkipForward className="h-4  w-4" />
              </Button>
            </div>
          </div>

          <div className="w-full hidden lg:flex">
            <p className=" mt-2 flex justify-center  w-[10%]  text-sm text-muted-foreground">
              {formatTime(currentTime)}
            </p>
            <div
              ref={mobileCollapsedProgressRef}
              className={`bg-zinc-300/20 h-[4px] mt-4 w-[80%] relative cursor-pointer ${
                (isLoading && "opacity-30 animate-pulse") ||
                (error && "opacity-30 animate-pulse")
              }`}
              onPointerDown={(e) =>
                onPointerDown(e, mobileCollapsedProgressRef.current)
              }
              role="slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.floor(progress)}
            >
              <div
                className="h-full absolute top-0 left-0 rounded"
                style={{
                  width: `${
                    isNaN(progress) ? 0 : Math.max(0, Math.min(100, progress))
                  }%`,
                }}
              />

              <div
                className="absolute top-1/2 transform -translate-y-1/2 w-[2px] h-5 bg-white"
                style={{
                  left: `calc(${
                    isNaN(progress) ? 0 : Math.max(0, Math.min(100, progress))
                  }% - 6px)`,
                }}
              />
            </div>
            <p className="mt-2 w-[10%] flex justify-center text-sm text-muted-foreground">
              {formatTime(duration)}
            </p>
          </div>

          {/* Right spacer to keep center alignment */}
          <div className="flex-none hidden lg:flex w-1/4 min-w-[180px]" />
        </div>

        <audio ref={audioRef} src={media_url} preload="metadata" />
      </section>
    </section>
  );
}

export default AudioPlayer;
