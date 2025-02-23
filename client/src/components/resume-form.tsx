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
import { AiSuggestions } from "./ai-suggestions";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const defaultValues: ResumeData = {
  contact: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
  },
  summary: "",
  education: [{ institution: "", degree: "", field: "", startDate: "" }],
  experience: [{ company: "", position: "", startDate: "", description: "" }],
  skills: [{ category: "", items: [] }],
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            {/* Add other contact fields similarly */}
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
                  <AiSuggestions section="summary" content={field.value} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Add Education, Experience, and Skills sections similarly */}

        <Button type="submit" className="w-full">
          Save Resume
        </Button>
      </form>
    </Form>
  );
}
