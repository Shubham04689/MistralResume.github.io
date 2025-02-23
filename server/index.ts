import "dotenv/config";
import dotenv from 'dotenv';
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from 'http';
import { VercelRequest, VercelResponse } from '@vercel/node';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

const formatBulletPoints = (text: string) => {
  return text
    .split('\n')
    .map(line => {
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return `• ${line.substring(2)}`;
      }
      return line;
    })
    .join('\n');
};

async function setupServer() {
  await registerRoutes(app);
  serveStatic(app);
  return createServer(app);
}

export default async (req: VercelRequest, res: VercelResponse) => {
  const server = await setupServer();
  server.emit('request', req, res);
};