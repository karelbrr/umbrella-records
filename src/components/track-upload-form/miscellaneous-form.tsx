import { Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "../ui/switch";

import { useSongFormOptions } from "@/hooks/use-song-options";

export function MiscellaneousForm({ control }: { control: any }) {
  const { tags: allTags, isLoading: tagsLoading } = useSongFormOptions();

  return (
    <Card className="bg-black">
      <CardHeader>
        <CardTitle>Miscellaneous</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <Label htmlFor="is_new" className="cursor-pointer">
              Mark as New Release
            </Label>
            <p className="text-sm text-muted-foreground">
              Display a "New" badge on this track
            </p>
          </div>
          <Controller
            name="is_new"
            control={control}
            render={({ field }) => (
              <Switch
                id="is_new"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="space-y-3 mt-4 rounded-lg border p-3">
          <div className="space-y-0.5">
            <Label className="cursor-pointer text-base">Tags</Label>
            <p className="text-sm text-muted-foreground">
              Select tags to help categorize your track.
            </p>
          </div>

          <Controller
            name="tags" // jméno pole ve tvém formuláři
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <div className="flex flex-wrap gap-2 pt-2">
                {tagsLoading
                  ? // Skeletony při načítání
                    [1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-16 animate-pulse bg-muted rounded-full"
                      />
                    ))
                  : allTags?.map((tag) => {
                      const isSelected = field.value?.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => {
                            const newValue = isSelected
                              ? field.value.filter(
                                  (id: string) => id !== tag.id,
                                )
                              : [...(field.value || []), tag.id];
                            field.onChange(newValue);
                          }}
                          className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${
                            isSelected
                              ? "bg-accent text-accent-foreground border-accent"
                              : "bg-transparent border-border hover:bg-accent/10"
                          }`}
                        >
                          {tag.tag_title}
                        </button>
                      );
                    })}
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
