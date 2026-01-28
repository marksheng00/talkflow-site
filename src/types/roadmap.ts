// Types for Roadmap (Official Dev Tasks)
export type RoadmapStatus = "researching" | "building" | "shipping" | "released" | "done";

export type RoadmapItem = {
  id: string;
  title: Record<string, string>; // { en: "...", zh: "..." }
  description: Record<string, string>;
  status: RoadmapStatus;
  category?: string;
  eta?: string;
  accelerations: number;
  created_at?: string | null;
  startDate?: string;
  targetDate?: string;
  progress?: number;
  coverImage?: string;
  detailedContent?: Record<string, string>;
  sourceIdeaId?: string;  // Link to original idea if applicable
};

// Types for Community Ideas (User Submissions)
export type IdeaStatus = "open" | "under_review" | "planned" | "declined";

export type CommunityIdea = {
  id: string;
  title: string;
  description: string;
  category?: string;
  status: IdeaStatus;
  upvotes: number;
  downvotes: number;
  coverImage?: string;
  created_at?: string | null;
};

export type IdeaSubmission = {
  title: string;
  description: string;
  category?: string;
};

// Types for Bug Reports
export type BugSeverity = "minor" | "major" | "blocker";
export type BugPlatform = "iOS" | "Android" | "Web";
export type BugStatus = "reported" | "investigating" | "fixing" | "resolved" | "wont_fix";

export type BugReport = {
  id: string;
  title: string;
  description?: string;
  stepsToReproduce?: string;
  expectedResult?: string;
  actualResult?: string;
  severity: BugSeverity;
  platform: BugPlatform;
  status: BugStatus;
  upvotes: number;
  created_at?: string | null;
};

export type BugSubmission = {
  title: string;
  stepsToReproduce: string;
  expectedResult?: string;
  actualResult?: string;
  severity?: BugSeverity;
  platform: BugPlatform;
};

// Category type (shared)
export type Category = "All" | "Feature" | "Content" | "AI Core" | "UIUX";
export const categories: Category[] = ["All", "Feature", "Content", "AI Core", "UIUX"];
