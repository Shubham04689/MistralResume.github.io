import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ResumeData } from "@shared/schema";

interface ResumeUploadProps {
  onUploadComplete: (data: ResumeData) => void;
}

export function ResumeUpload({ onUploadComplete }: ResumeUploadProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiRequest("POST", "/api/resume/upload", formData);
      const data = await res.json();
      onUploadComplete(data);
      toast({
        title: "Success",
        description: "Resume data imported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import resume data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Existing Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="file-upload"
            className="w-full flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
          >
            <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Upload PDF, DOC, or JSON file to auto-fill resume
            </p>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.json"
              onChange={handleFileUpload}
              disabled={loading}
            />
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
