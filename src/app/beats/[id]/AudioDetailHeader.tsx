import { formatDate } from "@/app/formatDate";
import { AudioDetails } from "./page";
import { Skeleton } from "@/components/ui/skeleton";
import { LoaderCircle, Pause, Play } from "lucide-react";

export function AudioDetailHeader({
  data,
  isLoading,
  error,
  setIsAudioPlayerShown,
}: {
  data: AudioDetails;
  isLoading: boolean;
  error: unknown;
  setIsAudioPlayerShown: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="mt-5 flex justify-between">
      <div className="flex w-3/4">
        {isLoading || error ? (
          <Skeleton className="w-[25%] h-[276px] rounded-none" />
        ) : (
          <img
            src={data?.img_url || "/images/missing-image.png"}
            alt="album image"
            className="w-[25%] "
          />
        )}

        <div className="flex flex-col justify-center ">
          {isLoading || error ? (
            <Skeleton className="w-[200px] h-9 ml-10 " />
          ) : (
            <h1 className="text-[44px] ml-10  leading-[60px] font-extralight font-satoshi text-zinc-300">
              {data?.name}
            </h1>
          )}
          {isLoading || error ? (
            <Skeleton className="w-[500px] h-6 ml-10 mt-5 " />
          ) : (
            <div className="text-lg flex items-center">
              <p className="ml-10 font-satoshi font-light text-white">
                created by // {data?.producer}
              </p>
              <p className="ml-5 font-satoshi font-light text-white">
                published //{" "}
                {data?.created_at ? formatDate(data.created_at) : ""}
              </p>
              <p className="ml-5 font-satoshi font-light text-white">
                key // {data?.key}
              </p>
              <p className="ml-5 font-satoshi font-light text-white">
                genre // --
              </p>
              <p className="ml-5 font-satoshi font-light text-white">
                bpm // {data?.bpm}
              </p>
             
            </div>
          )}
          
        </div>

        
      </div>
      
      <div className="w-1/4 flex justify-end">
        <p className="text-lg mt-5 font-satoshi"></p>
      </div>
    </div>
  );
}
