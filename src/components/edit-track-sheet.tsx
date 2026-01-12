"use client";

import { AudioListItem } from "@/app/admin/dashboard/tracks/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatDate } from "@/hooks/formatDate";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/hooks/createClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

interface EditTrackSheetProps {
  track: AudioListItem;
}

type FormValues = {
  name: string;
  created_at?: string;
  producer: string;
  bpm: number | null;
  key: string;
  genre: string;
  length: string;
  description: string;
  is_desc_ai: boolean;
};

export function EditTrackSheet({ track }: EditTrackSheetProps) {
  const { data: genres, isLoading: genresLoading } = useQuery<string[], Error>({
    queryKey: ["genres"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("genres")
        .select("genre")
        .order("genre", { ascending: true });
      if (error) throw error;
      return (data || []).map((r: any) => r.genre as string);
    },
  });

  const { data: keys, isLoading: keysLoading } = useQuery<string[], Error>({
    queryKey: ["keys"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("keys")
        .select("key")
        .order("key", { ascending: true });
      if (error) throw error;
      return (data || []).map((r: any) => r.key as string);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: track.name ?? "",
      created_at: track.created_at ? formatDate(track.created_at) : undefined,
      producer: track.producer ?? "",
      bpm: track.bpm ?? null,
      key: track.key ?? "",
      genre: track.genre ?? "",
      length: track.length ?? "",
      description: track.description ?? "",
      is_desc_ai: !!track.is_desc_ai,
    },
  });

  const onSubmit = async (values: FormValues) => {
    console.log("submit values", values);
    // TODO: replace with your supabase update logic, e.g.:
    // await supabase.from('beats_tracks').update({ ...values }).eq('id', track.id)
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Track</SheetTitle>
          <SheetDescription>
            Make changes to the track details here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4 px-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" {...register("name")} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="created_at" className="text-right">
                Created At
              </Label>
              <Input
                disabled
                id="created_at"
                {...register("created_at")}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="producer" className="text-right">
                Producer
              </Label>
              <Input
                id="producer"
                {...register("producer")}
                className="col-span-3"
              />
            </div>
            <div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bpm" className="text-right">
                  BPM
                </Label>
                <Input
                  type="number"
                  id="bpm"
                  {...register("bpm", {
                    valueAsNumber: true,
                    min: {
                      value: 20,
                      message: "Minimum value is 20 BPM",
                    },
                    max: {
                      value: 300,
                      message: "Maximum value is 300 BPM",
                    },
                  })}
                  className="col-span-3"
                />{" "}
              </div>
              <p
                className="col-start-2 col-span-3 text-sm text-red-500 mt-3"
                hidden={!errors.bpm}
              >
                {errors.bpm && errors.bpm.message}
              </p>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="key" className="text-right">
                Key
              </Label>
              <Controller
                control={control}
                name="key"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="h-11 space-x-1 bg-none border-border w-full col-span-3">
                      <SelectValue
                        placeholder={keysLoading ? "Loading..." : "Key"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {keys?.map((k: string) => (
                        <SelectItem key={k} value={k}>
                          {k}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="genre" className="text-right">
                Genre
              </Label>
              <Controller
                control={control}
                name="genre"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="h-11 space-x-1 bg-none border-border w-full col-span-3">
                      <SelectValue
                        placeholder={genresLoading ? "Loading..." : "Genre"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {genres?.map((g: string) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="length" className="text-right">
                  Length
                </Label>
                <Input
                  id="length"
                  placeholder="MM:SS"
                  maxLength={5} // Omezí délku na 5 znaků (12:34)
                  {...register("length", {
                    required: "Length is required",

                    pattern: {
                      value: /^[0-9]{1,2}:[0-5][0-9]$/,
                      message: "Length must be in MM:SS format",
                    },
                  })}
                  className="col-span-3"
                />
              </div>
              <p
                className="col-start-2 col-span-3 text-sm text-red-500 mt-3"
                hidden={!errors.length}
              >
                {errors.length && errors.length.message}
              </p>
            </div>

            <div className="flex flex-col  gap-4">
              <Label htmlFor="desc" className="text-right">
                Description
              </Label>
              <Textarea
                id="desc"
                className="!bg-black min-h-[200px]"
                {...register("description")}
              />
            </div>

            <div className="flex items-center gap-4">
              <Label htmlFor="is_desc_ai" className="text-right">
                Is Description Ai
              </Label>
              <Controller
                control={control}
                name="is_desc_ai"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(v: boolean) => field.onChange(!!v)}
                    aria-label="Select is desc ai"
                  />
                )}
              />
            </div>
          </div>
          <div className="flex justify-end p-4 ">
            <Button type="submit" className=" w-full">
              Save changes
            </Button>
          </div>
          {/* <SheetFooter>
            <SheetClose asChild></SheetClose>
          </SheetFooter> */}
        </form>
      </SheetContent>
    </Sheet>
  );
}
