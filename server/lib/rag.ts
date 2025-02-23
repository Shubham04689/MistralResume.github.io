export class RAGService {
  private apiKey: string;
  private baseUrl = "https://api.mistral.ai/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await fetch(`${this.baseUrl}/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-embed",
        input: text,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate embedding");
    }

    const data = await response.json();
    return data.data[0].embedding;
  }

  calculateCosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error("Vectors must have same length");
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async findSimilarContent(
    query: string,
    embeddings: Array<{ text: string; vector: number[]; metadata: any }>,
    topK: number = 3
  ): Promise<Array<{ text: string; similarity: number; metadata: any }>> {
    const queryEmbedding = await this.generateEmbedding(query);

    return embeddings
      .map((item) => ({
        text: item.text,
        metadata: item.metadata,
        similarity: this.calculateCosineSimilarity(queryEmbedding, item.vector),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }
}
