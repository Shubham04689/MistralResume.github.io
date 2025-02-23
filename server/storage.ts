import { resumes, type Resume, type InsertResume } from "@shared/schema";

export interface IStorage {
  getResume(id: number): Promise<Resume | undefined>;
  getResumesByUser(userId: string): Promise<Resume[]>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: number, data: Partial<Resume>): Promise<Resume>;
  deleteResume(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private resumes: Map<number, Resume>;
  private currentId: number;

  constructor() {
    this.resumes = new Map();
    this.currentId = 1;
  }

  async getResume(id: number): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async getResumesByUser(userId: string): Promise<Resume[]> {
    return Array.from(this.resumes.values()).filter(
      (resume) => resume.userId === userId
    );
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = this.currentId++;
    const resume: Resume = { ...insertResume, id };
    this.resumes.set(id, resume);
    return resume;
  }

  async updateResume(id: number, data: Partial<Resume>): Promise<Resume> {
    const existing = await this.getResume(id);
    if (!existing) {
      throw new Error("Resume not found");
    }
    const updated = { ...existing, ...data };
    this.resumes.set(id, updated);
    return updated;
  }

  async deleteResume(id: number): Promise<void> {
    this.resumes.delete(id);
  }
}

export const storage = new MemStorage();
