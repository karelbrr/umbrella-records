"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FiltersBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  genre: string
  onGenreChange: (value: string) => void
  keyFilter: string
  onKeyChange: (value: string) => void
  sortBy: "newest" | "price-low" | "price-high" | "bpm"
  onSortChange: (value: "newest" | "price-low" | "price-high" | "bpm") => void
}

export function FiltersBar({
  searchQuery,
  onSearchChange,
  genre,
  onGenreChange,
  keyFilter,
  onKeyChange,
  sortBy,
  onSortChange,
}: FiltersBarProps) {
  return (
    <div className="space-y-4 mt-2">
      {/* Search */}
      <div className="relative bg-none">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search beats, artists, tags..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 h-12 !bg-none border-border text-base"
        />
      </div>

      {/* Filters Row */}
      <div className="flex  space-x-3">
        <Select value={genre} onValueChange={onGenreChange}>
          <SelectTrigger className="h-11 space-x-1 bg-none border-border">
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            {/* {genres.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))} */}
          </SelectContent>
        </Select>

        <Select value={keyFilter} onValueChange={onKeyChange}>
          <SelectTrigger className="h-11 space-x-1 bg-none border-border">
            <SelectValue placeholder="Key" />
          </SelectTrigger>
          <SelectContent>
            {/* {keys.map((k) => (
              <SelectItem key={k} value={k}>
                {k}
              </SelectItem>
            ))} */}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="h-11 space-x-1 font-satoshi bg-none border-border col-span-2">
            <SelectValue placeholder="Sort by"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="bpm">BPM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
