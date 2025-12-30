import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
  className?: string;
}

export const ImageUpload = ({ onFileSelect, className }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback((file: File | null) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFileName(file.name);
      onFileSelect(file);
    } else {
      setPreview(null);
      setFileName(null);
      onFileSelect(null);
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFile(file);
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    handleFile(null);
  }, [handleFile]);

  return (
    <div className={className}>
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-border bg-muted">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full aspect-video object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
            <span className="text-white text-sm font-medium truncate max-w-[200px]">
              {fileName}
            </span>
            <Button 
              type="button"
              variant="destructive" 
              size="sm"
              onClick={handleRemove}
            >
              <X className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <label
          className={cn(
            "flex flex-col items-center justify-center w-full aspect-video rounded-lg border-2 border-dashed transition-all cursor-pointer",
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors",
              isDragging ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              {isDragging ? (
                <ImageIcon className="w-6 h-6" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              {isDragging ? "Drop image here" : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG up to 5MB
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleInputChange}
          />
        </label>
      )}
    </div>
  );
};
