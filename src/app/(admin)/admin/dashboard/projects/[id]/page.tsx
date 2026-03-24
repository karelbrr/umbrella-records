"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Type,
  List,
  CheckSquare,
  Captions,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

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

  const { register, control, handleSubmit, reset, watch, setValue, getValues } =
    useForm<FormValues>({
      defaultValues: {
        title: "",
        project_status: "idea",
        blocks: [],
      },
    });

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "blocks",
  });

  const currentBlocks = watch("blocks") || [];

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  // --- 3. SAVE MUTATION ---
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

  const addBlock = (type: BlockType) => {
    append({
      id: crypto.randomUUID(),
      type,
      content: "",
      checked: false,
    });

    setTimeout(() => {
      const lastIndex = getValues("blocks").length - 1;
      inputRefs.current[lastIndex]?.focus();
    }, 0);
  };
  const handleInputChange = (index: number, value: string) => {
    if (value === "[] " || value === "[ ] ") {
      setValue(`blocks.${index}.type`, "checkbox");
      setValue(`blocks.${index}.content`, "");
      return;
    }

    if (value === "- ") {
      setValue(`blocks.${index}.type`, "bullet");
      setValue(`blocks.${index}.content`, "");
      return;
    }
    setValue(`blocks.${index}.content`, value);
  };

  if (projectLoading || blocksLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-6 lg:p-8">
      {/* --- PROJECT HEADER --- */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Input
            {...register("title")}
            className="h-auto border-none bg-transparent p-0 text-3xl font-bold tracking-tight shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
            placeholder="Untitled Project"
          />
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

        <div className="flex items-center gap-2 text-muted-foreground">
          <Captions className="size-4" />
          <span className="text-sm">Name of The Project</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* --- MAIN WORKSPACE --- */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border bg-transparent">
            <CardHeader className="pb-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">
                  Project Notes
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addBlock("text")}
                    className="h-7 gap-1.5 text-xs text-muted-foreground"
                  >
                    <Type className="size-3" /> Text
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addBlock("bullet")}
                    className="h-7 gap-1.5 text-xs text-muted-foreground"
                  >
                    <List className="size-3" /> Bullet
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addBlock("checkbox")}
                    className="h-7 gap-1.5 text-xs text-muted-foreground"
                  >
                    <CheckSquare className="size-3" /> Todo
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {fields.map((field, index) => {
                  const currentBlock = currentBlocks[index];
                  const isChecked = currentBlock?.checked;
                  const currentType = currentBlock?.type || field.type;

                  return (
                    <div
                      key={field.id}
                      className="group flex items-start gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/20"
                    >
                      {/* Vizuální indikátor podle typu */}
                      <div className="flex h-6 items-center justify-center shrink-0 w-6">
                        {currentType === "checkbox" && (
                          <Controller
                            control={control}
                            name={`blocks.${index}.checked`}
                            render={({ field: checkboxField }) => (
                              <Checkbox
                                checked={checkboxField.value}
                                onCheckedChange={checkboxField.onChange}
                                className="border-muted-foreground"
                              />
                            )}
                          />
                        )}
                        {currentType === "bullet" && (
                          <span className="size-1.5 rounded-full bg-muted-foreground" />
                        )}
                        {currentType === "text" && (
                          <Type className="size-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100" />
                        )}
                      </div>

                      {(() => {
                        const { ref: formRef, ...formRest } = register(
                          `blocks.${index}.content`,
                        );

                        return (
                          <Input
                            {...formRest}
                            ref={(el) => {
                              formRef(el);
                              inputRefs.current[index] = el;
                            }}
                            onChange={(e) => {
                              formRest.onChange(e);
                              handleInputChange(index, e.target.value);
                            }}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Backspace" &&
                                e.currentTarget.value === ""
                              ) {
                                e.preventDefault();
                                remove(index);
                                if (index > 0) {
                                  setTimeout(
                                    () => inputRefs.current[index - 1]?.focus(),
                                    0,
                                  );
                                }
                              }
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const newType =
                                  currentType === "checkbox"
                                    ? "checkbox"
                                    : currentType;
                                insert(index + 1, {
                                  id: crypto.randomUUID(),
                                  type: newType,
                                  content: "",
                                  checked: false,
                                });
                                setTimeout(
                                  () => inputRefs.current[index + 1]?.focus(),
                                  0,
                                );
                              }
                            }}
                            className={`h-6 flex-1 border-none bg-transparent p-0 text-sm shadow-none placeholder:text-muted-foreground/50 focus-visible:ring-0 ${
                              currentType === "checkbox" && isChecked
                                ? "text-muted-foreground line-through"
                                : ""
                            }`}
                            placeholder={
                              currentType === "checkbox"
                                ? "To-do item..."
                                : currentType === "bullet"
                                  ? "List item..."
                                  : "Type '[] ' for todo, '- ' for bullet..."
                            }
                            autoFocus={!field.id}
                          />
                        );
                      })()}

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-6 text-muted-foreground opacity-0 hover:text-destructive hover:bg-destructive/10 group-hover:opacity-100"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => addBlock("text")}
                  className=" flex w-full items-center gap-2 rounded-md px-2 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/20 hover:text-foreground border border-dashed border-transparent hover:border-border"
                >
                  <Plus className="size-4" />
                  Add a new block
                </button>
              </div>
            </CardContent>
          </Card>
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
                      ? formatDate(projectData.created_at)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Modified</span>
                  <span className="font-medium">
                    {projectData?.last_modified
                      ? formatDate(projectData.last_modified)
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
