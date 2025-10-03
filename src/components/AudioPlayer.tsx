import { LoaderCircle, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "./ui/skeleton";

function AudioPlayer({
  media_url,
  isLoading,
}: {
  media_url: string | undefined;
  isLoading: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs) || !isFinite(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${("0" + s).slice(-2)}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      setDuration(audio.duration || 0);
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

  const seekTo = (clientX: number) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || !duration) return;

    const rect = bar.getBoundingClientRect();
    const x = Math.min(Math.max(0, clientX - rect.left), rect.width);
    const pct = x / rect.width;
    const newTime = pct * duration;
    audio.currentTime = newTime;
    setProgress(pct * 100);
    setCurrentTime(newTime);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsSeeking(true);
    seekTo(e.clientX);

    const onPointerMove = (ev: PointerEvent) => {
      seekTo(ev.clientX);
    };

    const onPointerUp = (ev: PointerEvent) => {
      seekTo(ev.clientX);
      setIsSeeking(false);
      if (progressRef.current) {
        progressRef.current.releasePointerCapture(e.pointerId);
      }
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  return (
    <section className="fixed bottom-0 px-32 left-0 w-full h-[200px] flex flex-col justify-center bg-black">
      <div
        ref={progressRef}
        className="bg-zinc-300/50 h-[1px] py-0.5 w-full relative cursor-pointer "
        onPointerDown={onPointerDown}
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
          className="absolute top-1/2 transform -translate-y-1/2 w-[1px] h-5 bg-white"
          style={{
            left: `calc(${
              isNaN(progress) ? 0 : Math.max(0, Math.min(100, progress))
            }% - 6px)`,
          }}
        />
      </div>

      <div className="flex justify-center items-center mt-5 gap-5 text-white">
        {isLoading ? (
          <LoaderCircle className="animate-spin opacity-50"/>
        ) : (
          <button
            onClick={togglePlay}
            className="hover:opacity-80 disabled:opacity-50"
            aria-label="Play/Pause"
            disabled={!media_url}
          >
            {isPlaying ? <Pause strokeWidth={1} /> : <Play strokeWidth={1} />}
          </button>
        )}

        {isLoading ? (
          <Skeleton className="w-20 h-5" />
        ) : (
          <p className="text-sm font-satoshi">
            {formatTime(currentTime)} // {formatTime(duration)}
          </p>
        )}
      </div>

      <audio ref={audioRef} src={media_url} preload="metadata" />
    </section>
  );
}

export default AudioPlayer;
