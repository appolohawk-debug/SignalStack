import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNewsItemSchema, insertPmResourceSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // News Items API Routes
  app.get("/api/news", async (req, res) => {
    try {
      const {
        company,
        implementationType,
        relevanceCategories,
        industry,
        limit = 20,
        offset = 0,
        isBreakthrough
      } = req.query;

      const filters: any = {};
      if (company) filters.company = String(company);
      if (implementationType) filters.implementationType = String(implementationType);
      if (relevanceCategories) {
        filters.relevanceCategories = String(relevanceCategories).split(',');
      }
      if (industry) filters.industry = String(industry);
      if (isBreakthrough !== undefined) {
        filters.isBreakthrough = isBreakthrough === 'true';
      }
      filters.limit = parseInt(String(limit));
      filters.offset = parseInt(String(offset));

      const newsItems = await storage.getNewsItems(filters);
      res.json(newsItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news items" });
    }
  });

  app.get("/api/news/:id", async (req, res) => {
    try {
      const newsItem = await storage.getNewsItem(req.params.id);
      if (!newsItem) {
        return res.status(404).json({ message: "News item not found" });
      }
      res.json(newsItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news item" });
    }
  });

  app.post("/api/news", async (req, res) => {
    try {
      const validatedData = insertNewsItemSchema.parse(req.body);
      const newsItem = await storage.createNewsItem(validatedData);
      res.status(201).json(newsItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid news item data", error });
    }
  });

  // PM Resources API Routes
  app.get("/api/pm-resources", async (req, res) => {
    try {
      const {
        resourceType,
        pmStage,
        company,
        difficulty,
        tags,
        limit = 20,
        offset = 0
      } = req.query;

      const filters: any = {};
      if (resourceType) filters.resourceType = String(resourceType);
      if (pmStage) filters.pmStage = String(pmStage);
      if (company) filters.company = String(company);
      if (difficulty) filters.difficulty = String(difficulty);
      if (tags) {
        filters.tags = String(tags).split(',');
      }
      filters.limit = parseInt(String(limit));
      filters.offset = parseInt(String(offset));

      const resources = await storage.getPmResources(filters);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch PM resources" });
    }
  });

  app.get("/api/pm-resources/:id", async (req, res) => {
    try {
      const resource = await storage.getPmResource(req.params.id);
      if (!resource) {
        return res.status(404).json({ message: "PM resource not found" });
      }
      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch PM resource" });
    }
  });

  app.post("/api/pm-resources", async (req, res) => {
    try {
      const validatedData = insertPmResourceSchema.parse(req.body);
      const resource = await storage.createPmResource(validatedData);
      res.status(201).json(resource);
    } catch (error) {
      res.status(400).json({ message: "Invalid PM resource data", error });
    }
  });

  // Get filter options
  app.get("/api/filters", async (req, res) => {
    try {
      const allNews = await storage.getNewsItems();
      const allResources = await storage.getPmResources();

      const companies = [...new Set(allNews.map(item => item.company))];
      const implementationTypes = [...new Set(allNews.map(item => item.implementationType))];
      const relevanceCategories = [...new Set(allNews.flatMap(item => item.relevanceCategories))];
      const industries = [...new Set(allNews.map(item => item.industry))];
      const technologies = [...new Set(allNews.map(item => item.technology))];

      const resourceTypes = [...new Set(allResources.map(resource => resource.resourceType))];
      const pmStages = [...new Set(allResources.map(resource => resource.pmStage))];
      const difficulties = [...new Set(allResources.map(resource => resource.difficulty))];
      const resourceTags = [...new Set(allResources.flatMap(resource => resource.tags))];

      res.json({
        news: {
          companies,
          implementationTypes,
          relevanceCategories,
          industries,
          technologies
        },
        pmResources: {
          resourceTypes,
          pmStages,
          difficulties,
          tags: resourceTags
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch filter options" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
