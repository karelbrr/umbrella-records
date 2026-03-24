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
import { Plus, Search, Pencil, Tag, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/hooks/create-client";

type TagFormValues = {
  tag_title: string;
};

export function TagsTab({ data }: { data: any[] }) {
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
  } = useForm<TagFormValues>();

  // Sync form with editing state
  useEffect(() => {
    if (editingItem) {
      reset({ tag_title: editingItem.tag_title });
    } else {
      reset({ tag_title: "" });
    }
  }, [editingItem, reset, isFormOpen]);

  const filtered = data.filter((tag) =>
    tag.tag_title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // --- MUTATIONS ---

  // 1. CREATE
  const addMutation = useMutation({
    mutationFn: async (values: TagFormValues) => {
      const { data, error } = await supabase
        .from("tags")
        .insert([{ tag_title: values.tag_title }])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag created successfully");
      setIsFormOpen(false);
    },
    onError: (error: any) => toast.error(error.message),
  });

  // 2. UPDATE
  const updateMutation = useMutation({
    mutationFn: async (values: TagFormValues) => {
      const { data, error } = await supabase
        .from("tags")
        .update({ tag_title: values.tag_title })
        .eq("id", editingItem.id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag updated successfully");
      setIsFormOpen(false);
      setEditingItem(null);
    },
    onError: (error: any) => toast.error(error.message),
  });

  // 3. DELETE
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tags").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag removed successfully");
      setIsDeleteOpen(false);
      setItemToDelete(null);
    },
    onError: (error: any) => toast.error(error.message),
  });

  const onSubmit = (values: TagFormValues) => {
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
              <Tag className="size-5" />
              Tags
            </CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">
              Manage your {data.length} metadata tags for beats
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setEditingItem(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="size-4 mr-2" /> Add Tag
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-transparent border-border"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {filtered.length > 0 ? (
            filtered.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="group flex h-auto items-center gap-2 py-1.5 pl-3 pr-1 text-sm font-medium transition-all hover:bg-muted/30 border-border/50"
              >
                {tag.tag_title}
                <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 ml-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 rounded-full hover:bg-background"
                    onClick={() => {
                      setEditingItem(tag);
                      setIsFormOpen(true);
                    }}
                  >
                    <Pencil className="size-3" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      setItemToDelete(tag);
                      setIsDeleteOpen(true);
                    }}
                  >
                    <X className="size-3" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </Badge>
            ))
          ) : (
            <div className="w-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-lg">
              No tags found.
            </div>
          )}
        </div>
      </CardContent>

      {/* --- ADD/EDIT DIALOG --- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px] bg-black border-border text-white">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Tag" : "Create New Tag"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Enter a title for the beat metadata tag.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-6">
              <div className="grid gap-2">
                <Label
                  htmlFor="tag_title"
                  className={errors.tag_title ? "text-destructive" : ""}
                >
                  Tag Title
                </Label>
                <Input
                  id="tag_title"
                  {...register("tag_title", {
                    required: "Tag title is required",
                  })}
                  placeholder="e.g. Dark, Melodic, Aggressive"
                  className={`bg-transparent border-border ${errors.tag_title ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                {errors.tag_title && (
                  <span className="text-xs text-destructive">
                    {errors.tag_title.message}
                  </span>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={addMutation.isPending || updateMutation.isPending}
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
                {editingItem ? "Save Changes" : "Create Tag"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- DELETE ALERT DIALOG --- */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-black border-border text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently delete the tag
              <span className="text-white font-bold italic">
                {" "}
                "#{itemToDelete?.tag_title}"
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent hover:bg-muted/20">
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
