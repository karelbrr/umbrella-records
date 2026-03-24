"use client";
import { useState } from "react";
import {
  statusConfig,
  type ProjectStatus,
} from "@/components/projects/mock-projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Plus,
  GripVertical,
  Type,
  List,
  CheckSquare,
  Gauge,
  Piano,
} from "lucide-react";

type BlockType = "text" | "bullet" | "checkbox";

interface Block {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean;
}

export default function NewProjectPage() {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("idea");
  const [bpm, setBpm] = useState("120");
  const [key, setKey] = useState("C");
  const [aiPrompt, setAiPrompt] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "1", type: "text", content: "" },
  ]);

  const addBlock = (type: BlockType) => {
    setBlocks([
      ...blocks,
      {
        id: Date.now().toString(),
        type,
        content: "",
        checked: type === "checkbox" ? false : undefined,
      },
    ]);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const toggleCheckbox = (id: string) => {
    setBlocks(
      blocks.map((b) => (b.id === id ? { ...b, checked: !b.checked } : b)),
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Project Header */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-auto border-none bg-transparent p-0 text-2xl font-semibold tracking-tight shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
            placeholder="Untitled Project"
          />
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as ProjectStatus)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusConfig).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Metadata Fields */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Gauge className="size-4 text-muted-foreground" />
            <Input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              className="h-8 w-20"
              placeholder="BPM"
            />
            <span className="text-sm text-muted-foreground">BPM</span>
          </div>
          <div className="flex items-center gap-2">
            <Piano className="size-4 text-muted-foreground" />
            <Select value={key} onValueChange={setKey}>
              <SelectTrigger className="h-8 w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "C",
                  "Cm",
                  "D",
                  "Dm",
                  "E",
                  "Em",
                  "F",
                  "Fm",
                  "G",
                  "Gm",
                  "A",
                  "Am",
                  "B",
                  "Bm",
                  "Bb",
                  "Bbm",
                ].map((k) => (
                  <SelectItem key={k} value={k}>
                    {k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">Key</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Workspace */}
        <div className="space-y-6 lg:col-span-2">
          {/* AI Project Architect */}
          <Card className="border-border bg-transparent">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <Sparkles className="size-4 text-primary" />
                AI Project Architect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe your beat idea... e.g., 'Create a moody trap beat structure with a slow build intro, hard-hitting verse, melodic bridge, and explosive drop for the hook'"
                className="min-h-24 resize-none !bg-transparent"
              />
              <Button className="gap-2">
                <Sparkles className="size-4" />
                Generate Project Structure
              </Button>
            </CardContent>
          </Card>

          {/* Notion-like Editor */}
          <Card className="border-border bg-transparent">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">
                  Project Notes
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addBlock("text")}
                    className="h-7 gap-1.5 text-xs text-muted-foreground"
                  >
                    <Type className="size-3" />
                    Text
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addBlock("bullet")}
                    className="h-7 gap-1.5 text-xs text-muted-foreground"
                  >
                    <List className="size-3" />
                    Bullet
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addBlock("checkbox")}
                    className="h-7 gap-1.5 text-xs text-muted-foreground"
                  >
                    <CheckSquare className="size-3" />
                    Todo
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    className="group flex items-start gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex size-5 items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                      <GripVertical className="size-3.5 text-muted-foreground" />
                    </div>
                    {block.type === "checkbox" && (
                      <Checkbox
                        checked={block.checked}
                        onCheckedChange={() => toggleCheckbox(block.id)}
                        className="mt-0.5"
                      />
                    )}
                    {block.type === "bullet" && (
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
                    )}
                    <Input
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      className={`h-auto flex-1 border-none bg-transparent p-0 text-sm shadow-none placeholder:text-muted-foreground focus-visible:ring-0 ${
                        block.type === "checkbox" && block.checked
                          ? "text-muted-foreground line-through"
                          : ""
                      }`}
                      placeholder={
                        block.type === "checkbox"
                          ? "Todo item..."
                          : block.type === "bullet"
                            ? "List item..."
                            : "Start writing your notes..."
                      }
                    />
                  </div>
                ))}
                <button
                  onClick={() => addBlock("text")}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  <Plus className="size-4" />
                  Add a block
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Technical Details */}
          <Card className="border-border bg-transparent">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium">
                Technical Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Gauge className="size-4" />
                  BPM
                </label>
                <Input
                  type="number"
                  value={bpm}
                  onChange={(e) => setBpm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Piano className="size-4" />
                  Musical Key
                </label>
                <Select value={key} onValueChange={setKey}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "C",
                      "Cm",
                      "D",
                      "Dm",
                      "E",
                      "Em",
                      "F",
                      "Fm",
                      "G",
                      "Gm",
                      "A",
                      "Am",
                      "B",
                      "Bm",
                      "Bb",
                      "Bbm",
                    ].map((k) => (
                      <SelectItem key={k} value={k}>
                        {k}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
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
                  <span className="font-medium">{blocks.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completed Tasks</span>
                  <span className="font-medium">
                    {
                      blocks.filter((b) => b.type === "checkbox" && b.checked)
                        .length
                    }
                    /{blocks.filter((b) => b.type === "checkbox").length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">Draft</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
