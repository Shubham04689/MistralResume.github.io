export class Mistral {
  private apiKey: string;
  private baseUrl = "https://api.mistral.ai/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getContextPrompt(content: string): string {
    return content.length > 500 
      ? content.substring(0, 500) + "..."
      : content;
  }

  async getSuggestion(section: string, content: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [
          {
            role: "system",
            content: "You are a professional resume writer. Provide concise suggestions in 2-3 paragraphs and include 2-3 specific examples for improvement. Focus on clarity, impact, and professional tone.",
          },
          {
            role: "user",
            content: `Please improve this ${section} section. Provide a rewrite in 2-3 paragraphs and 2-3 specific examples:\n\n${this.getContextPrompt(content)}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get AI suggestion");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}