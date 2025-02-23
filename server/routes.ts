import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { Mistral } from "./lib/mistral";
import { resumeSchema } from "@shared/schema";

const mistral = new Mistral(process.env.MISTRAL_API_KEY || "");

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

  // AI Suggestions
  app.post("/api/suggest", async (req, res) => {
    const { section, content } = req.body;
    try {
      const suggestion = await mistral.getSuggestion(section, content);
      res.json({ suggestion });
    } catch (error) {
      res.status(500).json({ message: "Failed to get AI suggestion" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
