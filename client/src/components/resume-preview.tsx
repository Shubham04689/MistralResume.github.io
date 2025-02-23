import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { ResumeData } from "@shared/schema";

interface ResumePreviewProps {
  data?: ResumeData;
}

export function ResumePreview({ data }: ResumePreviewProps) {
  if (!data) {
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
          <h1>{data.contact.fullName}</h1>
          <p className="text-muted-foreground">
            {data.contact.email} • {data.contact.phone} • {data.contact.location}
          </p>
          {data.contact.linkedIn && (
            <p className="text-muted-foreground">LinkedIn: {data.contact.linkedIn}</p>
          )}
          {data.contact.website && (
            <p className="text-muted-foreground">Website: {data.contact.website}</p>
          )}

          <h2>Professional Summary</h2>
          <p>{data.summary}</p>

          <h2>Experience</h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <h3>{exp.position}</h3>
              <p className="text-muted-foreground">
                {exp.company} • {exp.startDate} - {exp.endDate || "Present"}
              </p>
              <p>{exp.description}</p>
              {exp.achievements?.length > 0 && (
                <ul>
                  {exp.achievements.map((achievement, j) => (
                    <li key={j}>{achievement}</li>
                  ))}
                </ul>
              )}
              {exp.technologies && exp.technologies.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Technologies: {exp.technologies.join(", ")}
                </p>
              )}
            </div>
          ))}

          <h2>Education</h2>
          {data.education.map((edu, i) => (
            <div key={i} className="mb-4">
              <h3>{edu.degree} in {edu.field}</h3>
              <p className="text-muted-foreground">
                {edu.institution} • {edu.startDate} - {edu.endDate || "Present"}
              </p>
              {edu.gpa && <p>GPA: {edu.gpa}</p>}
              {edu.achievements && edu.achievements.length > 0 && (
                <ul>
                  {edu.achievements.map((achievement, j) => (
                    <li key={j}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <h2>Skills</h2>
          {data.skills.map((skill, i) => (
            <div key={i} className="mb-4">
              <h3>{skill.category}</h3>
              <p>{skill.items.join(", ")}</p>
              {skill.proficiency && (
                <p className="text-sm text-muted-foreground">
                  Proficiency: {skill.proficiency}
                </p>
              )}
            </div>
          ))}

          {data.projects && data.projects.length > 0 && (
            <>
              <h2>Projects</h2>
              {data.projects.map((project, i) => (
                <div key={i} className="mb-4">
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Technologies: {project.technologies.join(", ")}
                  </p>
                  {project.link && (
                    <p className="text-sm">
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        Project Link
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </>
          )}

          {data.languages && data.languages.length > 0 && (
            <>
              <h2>Languages</h2>
              <ul>
                {data.languages.map((lang, i) => (
                  <li key={i}>
                    {lang.name} - {lang.proficiency}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}