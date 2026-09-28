export type ProjectSpec = {
  id: string;
  userId?: string;
  name: string;
  description: string;
  prompt: string;
  stack: string;
  theme: string;
  pages: string[];
  features: string[];
  htmlSnippet: string;
  appCode?: string;
  cssCode?: string;
  jsCode?: string;
  status?: string;
  isPublic?: boolean;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string | null;
};

export type GenerationRequest = {
  prompt: string;
  projectId?: string;
  regenerate?: boolean;
};

export type GenerationResponse = {
  project: ProjectSpec;
  message?: string;
};

export type APIError = {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
};
