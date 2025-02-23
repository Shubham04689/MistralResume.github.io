import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema, type ResumeData } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AiSuggestions } from "@/components/ai-suggestions";
import { ResumePreview } from "@/components/resume-preview";
import { ResumeUpload } from "@/components/resume-upload";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Trash, Wand2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const defaultValues: ResumeData = {
  contact: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedIn: "",
    website: "",
  },
  summary: "",
  education: [{
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    gpa: "",
    achievements: [],
  }],
  experience: [{
    company: "",
    position: "",
    startDate: "",
    description: "",
    achievements: [],
    technologies: [],
  }],
  skills: [{
    category: "Technical Skills",
    items: [],
    proficiency: "intermediate",
  }],
  projects: [],
  languages: [],
};

export function ResumeForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ResumeData>(defaultValues);
  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues,
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev };
      const path = field.split(".");
      let current: any = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  async function onSubmit(data: ResumeData) {
    try {
      await apiRequest("POST", "/api/resumes", data);
      toast({
        title: "Success",
        description: "Resume saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save resume",
        variant: "destructive",
      });
    }
  }

  async function generateFullResume() {
    try {
      const res = await apiRequest<Response>("POST", "/api/generate-resume", {
        currentData: form.getValues(),
      });
      const data: ResumeData = await res.json();
      form.reset(data);
      setFormData(data);
      toast({
        title: "Success",
        description: "Resume generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate resume",
        variant: "destructive",
      });
    }
  }

  const addFormSection = <T extends keyof ResumeData>(
    section: T,
    template: NonNullable<ResumeData[T]> extends (infer U)[] ? U : never
  ) => {
    const currentItems = (form.getValues(section) || []) as (typeof template)[];
    const updatedItems = [...currentItems, template];
    form.setValue(section, updatedItems as any);
    updateFormData(section, updatedItems);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-between items-center gap-4">
              <Button
                type="button"
                onClick={generateFullResume}
                className="mb-4"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Full Resume with AI
              </Button>
            </div>

            <ResumeUpload
              onUploadComplete={(data) => {
                form.reset(data);
                setFormData(data);
                toast({
                  title: "Success",
                  description: "Resume data imported successfully",
                });
              }}
            />

            {/* Contact Section */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="contact.fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} onChange={(e) => {
                          field.onChange(e);
                          updateFormData("contact.fullName", e.target.value);
                        }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} onChange={(e) => {
                          field.onChange(e);
                          updateFormData("contact.email", e.target.value);
                        }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} onChange={(e) => {
                          field.onChange(e);
                          updateFormData("contact.phone", e.target.value);
                        }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact.location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} onChange={(e) => {
                          field.onChange(e);
                          updateFormData("contact.location", e.target.value);
                        }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact.linkedIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input {...field} onChange={(e) => {
                          field.onChange(e);
                          updateFormData("contact.linkedIn", e.target.value);
                        }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact.website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input {...field} onChange={(e) => {
                          field.onChange(e);
                          updateFormData("contact.website", e.target.value);
                        }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Summary Section */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea {...field} onChange={(e) => {
                          field.onChange(e);
                          updateFormData("summary", e.target.value);
                        }} />
                      </FormControl>
                      <AiSuggestions
                        section="summary"
                        content={Array.isArray(field.value) ? field.value.join('\n') : field.value ?? ''}
                        onUseSuggestion={(suggestion) => {
                          field.onChange(suggestion);
                          updateFormData("summary", suggestion);
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Experience Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Experience</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addFormSection("experience", {
                    company: "",
                    position: "",
                    startDate: "",
                    description: "",
                    achievements: [],
                    technologies: [],
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {form.watch("experience")?.map((_, index) => (
                  <div key={index} className="space-y-4 relative p-4 border rounded-lg">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => {
                        const experiences = form.getValues("experience");
                        const newExperiences = experiences.filter((_, i) => i !== index);
                        form.setValue("experience", newExperiences);
                        updateFormData("experience", newExperiences);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>

                    <FormField
                      control={form.control}
                      name={`experience.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input {...field} onChange={(e) => {
                              field.onChange(e);
                              const experiences = form.getValues("experience");
                              experiences[index].company = e.target.value;
                              updateFormData("experience", experiences);
                            }} />
                          </FormControl>
                          <AiSuggestions
                            section={`experience.${index}.company`}
                            content={Array.isArray(field.value) ? field.value.join('\n') : field.value ?? ''}
                            onUseSuggestion={(suggestion) => {
                              field.onChange(suggestion);
                              const experiences = form.getValues("experience");
                              experiences[index].company = suggestion;
                              updateFormData("experience", experiences);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Other experience fields */}
                    <FormField
                      control={form.control}
                      name={`experience.${index}.position`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input {...field} onChange={(e) => {
                              field.onChange(e);
                              const experiences = form.getValues("experience");
                              experiences[index].position = e.target.value;
                              updateFormData("experience", experiences);
                            }} />
                          </FormControl>
                          <AiSuggestions
                            section={`experience.${index}.position`}
                            content={Array.isArray(field.value) ? field.value.join('\n') : field.value ?? ''}
                            onUseSuggestion={(suggestion) => {
                              field.onChange(suggestion);
                              const experiences = form.getValues("experience");
                              experiences[index].position = suggestion;
                              updateFormData("experience", experiences);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`experience.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} onChange={(e) => {
                              field.onChange(e);
                              const experiences = form.getValues("experience");
                              experiences[index].startDate = e.target.value;
                              updateFormData("experience", experiences);
                            }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`experience.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} onChange={(e) => {
                              field.onChange(e);
                              const experiences = form.getValues("experience");
                              experiences[index].endDate = e.target.value;
                              updateFormData("experience", experiences);
                            }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`experience.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} onChange={(e) => {
                              field.onChange(e);
                              const experiences = form.getValues("experience");
                              experiences[index].description = e.target.value;
                              updateFormData("experience", experiences);
                            }} />
                          </FormControl>
                          <AiSuggestions
                            section={`experience.${index}.description`}
                            content={Array.isArray(field.value) ? field.value.join('\n') : field.value ?? ''}
                            onUseSuggestion={(suggestion) => {
                              field.onChange(suggestion);
                              const experiences = form.getValues("experience");
                              experiences[index].description = suggestion;
                              updateFormData("experience", experiences);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`experience.${index}.achievements`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Achievements</FormLabel>
                          <FormControl>
                            <Textarea {...field} onChange={(e) => {
                              field.onChange(e);
                              const experiences = form.getValues("experience");
                              experiences[index].achievements = e.target.value.split('\n').filter(line => line.trim());
                              updateFormData("experience", experiences);
                            }} />
                          </FormControl>
                          <AiSuggestions
                            section={`experience.${index}.achievements`}
                            content={Array.isArray(field.value) ? field.value.join('\n') : field.value ?? ''}
                            onUseSuggestion={(suggestion) => {
                              field.onChange([...(field.value || []), suggestion]);
                              const experiences = form.getValues("experience");
                              experiences[index].achievements = [...(experiences[index].achievements || []), suggestion];
                              updateFormData("experience", experiences);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`experience.${index}.technologies`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Technologies</FormLabel>
                          <FormControl>
                            <Textarea {...field} onChange={(e) => {
                              field.onChange(e);
                              const experiences = form.getValues("experience");
                              experiences[index].technologies = e.target.value.split('\n').map(line => line.trim()).filter(line => line);
                              updateFormData("experience", experiences);
                            }} />
                          </FormControl>
                          <AiSuggestions
                            section={`experience.${index}.technologies`}
                            content={Array.isArray(field.value) ? field.value.join('\n') : field.value ?? ''}
                            onUseSuggestion={(suggestion) => {
                              field.onChange(suggestion);
                              const experiences = form.getValues("experience");
                              experiences[index].technologies = suggestion.split('\n').map(line => line.trim()).filter(line => line);
                              updateFormData("experience", experiences);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Projects Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Projects</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addFormSection("projects", {
                    name: "",
                    description: "",
                    technologies: [],
                    link: "",
                    startDate: "",
                    endDate: "",
                  } as ResumeData["projects"][number])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {form.watch("projects")?.map((project, index) => (
                  <div key={index} className="space-y-4 relative p-4 border rounded-lg">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => {
                        const projects = form.getValues("projects") || [];
                        const newProjects = projects.filter((_, i) => i !== index);
                        form.setValue("projects", newProjects);
                        updateFormData("projects", newProjects);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>

                    <FormField
                      control={form.control}
                      name={`projects.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input {...field} onChange={(e) => {
                              field.onChange(e);
                              const projects = form.getValues("projects") || [];
                              projects[index].name = e.target.value;
                              updateFormData("projects", projects);
                            }} />
                          </FormControl>
                          <AiSuggestions
                            section={`projects.${index}.name`}
                            content={Array.isArray(field.value) ? field.value.join('\n') : field.value ?? ''}
                            onUseSuggestion={(suggestion) => {
                              field.onChange(suggestion);
                              const projects = form.getValues("projects") || [];
                              projects[index].name = suggestion;
                              updateFormData("projects", projects);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`projects.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} onChange={(e) => {
                              field.onChange(e);
                              const projects = form.getValues("projects") || [];
                              projects[index].description = e.target.value;
                              updateFormData("projects", projects);
                            }} />
                          </FormControl>
                          <AiSuggestions
                            section={`projects.${index}.description`}
                            content={Array.isArray(field.value) ? field.value.join('\n') : field.value ?? ''}
                            onUseSuggestion={(suggestion) => {
                              field.onChange(suggestion);
                              const projects = form.getValues("projects") || [];
                              projects[index].description = suggestion;
                              updateFormData("projects", projects);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`projects.${index}.link`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link</FormLabel>
                          <FormControl>
                            <Input {...field} onChange={(e) => {
                              field.onChange(e);
                              const projects = form.getValues("projects") || [];
                              projects[index].link = e.target.value;
                              updateFormData("projects", projects);
                            }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`projects.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} onChange={(e) => {
                              field.onChange(e);
                              const projects = form.getValues("projects") || [];
                              projects[index].startDate = e.target.value;
                              updateFormData("projects", projects);
                            }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`projects.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} onChange={(e) => {
                              field.onChange(e);
                              const projects = form.getValues("projects") || [];
                              projects[index].endDate = e.target.value;
                              updateFormData("projects", projects);
                            }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )) ?? []}
              </CardContent>
            </Card>

            {/* Education Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Education</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addFormSection("education", {
                    institution: "",
                    degree: "",
                    field: "",
                    startDate: "",
                    endDate: "",
                    gpa: "",
                    achievements: [],
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {form.watch("education")?.map((_, index) => (
                  <div key={index} className="space-y-4 relative p-4 border rounded-lg">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => {
                        const educations = form.getValues("education");
                        const newEducations = educations.filter((_, i) => i !== index);
                        form.setValue("education", newEducations);
                        updateFormData("education", newEducations);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>

                    <FormField
                      control={form.control}
                      name={`education.${index}.institution`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institution</FormLabel>
                          <FormControl>
                            <Input {...field} onChange={(e) => {
                              field.onChange(e);
                              const educations = form.getValues("education");
                              educations[index].institution = e.target.value;
                              updateFormData("education", educations);
                            }} />
                          </FormControl>
                          <AiSuggestions
                            section={`education.${index}.institution`}
                            content={Array.isArray(field.value) ? field.value.join('\n') : field.value ?? ''}
                            onUseSuggestion={(suggestion) => {
                              field.onChange(suggestion);
                              const educations = form.getValues("education");
                              educations[index].institution = suggestion;
                              updateFormData("education", educations);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.degree`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Degree</FormLabel>
                          <FormControl>
                            <Input {...field} onChange={(e) => {
                              field.onChange(e);
                              const educations = form.getValues("education");
                              educations[index].degree = e.target.value;
                              updateFormData("education", educations);
                            }} />
                          </FormControl>
                          <AiSuggestions
                            section={`education.${index}.degree`}
                            content={Array.isArray(field.value) ? field.value.join('\n') : field.value ?? ''}
                            onUseSuggestion={(suggestion) => {
                              field.onChange(suggestion);
                              const educations = form.getValues("education");
                              educations[index].degree = suggestion;
                              updateFormData("education", educations);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.field`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field of Study</FormLabel>
                          <FormControl>
                            <Input {...field} onChange={(e) => {
                              field.onChange(e);
                              const educations = form.getValues("education");
                              educations[index].field = e.target.value;
                              updateFormData("education", educations);
                            }} />
                          </FormControl>
                          <AiSuggestions
                            section={`education.${index}.field`}
                            content={Array.isArray(field.value) ? field.value.join('\n') : field.value ?? ''}
                            onUseSuggestion={(suggestion) => {
                              field.onChange(suggestion);
                              const educations = form.getValues("education");
                              educations[index].field = suggestion;
                              updateFormData("education", educations);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} onChange={(e) => {
                              field.onChange(e);
                              const educations = form.getValues("education");
                              educations[index].startDate = e.target.value;
                              updateFormData("education", educations);
                            }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} onChange={(e) => {
                              field.onChange(e);
                              const educations = form.getValues("education");
                              educations[index].endDate = e.target.value;
                              updateFormData("education", educations);
                            }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.gpa`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GPA</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => {
                              field.onChange(e);
                              const educations = form.getValues("education");
                              educations[index].gpa = e.target.value;
                              updateFormData("education", educations);
                            }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.achievements`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Achievements</FormLabel>
                          <FormControl>
                            <Textarea {...field} onChange={(e) => {
                              field.onChange(e);
                              const educations = form.getValues("education");
                              educations[index].achievements = e.target.value.split('\n').filter(line => line.trim());
                              updateFormData("education", educations);
                            }} />
                          </FormControl>
                          <AiSuggestions
                            section={`education.${index}.achievements`}
                            content={Array.isArray(field.value) ? field.value.join('\n') : field.value ?? ''}
                            onUseSuggestion={(suggestion) => {
                              field.onChange([...(field.value || []), suggestion]);
                              const educations = form.getValues("education");
                              educations[index].achievements = [...(educations[index].achievements || []), suggestion];
                              updateFormData("education", educations);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Skills</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addFormSection("skills", {
                    category: "",
                    items: [],
                    proficiency: "intermediate",
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skills
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {form.watch("skills")?.map((_, index) => (
                  <div key={index} className="space-y-4 relative p-4 border rounded-lg">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => {
                        const skills = form.getValues("skills");
                        const newSkills = skills.filter((_, i) => i !== index);
                        form.setValue("skills", newSkills);
                        updateFormData("skills", newSkills);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>

                    <FormField
                      control={form.control}
                      name={`skills.${index}.category`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input {...field} onChange={(e) => {
                              field.onChange(e);
                              const skills = form.getValues("skills");
                              skills[index].category = e.target.value;
                              updateFormData("skills", skills);
                            }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`skills.${index}.items`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Items</FormLabel>
                          <FormControl>
                            <Textarea {...field} onChange={(e) => {
                              field.onChange(e);
                              const skills = form.getValues("skills");
                              skills[index].items = e.target.value.split('\n').map(line => line.trim()).filter(line => line);
                              updateFormData("skills", skills);
                            }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`skills.${index}.proficiency`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Proficiency</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                const skills = form.getValues("skills");
                                skills[index].proficiency = value as "beginner" | "intermediate" | "advanced";
                                updateFormData("skills", skills);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select proficiency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Languages Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Languages</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addFormSection("languages", {
                    name: "",
                    proficiency: "",
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Language
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {form.watch("languages")?.map((_, index) => (
                  <div key={index} className="space-y-4 relative p-4 border rounded-lg">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => {
                        const languages = form.getValues("languages") || [];
                        const newLanguages = languages.filter((_, i) => i !== index);
                        form.setValue("languages", newLanguages);
                        updateFormData("languages", newLanguages);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>

                    <FormField
                      control={form.control}
                      name={`languages.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language</FormLabel>
                          <FormControl>
                            <Input {...field} onChange={(e) => {
                              field.onChange(e);
                              const languages = form.getValues("languages") || [];
                              languages[index].name = e.target.value;
                              updateFormData("languages", languages);
                            }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`languages.${index}.proficiency`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Proficiency</FormLabel>
                          <FormControl>
                            <Input {...field} onChange={(e) => {
                              field.onChange(e);
                              const languages = form.getValues("languages") || [];
                              languages[index].proficiency = e.target.value;
                              updateFormData("languages", languages);
                            }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button type="submit" className="w-full">
              Save Resume
            </Button>
          </form>
        </Form>
      </div>
      <div>
        <ResumePreview data={formData} />
      </div>
    </div>
  );
}