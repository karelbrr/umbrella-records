"use client";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { EditTrackSheet } from "./edit-track-sheet";
import { formatDate } from "@/hooks/format-date";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/hooks/create-client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface AudioListItem {
  id: string;
  created_at: string | number | Date;
  name: string | null;
  media_url: string;
  bpm: number | null;
  length: string | null;
  img_url: string | null;
  is_new: boolean | null;
  description: string | null;
  is_desc_ai: boolean | null;
  producer: string | null;
  key: string | null;
  genre: string | null;
  keys?: {
    key?: string | null;
  } | null;
}

export const columns: ColumnDef<AudioListItem>[] = [
  {
    id: "select",
    meta: { className: "table-cell w-[2%]" },
    header: ({ table }) => (
      <div className="">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),

    cell: ({ row }) => (
      <div className="">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "name",
    header: "Title",
    meta: { className: "w-[15%]" },

    cell: ({ row }) => (
      <div className="truncate font-medium">
        <a
          href={`https://umbrellarecords.cz/beats/${row.original.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {row.getValue("name")}
        </a>
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    meta: { className: "hidden sm:table-cell w-[8%]" },
    header: "Created at",
    cell: ({ row }) => <div>{formatDate(row.getValue("created_at"))}</div>,
  },
  {
    accessorKey: "bpm",
    meta: { className: "hidden sm:table-cell w-[5%]" },
    header: "BPM",
    cell: ({ row }) => <div>{row.getValue("bpm")}</div>,
  },
  {
    accessorKey: "key",
    meta: { className: "hidden sm:table-cell w-[6%]" },
    header: "Key",
    cell: ({ row }) => {
      const joinedKeyData = row.original.keys as any;

      return <div>{joinedKeyData?.key ?? row.getValue("key")}</div>;
    },
  },
  {
    accessorKey: "length",
    meta: { className: "hidden sm:table-cell w-[6%]" },
    header: "Length",
    cell: ({ row }) => <div>{row.getValue("length")}</div>,
  },

  {
    accessorKey: "description",
    meta: { className: "hidden md:table-cell w-[48%] overflow-auto" },
    header: "Description",
    cell: ({ row }) => (
      <div className="overflow-auto" title={row.getValue("description")}>
        {row.getValue("description")}
      </div>
    ),
  },
  {
    id: "actions",

    header: () => <div></div>,
    meta: { className: "table-cell w-[5%]" },

    enableHiding: false,

    cell: ({ row }) => (
      <div className="flex justify-end">
        <EditTrackSheet track={row.original} />
      </div>
    ),
  },
];

export function DataTable({ data }: { data: AudioListItem[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { data: rows, error: fetchError } = await supabase
        .from("beats_tracks")
        .select("id, media_url, img_url")
        .in("id", ids);
      if (fetchError) throw new Error(fetchError.message);

      const trackPaths: string[] = [];
      const imagePaths: string[] = [];

      const extractPath = (url?: string | null) => {
        if (!url) return null;
        try {
          const u = new URL(url);
          const p = u.pathname;
          let m = p.match(/\/storage\/v1\/object\/public\/[^\/]+\/(.+)/);
          if (m && m[1]) return decodeURIComponent(m[1]);
          m = p.match(/\/object\/public\/[^\/]+\/(.+)/);
          if (m && m[1]) return decodeURIComponent(m[1]);
          return decodeURIComponent(p.startsWith("/") ? p.slice(1) : p);
        } catch {
          const m = (url || "").match(
            /(?:storage\/v1\/object\/public\/[^\/]+\/)(.+)/,
          );
          return m?.[1] ? decodeURIComponent(m[1]) : null;
        }
      };

      (rows || []).forEach((r: any) => {
        const t = extractPath(r.media_url);
        if (t) trackPaths.push(t);
        const i = extractPath(r.img_url);
        if (i) imagePaths.push(i);
      });

      const unique = (arr: string[]) => Array.from(new Set(arr));
      const trackPathsUnique = unique(trackPaths);
      const imagePathsUnique = unique(imagePaths);

      if (trackPathsUnique.length) {
        const { error: trackErr } = await supabase.storage
          .from("tracks")
          .remove(trackPathsUnique);
        if (trackErr)
          throw new Error(`Failed to remove tracks: ${trackErr.message}`);
      }

      if (imagePathsUnique.length) {
        const { error: imgErr } = await supabase.storage
          .from("images")
          .remove(imagePathsUnique);
        if (imgErr)
          throw new Error(`Failed to remove images: ${imgErr.message}`);
      }

      const { data, error } = await supabase
        .from("beats_tracks")
        .delete()
        .in("id", ids);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (_data, variables) => {
      toast.success(`${variables.length} track(s) deleted`);
      queryClient.invalidateQueries({ queryKey: ["BeatsForAdmin"] });
      setRowSelection({});
      setIsDialogOpen(false);
    },
    onError: (err: any) => {
      toast.error(`Delete failed: ${err?.message ?? err}`);
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between pb-4 gap-4 lg:gap-0">
        <Input
          placeholder="Search Beats"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div>
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="mr-2 !bg-red-800/80"
                disabled={!table.getFilteredSelectedRowModel().rows.length}
                onClick={() => setIsDialogOpen(true)}
              >
                Delete
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete selected tracks?</AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to permanently delete{" "}
                  {table.getFilteredSelectedRowModel().rows.length} track(s).
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    const selectedIds = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original.id);
                    if (!selectedIds.length) return;
                    deleteMutation.mutate(selectedIds);
                  }}
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto hidden lg:inline-flex"
              >
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())

                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id.replace(/_/g, " ")}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        (header.column.columnDef.meta as any)?.className || ""
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="table-fixed w-full">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="relative "
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`${
                        (cell.column.columnDef.meta as any)?.className || ""
                      } relative z-10`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
