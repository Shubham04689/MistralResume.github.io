export class Mistral {
  private apiKey: string;
  private baseUrl = "https://api.mistral.ai/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getSuggestion(section: string, content: string): Promise<string> {
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
            content: "You are a professional resume writer helping to improve resume content.",
          },
          {
            role: "user",
            content: `Suggest improvements for this ${section} section: ${content}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get AI suggestion");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}
