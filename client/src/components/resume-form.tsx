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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={generateFullResume}
            className="mb-4"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Generate Full Resume with AI
          </Button>
        </div>

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
                  <AiSuggestions
                    section="contact.fullName"
                    content={field.value}
                    onUseSuggestion={(suggestion) => field.onChange(suggestion)}
                  />
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
                    <Input type="email" {...field} />
                  </FormControl>
                  <AiSuggestions
                    section="contact.email"
                    content={field.value}
                    onUseSuggestion={(suggestion) => field.onChange(suggestion)}
                  />
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
                    <Input type="tel" {...field} />
                  </FormControl>
                  <AiSuggestions
                    section="contact.phone"
                    content={field.value}
                    onUseSuggestion={(suggestion) => field.onChange(suggestion)}
                  />
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
                    <Input {...field} />
                  </FormControl>
                  <AiSuggestions
                    section="contact.location"
                    content={field.value}
                    onUseSuggestion={(suggestion) => field.onChange(suggestion)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

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
                    <Textarea {...field} />
                  </FormControl>
                  <AiSuggestions
                    section="summary"
                    content={field.value}
                    onUseSuggestion={(suggestion) => field.onChange(suggestion)}
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
              onClick={() => {
                const experiences = form.getValues("experience");
                form.setValue("experience", [
                  ...experiences,
                  {
                    company: "",
                    position: "",
                    startDate: "",
                    description: "",
                    achievements: [],
                    technologies: [],
                  },
                ]);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {form.watch("experience").map((_, index) => (
              <div key={index} className="space-y-4 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0"
                  onClick={() => {
                    const experiences = form.getValues("experience");
                    form.setValue(
                      "experience",
                      experiences.filter((_, i) => i !== index)
                    );
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
                        <Input {...field} />
                      </FormControl>
                      <AiSuggestions
                        section={`experience.${index}.company`}
                        content={field.value}
                        onUseSuggestion={(suggestion) => field.onChange(suggestion)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`experience.${index}.position`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <AiSuggestions
                        section={`experience.${index}.position`}
                        content={field.value}
                        onUseSuggestion={(suggestion) => field.onChange(suggestion)}
                      />
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
                        <Textarea {...field} />
                      </FormControl>
                      <AiSuggestions
                        section={`experience.${index}.description`}
                        content={field.value}
                        onUseSuggestion={(suggestion) => field.onChange(suggestion)}
                      />
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