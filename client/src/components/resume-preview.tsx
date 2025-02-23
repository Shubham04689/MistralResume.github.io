import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { ResumeData } from "@shared/schema";

export function ResumePreview() {
  const { data: resume } = useQuery<ResumeData>({
    queryKey: ["/api/resumes/current"],
  });

  if (!resume) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      </Card>
    );
  }

  return (
    <div className="sticky top-4">
      <Card className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Preview</h2>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>

        <div className="prose max-w-none">
          <h1>{resume.contact.fullName}</h1>
          <p className="text-muted-foreground">
            {resume.contact.email} • {resume.contact.phone} • {resume.contact.location}
          </p>

          <h2>Professional Summary</h2>
          <p>{resume.summary}</p>

          <h2>Experience</h2>
          {resume.experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <h3>{exp.position}</h3>
              <p className="text-muted-foreground">
                {exp.company} • {exp.startDate} - {exp.endDate || "Present"}
              </p>
              <p>{exp.description}</p>
            </div>
          ))}

          {/* Add Education and Skills sections */}
        </div>
      </Card>
    </div>
  );
}
