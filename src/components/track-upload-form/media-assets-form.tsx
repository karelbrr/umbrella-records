import { Label } from "@/components/ui/label";
import { Upload, ImageIcon, Music, FileAudio, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MediaAssetsFormProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isUrlEntered: boolean;
  handleAudioChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileName: string | null;
  handleRemoveFile: (e: React.MouseEvent) => void;
  uploadError: string | null;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
  isImgUrlEntered: boolean;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imageFileName: string | null;
  handleRemoveImage: (e: React.MouseEvent) => void;
}

export function MediaAssetsForm({
  fileInputRef,
  isUrlEntered,
  handleAudioChange,
  fileName,
  handleRemoveFile,
  uploadError,
  imageInputRef,
  isImgUrlEntered,
  handleImageChange,
  imageFileName,
  handleRemoveImage,
}: MediaAssetsFormProps) {
  return (
    <Card className="bg-black">
      <CardHeader>
        <CardTitle>Media Assets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Audio Upload URL */}
        <div className="space-y-2 ">
          <Label>Audio File</Label>

          <input
            type="file"
            accept=".mp3,audio/mpeg,.wav,audio/wav,.flac,audio/flac"
            className="hidden"
            ref={fileInputRef}
            disabled={isUrlEntered}
            onChange={handleAudioChange}
          />

          <div
            onClick={() => !fileName && fileInputRef.current?.click()}
            className={`flex flex-col  items-center justify-center rounded-lg border-2 border-dashed py-6 px-4 transition-colors 
              ${fileName ? "border-primary/25 mt-5  bg-primary/5 cursor-default" : isUrlEntered ? "border-muted-foreground/10 bg-muted/5 opacity-50 cursor-not-allowed" : "border-muted-foreground/25 bg-black hover:border-muted-foreground/50 cursor-pointer hover:bg-muted/10"}`}
          >
            {fileName ? (
              <div className="flex w-full items-center justify-between ">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <FileAudio className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                      {fileName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ready to upload
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={handleRemoveFile}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <>
                <Music className="mb-2 h-10 w-10 text-muted-foreground" />
                <p className="mb-1 text-sm font-medium text-foreground">
                  {isUrlEntered
                    ? "Audio URL entered below"
                    : "Drag and drop your audio file"}
                </p>
                <p className="mb-3 text-xs text-muted-foreground">
                  MP3, WAV, or FLAC (max 50MB)
                </p>
                {uploadError && (
                  <p className="mb-3 text-xs text-red-500">{uploadError}</p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUrlEntered}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Browse Files
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Cover Art URL */}
        <div className="space-y-2">
          <Label>Cover Art</Label>

          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            ref={imageInputRef}
            disabled={isImgUrlEntered}
            onChange={handleImageChange}
          />

          <div
            onClick={() =>
              !imageFileName &&
              !isImgUrlEntered &&
              imageInputRef.current?.click()
            }
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-6 lg:px-4 transition-colors 
      ${imageFileName ? "border-primary/25 mt-5 bg-primary/5 cursor-default" : isImgUrlEntered ? "border-muted-foreground/10 bg-muted/5 opacity-50 cursor-not-allowed" : "border-muted-foreground/25 bg-black hover:border-muted-foreground/50 cursor-pointer hover:bg-muted/10"}`}
          >
            {imageFileName ? (
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <ImageIcon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                      {imageFileName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ready to upload
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={handleRemoveImage}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <>
                <ImageIcon className="mb-2 h-10 w-10 text-muted-foreground" />
                <p className="mb-1 text-sm font-medium text-foreground">
                  {isImgUrlEntered
                    ? "Image URL entered below"
                    : "Upload cover art"}
                </p>
                <p className="mb-3 text-xs text-muted-foreground">
                  PNG, JPG, or WebP (1:1 ratio recommended)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isImgUrlEntered}
                  onClick={(e) => {
                    e.stopPropagation();
                    imageInputRef.current?.click();
                  }}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Image
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
