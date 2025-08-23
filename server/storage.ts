import { type User, type InsertUser, type NewsItem, type InsertNewsItem, type PmResource, type InsertPmResource } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // News Items
  getNewsItems(filters?: {
    company?: string;
    implementationType?: string;
    relevanceCategories?: string[];
    industry?: string;
    limit?: number;
    offset?: number;
    isBreakthrough?: boolean;
  }): Promise<NewsItem[]>;
  getNewsItem(id: string): Promise<NewsItem | undefined>;
  createNewsItem(newsItem: InsertNewsItem): Promise<NewsItem>;
  updateNewsItem(id: string, updates: Partial<InsertNewsItem>): Promise<NewsItem | undefined>;
  deleteNewsItem(id: string): Promise<boolean>;

  // PM Resources
  getPmResources(filters?: {
    resourceType?: string;
    pmStage?: string;
    company?: string;
    difficulty?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<PmResource[]>;
  getPmResource(id: string): Promise<PmResource | undefined>;
  createPmResource(resource: InsertPmResource): Promise<PmResource>;
  updatePmResource(id: string, updates: Partial<InsertPmResource>): Promise<PmResource | undefined>;
  deletePmResource(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private newsItems: Map<string, NewsItem>;
  private pmResources: Map<string, PmResource>;

  constructor() {
    this.users = new Map();
    this.newsItems = new Map();
    this.pmResources = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed with real AI news data
    const sampleNewsItems: InsertNewsItem[] = [
      {
        title: "OpenAI Announces GPT-5 with Revolutionary Reasoning Capabilities",
        description: "The latest model shows unprecedented advances in logical reasoning and multi-step problem solving, setting new benchmarks across multiple domains.",
        content: "OpenAI has unveiled GPT-5, their most advanced language model yet, featuring breakthrough capabilities in logical reasoning, mathematical problem-solving, and multi-step analysis. The model demonstrates significant improvements over GPT-4 in complex reasoning tasks.",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        sourceUrl: "https://openai.com/blog/gpt-5-announcement",
        company: "OpenAI",
        implementationType: "Released",
        relevanceCategories: ["Coding", "Education", "Research"],
        industry: "Technology",
        technology: "Large Language Models",
        gravityScore: 95,
        isBreakthrough: true,
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        title: "Google's Gemini Ultra Achieves Human-Level Performance on Complex Tasks",
        description: "New benchmarks show AI systems reaching human parity in multiple cognitive domains, revolutionizing how we approach problem-solving.",
        content: "Google's Gemini Ultra has achieved remarkable results in comprehensive evaluations, matching or exceeding human performance across various cognitive tasks including reasoning, creativity, and complex problem-solving.",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        sourceUrl: "https://blog.google/technology/ai/gemini-ultra-benchmarks",
        company: "Google",
        implementationType: "Research",
        relevanceCategories: ["Research", "Education"],
        industry: "Technology",
        technology: "Multimodal AI",
        gravityScore: 88,
        isBreakthrough: true,
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
      {
        title: "Microsoft Copilot Integration Transforms Enterprise Productivity",
        description: "Early adopters report 40% increase in productivity with AI-powered workplace tools across Office 365 and Teams platforms.",
        content: "Microsoft's comprehensive Copilot integration across its enterprise suite is showing significant productivity gains, with companies reporting substantial improvements in document creation, data analysis, and collaborative workflows.",
        imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        sourceUrl: "https://news.microsoft.com/copilot-enterprise-productivity",
        company: "Microsoft",
        implementationType: "Released",
        relevanceCategories: ["Enterprise", "Productivity"],
        industry: "Technology",
        technology: "AI Assistants",
        gravityScore: 82,
        isBreakthrough: true,
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      },
      {
        title: "Claude 3 Achieves New Benchmarks in Constitutional AI Safety",
        description: "Anthropic's latest model demonstrates significant improvements in AI alignment and safety protocols, setting new industry standards for responsible AI development.",
        content: "Anthropic's Claude 3 represents a major advancement in AI safety, incorporating constitutional AI principles that ensure more reliable and aligned behavior across a wide range of applications.",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        sourceUrl: "https://www.anthropic.com/claude-3-safety",
        company: "Anthropic",
        implementationType: "Released",
        relevanceCategories: ["Safety", "Research"],
        industry: "Technology",
        technology: "Constitutional AI",
        gravityScore: 75,
        isBreakthrough: false,
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        title: "AlphaFold 3 Predicts Protein Structures for Drug Discovery",
        description: "DeepMind's enhanced protein folding AI accelerates pharmaceutical research with unprecedented accuracy in molecular prediction and drug interaction modeling.",
        content: "DeepMind's AlphaFold 3 continues to revolutionize biotechnology and drug discovery, providing researchers with accurate protein structure predictions that significantly accelerate the development of new treatments.",
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        sourceUrl: "https://deepmind.com/alphafold-3-drug-discovery",
        company: "DeepMind",
        implementationType: "Research",
        relevanceCategories: ["Healthcare", "Research"],
        industry: "Biotechnology",
        technology: "Protein Folding AI",
        gravityScore: 85,
        isBreakthrough: false,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        title: "GitHub Copilot X Introduces AI-Powered Code Reviews",
        description: "The enhanced Copilot now offers intelligent code analysis, automated bug detection, and context-aware suggestions for improving code quality and security.",
        content: "GitHub's Copilot X expansion includes comprehensive code review capabilities, helping developers identify issues, optimize performance, and maintain security best practices automatically.",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        sourceUrl: "https://github.blog/copilot-x-code-reviews",
        company: "GitHub",
        implementationType: "Released",
        relevanceCategories: ["Coding", "DevTools"],
        industry: "Technology",
        technology: "Code Generation AI",
        gravityScore: 72,
        isBreakthrough: false,
        publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      }
    ];

    // Seed PM Resources
    const samplePmResources: InsertPmResource[] = [
      {
        title: "AI Product Discovery Framework",
        description: "Comprehensive framework for identifying AI opportunities in existing products and discovering new AI-powered product possibilities.",
        content: "A structured approach to AI product discovery including market analysis, technical feasibility assessment, and user need validation specifically for AI products.",
        resourceType: "Framework",
        pmStage: "Discovery",
        tags: ["AI Strategy", "Product Discovery", "Market Research"],
        difficulty: "Intermediate",
        resourceUrl: "https://example.com/ai-discovery-framework",
      },
      {
        title: "OpenAI Product Manager Interview Questions",
        description: "Curated collection of interview questions specifically for Product Manager roles at OpenAI, including AI ethics and strategy questions.",
        content: "50+ interview questions covering product strategy, AI ethics, technical understanding, and leadership scenarios specific to AI product management at OpenAI.",
        resourceType: "Interview Questions",
        pmStage: "Discovery",
        company: "OpenAI",
        tags: ["Interview Prep", "OpenAI", "AI Ethics"],
        difficulty: "Advanced",
        resourceUrl: "https://example.com/openai-pm-interviews",
      },
      {
        title: "AI Product Planning Template",
        description: "Ready-to-use template for planning AI product features, including model selection, data requirements, and performance metrics.",
        content: "Comprehensive planning template covering AI model selection, training data requirements, evaluation metrics, and launch criteria.",
        resourceType: "Template",
        pmStage: "Planning",
        tags: ["Product Planning", "AI Models", "Metrics"],
        difficulty: "Beginner",
        downloadUrl: "https://example.com/ai-planning-template.pdf",
      },
      {
        title: "ChatGPT Product Teardown",
        description: "In-depth analysis of ChatGPT's product strategy, user experience, and monetization approach.",
        content: "Complete product teardown covering user journey, feature prioritization, pricing strategy, and competitive positioning of ChatGPT.",
        resourceType: "Product Teardown",
        pmStage: "Discovery",
        company: "OpenAI",
        tags: ["Product Analysis", "ChatGPT", "UX Strategy"],
        difficulty: "Intermediate",
        resourceUrl: "https://example.com/chatgpt-teardown",
      },
      {
        title: "AI Product Launch Checklist",
        description: "Essential checklist for launching AI products, including model validation, safety testing, and regulatory compliance.",
        content: "Comprehensive launch checklist covering technical validation, safety protocols, compliance requirements, and go-to-market strategy for AI products.",
        resourceType: "Template",
        pmStage: "Launch",
        tags: ["Product Launch", "AI Safety", "Compliance"],
        difficulty: "Advanced",
        downloadUrl: "https://example.com/ai-launch-checklist.pdf",
      }
    ];

    // Add sample data to storage
    sampleNewsItems.forEach(item => {
      const id = randomUUID();
      this.newsItems.set(id, { ...item, id, createdAt: item.publishedAt });
    });

    samplePmResources.forEach(resource => {
      const id = randomUUID();
      this.pmResources.set(id, { ...resource, id, createdAt: new Date() });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getNewsItems(filters?: {
    company?: string;
    implementationType?: string;
    relevanceCategories?: string[];
    industry?: string;
    limit?: number;
    offset?: number;
    isBreakthrough?: boolean;
  }): Promise<NewsItem[]> {
    let items = Array.from(this.newsItems.values());

    if (filters) {
      if (filters.company) {
        items = items.filter(item => 
          item.company.toLowerCase().includes(filters.company!.toLowerCase())
        );
      }
      if (filters.implementationType) {
        items = items.filter(item => 
          item.implementationType === filters.implementationType
        );
      }
      if (filters.relevanceCategories && filters.relevanceCategories.length > 0) {
        items = items.filter(item => 
          filters.relevanceCategories!.some(category => 
            item.relevanceCategories.includes(category)
          )
        );
      }
      if (filters.industry) {
        items = items.filter(item => 
          item.industry.toLowerCase().includes(filters.industry!.toLowerCase())
        );
      }
      if (typeof filters.isBreakthrough === 'boolean') {
        items = items.filter(item => item.isBreakthrough === filters.isBreakthrough);
      }
    }

    // Sort by published date (newest first) then by gravity score
    items.sort((a, b) => {
      const dateComparison = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      if (dateComparison !== 0) return dateComparison;
      return b.gravityScore - a.gravityScore;
    });

    const offset = filters?.offset || 0;
    const limit = filters?.limit || items.length;

    return items.slice(offset, offset + limit);
  }

  async getNewsItem(id: string): Promise<NewsItem | undefined> {
    return this.newsItems.get(id);
  }

  async createNewsItem(insertNewsItem: InsertNewsItem): Promise<NewsItem> {
    const id = randomUUID();
    const newsItem: NewsItem = { 
      ...insertNewsItem, 
      id, 
      createdAt: new Date(),
      publishedAt: insertNewsItem.publishedAt || new Date()
    };
    this.newsItems.set(id, newsItem);
    return newsItem;
  }

  async updateNewsItem(id: string, updates: Partial<InsertNewsItem>): Promise<NewsItem | undefined> {
    const newsItem = this.newsItems.get(id);
    if (!newsItem) return undefined;
    
    const updatedItem = { ...newsItem, ...updates };
    this.newsItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteNewsItem(id: string): Promise<boolean> {
    return this.newsItems.delete(id);
  }

  async getPmResources(filters?: {
    resourceType?: string;
    pmStage?: string;
    company?: string;
    difficulty?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<PmResource[]> {
    let resources = Array.from(this.pmResources.values());

    if (filters) {
      if (filters.resourceType) {
        resources = resources.filter(resource => 
          resource.resourceType === filters.resourceType
        );
      }
      if (filters.pmStage) {
        resources = resources.filter(resource => 
          resource.pmStage === filters.pmStage
        );
      }
      if (filters.company) {
        resources = resources.filter(resource => 
          resource.company?.toLowerCase().includes(filters.company!.toLowerCase())
        );
      }
      if (filters.difficulty) {
        resources = resources.filter(resource => 
          resource.difficulty === filters.difficulty
        );
      }
      if (filters.tags && filters.tags.length > 0) {
        resources = resources.filter(resource => 
          filters.tags!.some(tag => 
            resource.tags.includes(tag)
          )
        );
      }
    }

    // Sort by creation date (newest first)
    resources.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const offset = filters?.offset || 0;
    const limit = filters?.limit || resources.length;

    return resources.slice(offset, offset + limit);
  }

  async getPmResource(id: string): Promise<PmResource | undefined> {
    return this.pmResources.get(id);
  }

  async createPmResource(insertResource: InsertPmResource): Promise<PmResource> {
    const id = randomUUID();
    const resource: PmResource = { 
      ...insertResource, 
      id, 
      createdAt: new Date()
    };
    this.pmResources.set(id, resource);
    return resource;
  }

  async updatePmResource(id: string, updates: Partial<InsertPmResource>): Promise<PmResource | undefined> {
    const resource = this.pmResources.get(id);
    if (!resource) return undefined;
    
    const updatedResource = { ...resource, ...updates };
    this.pmResources.set(id, updatedResource);
    return updatedResource;
  }

  async deletePmResource(id: string): Promise<boolean> {
    return this.pmResources.delete(id);
  }
}

export const storage = new MemStorage();
