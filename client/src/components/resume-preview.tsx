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
          {resume.contact.linkedIn && (
            <p className="text-muted-foreground">LinkedIn: {resume.contact.linkedIn}</p>
          )}
          {resume.contact.website && (
            <p className="text-muted-foreground">Website: {resume.contact.website}</p>
          )}

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
              {exp.achievements?.length > 0 && (
                <ul>
                  {exp.achievements.map((achievement, j) => (
                    <li key={j}>{achievement}</li>
                  ))}
                </ul>
              )}
              {exp.technologies?.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Technologies: {exp.technologies.join(", ")}
                </p>
              )}
            </div>
          ))}

          <h2>Education</h2>
          {resume.education.map((edu, i) => (
            <div key={i} className="mb-4">
              <h3>{edu.degree} in {edu.field}</h3>
              <p className="text-muted-foreground">
                {edu.institution} • {edu.startDate} - {edu.endDate || "Present"}
              </p>
              {edu.gpa && <p>GPA: {edu.gpa}</p>}
              {edu.achievements?.length > 0 && (
                <ul>
                  {edu.achievements.map((achievement, j) => (
                    <li key={j}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <h2>Skills</h2>
          {resume.skills.map((skill, i) => (
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

          {resume.projects?.length > 0 && (
            <>
              <h2>Projects</h2>
              {resume.projects.map((project, i) => (
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

          {resume.languages?.length > 0 && (
            <>
              <h2>Languages</h2>
              <ul>
                {resume.languages.map((lang, i) => (
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