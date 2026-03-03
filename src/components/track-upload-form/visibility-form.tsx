import { Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "../ui/switch";
export function VisibilityForm({ control }: { control: any }) {
  return (
    <Card className="bg-black">
      <CardHeader>
        <CardTitle>Visibility</CardTitle>
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
      </CardContent>
    </Card>
  );
}
