"use client";

import { useRef } from "react";
import { useFieldArray, Controller, UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Type, List, CheckSquare, Trash2, Plus } from "lucide-react";

export type BlockType = "text" | "bullet" | "checkbox";

interface ProjectNotesEditorProps {
  form: UseFormReturn<any>;
  fieldName?: string;
}

export function ProjectNotesEditor({
  form,
  fieldName = "blocks",
}: ProjectNotesEditorProps) {
  const { control, register, watch, setValue, getValues } = form;

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: fieldName,
  });

  const currentBlocks = watch(fieldName) || [];
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const addBlock = (type: BlockType) => {
    append({ id: crypto.randomUUID(), type, content: "", checked: false });
    setTimeout(() => {
      const lastIndex = getValues(fieldName).length - 1;
      inputRefs.current[lastIndex]?.focus();
    }, 0);
  };

  const handleInputChange = (index: number, value: string) => {
    if (value === "[] " || value === "[ ] ") {
      setValue(`${fieldName}.${index}.type`, "checkbox");
      setValue(`${fieldName}.${index}.content`, "");
      return;
    }
    if (value === "- ") {
      setValue(`${fieldName}.${index}.type`, "bullet");
      setValue(`${fieldName}.${index}.content`, "");
      return;
    }
    setValue(`${fieldName}.${index}.content`, value);
  };

  return (
    <Card className="border-border bg-transparent ">
      <CardHeader className="!pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Project Notes</CardTitle>
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
          {fields.map((field: any, index: number) => {
            const currentBlock = currentBlocks[index];
            const isChecked = currentBlock?.checked;
            const currentType = currentBlock?.type || field.type;

            return (
              <div
                key={field.id}
                className="group flex items-start gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/20"
              >
                <div className="flex h-6 items-center justify-center shrink-0 w-6">
                  {currentType === "checkbox" && (
                    <Controller
                      control={control}
                      name={`${fieldName}.${index}.checked`}
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
                    `${fieldName}.${index}.content`,
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
            className="flex w-full items-center gap-2 rounded-md px-2 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/20 hover:text-foreground border border-dashed border-transparent hover:border-border"
          >
            <Plus className="size-4" />
            Add a new block
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
