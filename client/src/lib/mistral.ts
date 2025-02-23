import { z } from "zod";

// Define schemas for different resume sections
const ExperienceSuggestion = z.object({
  description: z.string(),
  achievements: z.array(z.string()),
  keywords: z.array(z.string()),
});

const EducationSuggestion = z.object({
  description: z.string(),
  highlights: z.array(z.string()),
});

const SkillsSuggestion = z.object({
  skills: z.array(z.string()),
  categories: z.array(z.string()),
});

const SummarySuggestion = z.object({
  summary: z.string(),
  keywords: z.array(z.string()),
});

export class Mistral {
  private apiKey: string;
  private baseUrl = "https://api.mistral.ai/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getSystemPrompt(section: string): string {
    switch (section) {
      case "experience":
        return "You are a professional resume writer. Analyze the work experience and provide an improved description, key achievements, and relevant keywords.";
      case "education":
        return "You are a professional resume writer. Review the education details and suggest an improved description and key highlights.";
      case "skills":
        return "You are a professional resume writer. Analyze the skills and suggest relevant skills and categories for organization.";
      case "summary":
        return "You are a professional resume writer. Create a compelling professional summary and extract key professional keywords.";
      default:
        return "You are a professional resume writer helping to improve resume content.";
    }
  }

  private getResponseSchema(section: string) {
    switch (section) {
      case "experience":
        return ExperienceSuggestion;
      case "education":
        return EducationSuggestion;
      case "skills":
        return SkillsSuggestion;
      case "summary":
        return SummarySuggestion;
      default:
        return z.object({ content: z.string() });
    }
  }

  async getSuggestion(section: string, content: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(section),
          },
          {
            role: "user",
            content: `Please analyze and improve this ${section} content. Provide the response in a structured JSON format:\n\n${content}`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(
        `Failed to get AI suggestion: ${error?.error?.message || response.statusText}`
      );
    }

    try {
      const data = await response.json();
      const rawContent = data.choices[0].message.content;
      const parsedContent = JSON.parse(rawContent);
      const schema = this.getResponseSchema(section);
      return schema.parse(parsedContent);
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      throw new Error("Failed to parse AI suggestion");
    }
  }
}