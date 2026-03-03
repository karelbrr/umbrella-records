import { useQuery } from "@tanstack/react-query";
import { useSortedKeys } from "./useSortedKeys"; // Importujeme tvůj hook
import { supabase } from "./createClient";

export type SelectItem = {
  id: number;
  name: string;
};


export const useSongFormOptions = () => {
  const { data: genresData, isLoading: genresLoading } = useQuery<SelectItem[]>({
    queryKey: ["genres"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("genres")
        .select("id, genre")
        .order("genre", { ascending: true });
      if (error) throw new Error(error.message);
      return data ? data.map((g: any) => ({ id: g.id, name: g.genre })) : [];
    },
    staleTime: Infinity,
  });

  const { data: keysData, isLoading: keysLoading } = useQuery<SelectItem[]>({
    queryKey: ["keys"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("keys")
        .select("id, key");
      if (error) throw new Error(error.message);
      return data ? data.map((k: any) => ({ id: k.id, name: k.key })) : [];
    },
    staleTime: Infinity,
  });


  const genresToUse = genresData && genresData.length > 0 ? genresData : [];
  const keysToUse = keysData && keysData.length > 0 ? keysData : [];


  const sortedKeys = useSortedKeys(keysToUse);

  return {
    genres: genresToUse,   
    keys: sortedKeys,      
    isLoading: genresLoading || keysLoading,
  };
};