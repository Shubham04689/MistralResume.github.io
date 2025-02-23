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
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Trash, Wand2 } from "lucide-react";
import { ResumeUpload } from "@/components/resume-upload";

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
    category: "",
    items: [],
    proficiency: "intermediate",
  }],
  projects: [],
  languages: [],
};

export function ResumeForm() {
  const { toast } = useToast();
  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues,
  });

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
      const res = await apiRequest("POST", "/api/generate-resume", {
        currentData: form.getValues(),
      });
      const data = await res.json();
      form.reset(data);
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

  const addFormSection = (section: keyof ResumeData, template: any) => {
    const currentItems = form.getValues(section) || [];
    form.setValue(section, [...currentItems, template]);
  };

  return (
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ...rest of contact section */}
          </CardContent>
        </Card>
        {/* ...rest of the form sections except Projects */}

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
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {form.watch("projects")?.map((_, index) => (
              <div key={index} className="space-y-4 relative p-4 border rounded-lg">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={() => {
                    const projects = form.getValues("projects") || [];
                    form.setValue(
                      "projects",
                      projects.filter((_, i) => i !== index)
                    );
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
                        <Input {...field} />
                      </FormControl>
                      <AiSuggestions
                        section={`projects.${index}.name`}
                        content={field.value}
                        onUseSuggestion={(suggestion) => field.onChange(suggestion)}
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
                        <Textarea {...field} />
                      </FormControl>
                      <AiSuggestions
                        section={`projects.${index}.description`}
                        content={field.value}
                        onUseSuggestion={(suggestion) => field.onChange(suggestion)}
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
                        <Input {...field} />
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
                        <Input type="date" {...field} />
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
                        <Input type="date" {...field} />
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
                    form.setValue(
                      "languages",
                      languages.filter((_, i) => i !== index)
                    );
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
                        <Input {...field} />
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
                        <Input {...field} />
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
  );
}