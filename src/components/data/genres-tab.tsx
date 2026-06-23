"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Layers, Plus, Search, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/hooks/create-client";

type GenreFormValues = {
  name: string;
};

export function GenresTab({ data }: { data: any[] }) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Item States
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GenreFormValues>();

  useEffect(() => {
    if (editingItem) {
      reset({ name: editingItem.name });
    } else {
      reset({ name: "" });
    }
  }, [editingItem, reset, isFormOpen]);

  const filtered = data.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // 1. CREATE
  const addMutation = useMutation({
    mutationFn: async (values: GenreFormValues) => {
      const { data, error } = await supabase
        .from("genres")
        .insert([{ genre: values.name }])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
      toast.success("Genre created successfully");
      setIsFormOpen(false);
    },
    onError: (error: any) => toast.error(error.message),
  });

  // 2. UPDATE
  const updateMutation = useMutation({
    mutationFn: async (values: GenreFormValues) => {
      const { data, error } = await supabase
        .from("genres")
        .update({ genre: values.name })
        .eq("id", editingItem.id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
      toast.success("Genre updated successfully");
      setIsFormOpen(false);
      setEditingItem(null);
    },
    onError: (error: any) => toast.error(error.message),
  });

  // 3. DELETE
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("genres").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["genres"] });
      toast.success("Genre deleted successfully");
      setIsDeleteOpen(false);
      setItemToDelete(null);
    },
    onError: (error: any) => toast.error(error.message),
  });

  const onSubmit = (values: GenreFormValues) => {
    if (editingItem) {
      updateMutation.mutate(values);
    } else {
      addMutation.mutate(values);
    }
  };

  return (
    <Card className="border-border bg-black text-white">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Layers className="size-5" />
              Genres
            </CardTitle>
            <CardDescription className="mt-1">
              Manage your {data.length} genre categories
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setEditingItem(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="size-4 mr-2" /> Add Genre
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative max-w-sm mb-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search genres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-transparent border-border"
          />
        </div>

        <div className="rounded-md border border-border mt-4 overflow-hidden">
          <div className="relative h-[50vh] overflow-y-auto">
            <table className="w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr>
                  <th className="sticky top-0 z-30 bg-black px-4 py-3 text-left font-medium text-muted-foreground border-b border-border shadow-[0_1px_0_0_rgba(255,255,255,0.1)]">
                    Name
                  </th>
                  <th className="sticky top-0 z-30 bg-black px-4 py-3 text-right font-medium text-muted-foreground border-b border-border w-[100px] shadow-[0_1px_0_0_rgba(255,255,255,0.1)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-black">
                {filtered.length > 0 ? (
                  filtered.map((genre) => (
                    <tr
                      key={genre.id}
                      className="hover:bg-muted/50 transition-colors group"
                    >
                      <td className="px-4 py-3 font-medium border-b border-border/50">
                        {genre.name}
                      </td>
                      <td className="px-4 py-3 text-right border-b border-border/50">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => {
                              setEditingItem(genre);
                              setIsFormOpen(true);
                            }}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              setItemToDelete(genre);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={2}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No genres found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>

      {/* --- ADD/EDIT DIALOG --- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px] bg-black border-border">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Genre" : "Add New Genre"}
              </DialogTitle>
              <DialogDescription>
                {editingItem
                  ? "Update the name of this genre."
                  : "Create a new genre category for your beats."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Genre Name</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  placeholder="e.g. Phonk, Lo-fi"
                  className="bg-transparent border-border"
                />
                {errors.name && (
                  <span className="text-xs text-destructive">
                    {errors.name.message}
                  </span>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addMutation.isPending || updateMutation.isPending}
              >
                {(addMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {editingItem ? "Save Changes" : "Create Genre"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- DELETE CONFIRMATION DIALOG --- */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-black border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              <span className="text-white font-bold">
                {" "}
                {itemToDelete?.name}{" "}
              </span>
              genre from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate(itemToDelete?.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
