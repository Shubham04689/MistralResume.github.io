import { resumes, embeddings, type Resume, type InsertResume, type Embedding, type InsertEmbedding } from "@shared/schema";

export interface IStorage {
  // Resume operations
  getResume(id: number): Promise<Resume | undefined>;
  getResumesByUser(userId: string): Promise<Resume[]>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: number, data: Partial<Resume>): Promise<Resume>;
  deleteResume(id: number): Promise<void>;

  // Embedding operations
  createEmbedding(embedding: InsertEmbedding): Promise<Embedding>;
  getEmbeddingsByResumeId(resumeId: string): Promise<Embedding[]>;
  searchSimilarEmbeddings(resumeId: string, vector: number[], limit?: number): Promise<Embedding[]>;
}

export class MemStorage implements IStorage {
  private resumes: Map<number, Resume>;
  private embeddings: Map<number, Embedding>;
  private currentResumeId: number;
  private currentEmbeddingId: number;

  constructor() {
    this.resumes = new Map();
    this.embeddings = new Map();
    this.currentResumeId = 1;
    this.currentEmbeddingId = 1;
  }

  // Resume operations
  async getResume(id: number): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async getResumesByUser(userId: string): Promise<Resume[]> {
    return Array.from(this.resumes.values()).filter(
      (resume) => resume.userId === userId
    );
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = this.currentResumeId++;
    const now = new Date();
    const resume: Resume = {
      ...insertResume,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async updateResume(id: number, data: Partial<Resume>): Promise<Resume> {
    const existing = await this.getResume(id);
    if (!existing) {
      throw new Error("Resume not found");
    }
    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    this.resumes.set(id, updated);
    return updated;
  }

  async deleteResume(id: number): Promise<void> {
    this.resumes.delete(id);
    // Also delete associated embeddings
    const embeddingsToDelete = [...this.embeddings.entries()]
      .filter(([_, embedding]) => embedding.resumeId === id.toString());

    for (const [embeddingId] of embeddingsToDelete) {
      this.embeddings.delete(embeddingId);
    }
  }

  // Embedding operations
  async createEmbedding(insertEmbedding: InsertEmbedding): Promise<Embedding> {
    const id = this.currentEmbeddingId++;
    const embedding: Embedding = {
      ...insertEmbedding,
      id,
      createdAt: new Date(),
    };
    this.embeddings.set(id, embedding);
    return embedding;
  }

  async getEmbeddingsByResumeId(resumeId: string): Promise<Embedding[]> {
    return Array.from(this.embeddings.values()).filter(
      (embedding) => embedding.resumeId === resumeId
    );
  }

  async searchSimilarEmbeddings(
    resumeId: string,
    vector: number[],
    limit: number = 3
  ): Promise<Embedding[]> {
    const relevantEmbeddings = await this.getEmbeddingsByResumeId(resumeId);
    return relevantEmbeddings
      .map((embedding) => ({
        ...embedding,
        similarity: this.calculateCosineSimilarity(vector, embedding.vector),
      }))
      .sort((a, b) => (b as any).similarity - (a as any).similarity)
      .slice(0, limit);
  }

  private calculateCosineSimilarity(a: number[], b: number[]): number {
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
}

export const storage = new MemStorage();