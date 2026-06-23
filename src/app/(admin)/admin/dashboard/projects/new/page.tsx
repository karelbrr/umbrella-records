"use client";
import {
  statusConfig,
  type ProjectStatus,
} from "@/components/projects/mock-projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProjectNotesEditor } from "@/components/projects/project-notes-editor";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/hooks/create-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

export default function NewProjectPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      project_status: "idea",
      blocks: [
        { id: crypto.randomUUID(), type: "text", content: "", checked: false },
      ],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = form;
  const currentBlocks = watch("blocks") || [];

  const saveMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const newProjectId = crypto.randomUUID();

      const { error: projectError } = await supabase.from("projects").insert({
        id: newProjectId,
        title: values.title,
        project_status: values.project_status,
        last_modified: new Date().toISOString(),
      });

      if (projectError) throw projectError;

      if (values.blocks.length > 0) {
        const blocksToSave = values.blocks.map((block) => ({
          id: block.id,
          project_id: newProjectId,
          type: block.type,
          content: block.content,
          checked: block.checked,
        }));

        const { error: blocksError } = await supabase
          .from("blocks")
          .insert(blocksToSave);

        if (blocksError) throw blocksError;
      }
      return newProjectId;
    },

    onSuccess: (newProjectId) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully!");

      router.push(`/admin/dashboard/projects/${newProjectId}`);
    },
    onError: (error: any) => {
      toast.error(`Failed to create project: ${error.message}`);
    },
  });

  const onSubmit = (data: FormValues) => {
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
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-40 border-border bg-black text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="border-border bg-black text-white">
                  {Object.entries(statusConfig).map(([key, { label }]) => (
                    <SelectItem key={key} value={key.toLowerCase()}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* --- MAIN WORKSPACE --- */}
          <div className="space-y-6 lg:col-span-2">
            {/* AI Project Architect */}
            <Card className="relative overflow-hidden border-border bg-transparent">
              <Badge className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 px-3 py-1 shadow-lg">
                <Rocket className="size-3.5" />
                Coming Soon
              </Badge>

              <div className="pointer-events-none select-none blur-md opacity-50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base font-medium">
                    <Sparkles className="size-4 text-primary" />
                    AI Project Architect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Describe your beat idea... e.g., 'Create a moody trap beat structure with a slow build intro, hard-hitting verse, melodic bridge, and explosive drop for the hook'"
                    className="min-h-24 resize-none !bg-transparent"
                    disabled
                  />
                  <Button className="gap-2" disabled>
                    <Sparkles className="size-4" />
                    Generate Project Structure
                  </Button>
                </CardContent>
              </div>
            </Card>

            {/* --- EDITOR --- */}
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
                    <span className="text-muted-foreground">
                      Completed Tasks
                    </span>
                    <span className="font-medium">
                      {
                        currentBlocks.filter(
                          (b) => b.type === "checkbox" && b.checked,
                        ).length
                      }
                      {" / "}
                      {
                        currentBlocks.filter((b) => b.type === "checkbox")
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium">
                      {statusConfig[watch("project_status")]?.label || "Draft"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full">
              Save Project
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
