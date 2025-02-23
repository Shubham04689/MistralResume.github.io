import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { Mistral } from "./lib/mistral";
import { RAGService } from "./lib/rag";
import { resumeSchema, embeddingSchema } from "@shared/schema";
import {ResumeData} from "@shared/types"

if (!process.env.MISTRAL_API_KEY) {
  throw new Error("MISTRAL_API_KEY environment variable is required");
}

const mistral = new Mistral(process.env.MISTRAL_API_KEY);
const rag = new RAGService(process.env.MISTRAL_API_KEY);

export async function registerRoutes(app: Express) {
  // Resume CRUD operations
  app.get("/api/resumes/:id", async (req, res) => {
    const resume = await storage.getResume(Number(req.params.id));
    if (!resume) {
      res.status(404).json({ message: "Resume not found" });
      return;
    }
    res.json(resume);
  });

  app.get("/api/resumes/user/:userId", async (req, res) => {
    const resumes = await storage.getResumesByUser(req.params.userId);
    res.json(resumes);
  });

  app.post("/api/resumes", async (req, res) => {
    const parsed = resumeSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ errors: parsed.error });
      return;
    }

    const resume = await storage.createResume({
      userId: "test-user", // TODO: Get from auth
      data: parsed.data,
      template: "modern",
    });

    // Generate embeddings for relevant sections
    try {
      const sections = [
        { text: parsed.data.summary, category: "summary" },
        ...parsed.data.experience.map(exp => ({
          text: exp.description,
          category: "experience",
        })),
        ...parsed.data.education.map(edu => ({
          text: `${edu.degree} in ${edu.field} from ${edu.institution}`,
          category: "education",
        })),
      ];

      for (const section of sections) {
        const vector = await rag.generateEmbedding(section.text);
        await storage.createEmbedding({
          resumeId: resume.id.toString(),
          text: section.text,
          vector,
          metadata: {
            section: section.category,
            category: section.category,
            timestamp: new Date().toISOString(),
          },
        });
      }
    } catch (error) {
      console.error("Failed to generate embeddings:", error);
      // Continue without embeddings
    }

    res.json(resume);
  });

  app.put("/api/resumes/:id", async (req, res) => {
    const parsed = resumeSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ errors: parsed.error });
      return;
    }
    try {
      const resume = await storage.updateResume(Number(req.params.id), {
        data: parsed.data,
      });
      res.json(resume);
    } catch (error) {
      res.status(404).json({ message: "Resume not found" });
    }
  });

  // AI Suggestions with RAG
  app.post("/api/suggest", async (req, res) => {
    const { section, content, resumeId } = req.body;
    try {
      // Get similar content from existing embeddings
      const similar = resumeId
        ? await storage.getEmbeddingsByResumeId(resumeId)
        : [];

      let context = "";
      if (similar.length > 0) {
        const queryVector = await rag.generateEmbedding(content);
        const similarContent = await storage.searchSimilarEmbeddings(
          resumeId,
          queryVector,
          3
        );
        context = `Here are some similar examples from existing resumes:\n${
          similarContent.map(s => s.text).join("\n")
        }\n\n`;
      }

      // Get AI suggestion with context
      const suggestion = await mistral.getSuggestion(
        section,
        `${context}Current content: ${content}`
      );

      res.json({ suggestion });
    } catch (error) {
      console.error("Failed to get AI suggestion:", error);
      res.status(500).json({ message: "Failed to get AI suggestion" });
    }
  });

  // Generate complete resume with AI
  app.post("/api/generate-resume", async (req, res) => {
    try {
      const currentData = req.body.currentData;

      // Generate a professional summary
      const summaryPrompt = currentData?.summary 
        ? `Improve this professional summary: ${currentData.summary}`
        : "Generate a professional summary for a resume";

      const summary = await mistral.getSuggestion("summary", summaryPrompt);

      // Generate experience descriptions if needed
      const experience = currentData?.experience?.length 
        ? await Promise.all(currentData.experience.map(async (exp) => {
            if (!exp.description) {
              const description = await mistral.getSuggestion(
                "experience",
                `Generate a professional description for ${exp.position} at ${exp.company}`
              );
              return { ...exp, description };
            }
            return exp;
          }))
        : [{
            company: "Previous Company",
            position: "Previous Position",
            startDate: "2020-01",
            description: await mistral.getSuggestion(
              "experience",
              "Generate a sample work experience description"
            ),
            achievements: [],
            technologies: [],
          }];

      // Generate a complete resume structure
      const generatedResume: ResumeData = {
        contact: currentData?.contact || {
          fullName: "",
          email: "",
          phone: "",
          location: "",
          linkedIn: "",
          website: "",
        },
        summary,
        experience,
        education: currentData?.education || [{
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          gpa: "",
          achievements: [],
        }],
        skills: currentData?.skills || [{
          category: "Technical Skills",
          items: [],
          proficiency: "intermediate",
        }],
        projects: currentData?.projects || [],
        languages: currentData?.languages || [],
      };

      res.json(generatedResume);
    } catch (error) {
      console.error("Failed to generate resume:", error);
      res.status(500).json({ message: "Failed to generate resume" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}