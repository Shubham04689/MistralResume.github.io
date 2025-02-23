import { pgTable, text, serial, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Resume sections schema
const contactSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  linkedIn: z.string().optional(),
  website: z.string().optional(),
});

const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field of study is required"),
  startDate: z.string(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  achievements: z.array(z.string()).optional(),
});

const experienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  achievements: z.array(z.string()),
  technologies: z.array(z.string()).optional(),
});

const skillSchema = z.object({
  category: z.string().min(1, "Category is required"),
  items: z.array(z.string()),
  proficiency: z.enum(["beginner", "intermediate", "advanced"]).optional(),
});

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string(),
  technologies: z.array(z.string()),
  link: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const resumeSchema = z.object({
  contact: contactSchema,
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  education: z.array(educationSchema),
  experience: z.array(experienceSchema),
  skills: z.array(skillSchema),
  projects: z.array(projectSchema).optional(),
  languages: z.array(z.object({
    name: z.string(),
    proficiency: z.string(),
  })).optional(),
});

// RAG-related schemas
export const embeddingSchema = z.object({
  text: z.string(),
  vector: z.array(z.number()),
  metadata: z.object({
    section: z.string(),
    category: z.string(),
    timestamp: z.string(),
  }),
});

// Database tables
export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  data: json("data").$type<z.infer<typeof resumeSchema>>().notNull(),
  template: text("template").notNull().default("modern"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const embeddings = pgTable("embeddings", {
  id: serial("id").primaryKey(),
  resumeId: text("resume_id").notNull(),
  text: text("text").notNull(),
  vector: json("vector").$type<number[]>().notNull(),
  metadata: json("metadata").$type<z.infer<typeof embeddingSchema>["metadata"]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertResumeSchema = createInsertSchema(resumes).omit({ createdAt: true, updatedAt: true });
export const insertEmbeddingSchema = createInsertSchema(embeddings).omit({ createdAt: true });

export type Resume = typeof resumes.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type ResumeData = z.infer<typeof resumeSchema>;
export type Embedding = typeof embeddings.$inferSelect;
export type InsertEmbedding = z.infer<typeof insertEmbeddingSchema>;