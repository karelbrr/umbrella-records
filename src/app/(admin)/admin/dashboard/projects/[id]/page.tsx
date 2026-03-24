"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/hooks/create-client";
import { formatDate } from "@/hooks/format-date";
import {
  statusConfig,
  type ProjectStatus,
} from "@/components/projects/mock-projects";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProjectNotesEditor } from "@/components/projects/project-notes-editor";

type BlockType = "text" | "bullet" | "checkbox";

interface FormValues {
  title: string;
  project_status: ProjectStatus;
  blocks: {
    id?: string;
    type: BlockType;
    content: string;
    checked: boolean;
  }[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const queryClient = useQueryClient();

  const { data: projectData, isLoading: projectLoading } = useQuery({
    queryKey: ["singleProject", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();
      if (error) throw new Error(error.message);

      return data;
    },
  });

  const { data: blocksData, isLoading: blocksLoading } = useQuery({
    queryKey: ["blocks", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blocks")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      project_status: "idea",
      blocks: [],
    },
  });
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = form;

  const currentBlocks = watch("blocks") || [];

  useEffect(() => {
    if (projectData && blocksData) {
      reset({
        title: projectData.title || "",
        project_status: (projectData.project_status || "idea") as ProjectStatus,
        blocks: blocksData.map((b: any) => ({
          id: b.id,
          type: b.type,
          content: b.content || "",
          checked: b.checked || false,
        })),
      });
    }
  }, [projectData, blocksData, reset]);

  const saveMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { error: projectError } = await supabase
        .from("projects")
        .update({
          title: values.title,
          project_status: values.project_status,
          last_modified: new Date().toISOString(),
        })
        .eq("id", projectId);

      if (projectError) throw projectError;

      const activeBlockIds = values.blocks
        .map((b) => b.id)
        .filter(Boolean) as string[];

      if (activeBlockIds.length > 0) {
        const { error: deleteError } = await supabase
          .from("blocks")
          .delete()
          .eq("project_id", projectId)
          .not("id", "in", `(${activeBlockIds.join(",")})`);
        if (deleteError) throw deleteError;
      } else {
        const { error: deleteAllError } = await supabase
          .from("blocks")
          .delete()
          .eq("project_id", projectId);
        if (deleteAllError) throw deleteAllError;
      }

      if (values.blocks.length > 0) {
        const blocksToSave = values.blocks.map((block) => ({
          ...(block.id ? { id: block.id } : {}),
          project_id: projectId,
          type: block.type,
          content: block.content,
          checked: block.checked,
        }));

        console.log(blocksToSave);

        const { error: blocksError } = await supabase
          .from("blocks")
          .upsert(blocksToSave);

        if (blocksError) throw blocksError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["singleProject", projectId] });
      queryClient.invalidateQueries({ queryKey: ["blocks", projectId] });
      toast.success("Project saved successfully!");
    },
    onError: (error: any) => toast.error(error.message),
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);

    saveMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-6 lg:p-8">
      {/* --- PROJECT HEADER --- */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Input
              {...register("title", {
                required: "Provide Project name to create a new project",
              })}
              className="h-auto border-none bg-transparent p-0 w-[1000px] !text-3xl font-bold tracking-tight shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
              placeholder="Untitled Project"
            />
            {errors.title && (
              <p className="ml-2 text-sm font-medium text-red-800">
                {errors.title.message as string}
              </p>
            )}
          </div>
          <Controller
            control={control}
            name="project_status"
            render={({ field }) => {
              const safeValue = field.value || "idea";

              return (
                <Select
                  key={safeValue}
                  onValueChange={field.onChange}
                  value={safeValue}
                >
                  <SelectTrigger className="w-40 bg-black border-border text-white">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-border text-white">
                    {Object.entries(statusConfig).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* --- MAIN WORKSPACE --- */}
        <div className="space-y-6 lg:col-span-2">
          <ProjectNotesEditor form={form} />
        </div>

        {/* --- SIDEBAR --- */}
        <div className="space-y-6">
          <Card className="border-border bg-transparent">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium">
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Blocks</span>
                  <span className="font-medium">{currentBlocks.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completed Tasks</span>
                  <span className="font-medium">
                    {
                      currentBlocks.filter(
                        (b) => b.type === "checkbox" && b.checked,
                      ).length
                    }
                    {" / "}
                    {currentBlocks.filter((b) => b.type === "checkbox").length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {projectData?.created_at
                      ? formatDate(projectData.created_at, "with_time")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Modified</span>
                  <span className="font-medium">
                    {projectData?.last_modified
                      ? formatDate(projectData.last_modified, "with_time")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full"
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Save Project Changes
          </Button>
        </div>
      </div>
    </form>
  );
}
