"use server";

import { randomUUID } from "crypto";
import { z } from "zod";
import { getSupabaseClient } from "./supabase/server";
import type { RoadmapItem, CommunityIdea, BugReport, IdeaSubmission, BugSubmission } from "@/types/roadmap";

// ==========================================
// HELPER FUNCTIONS
// ==========================================

const toNumber = (value: unknown) =>
  typeof value === "number" ? value : Number(value ?? 0);

// ==========================================
// ROADMAP ITEMS (Official Dev Tasks)
// ==========================================

function mapRowToRoadmapItem(row: Record<string, unknown>): RoadmapItem {
  return {
    id: String(row.id ?? randomUUID()),
    title: String(row.title ?? ""),
    description: typeof row.description === "string" ? row.description : "",
    status: (typeof row.status === "string" ? row.status : "researching") as RoadmapItem["status"],
    category: typeof row.category === "string" ? row.category : undefined,
    eta: typeof row.eta === "string" ? row.eta : undefined,
    accelerations: toNumber(row.accelerations),
    created_at: typeof row.created_at === "string" ? row.created_at : null,
    startDate: typeof row.start_date === "string" ? row.start_date : undefined,
    targetDate: typeof row.target_date === "string" ? row.target_date : undefined,
    progress: toNumber(row.progress),
    coverImage: typeof row.cover_image === "string" ? row.cover_image : undefined,
    detailedContent: typeof row.detailed_content === "string" ? row.detailed_content : undefined,
    sourceIdeaId: typeof row.source_idea_id === "string" ? row.source_idea_id : undefined,
  };
}

const mockRoadmapItems: RoadmapItem[] = [
  {
    id: "mock-1",
    title: "Adaptive interview simulator",
    description: "Dynamic interviewer that mirrors tone, speed, and asks tougher follow-ups when you perform well.",
    status: "building",
    category: "Feature",
    eta: "Q1",
    accelerations: 24,
    created_at: new Date().toISOString(),
  },
];

export async function listRoadmapItems(): Promise<RoadmapItem[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [...mockRoadmapItems];

  const { data, error } = await supabase
    .from("roadmap_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("Falling back to mock roadmap data", error);
    return [...mockRoadmapItems];
  }

  return data.map(mapRowToRoadmapItem);
}

export async function accelerateRoadmapItem(id: string): Promise<RoadmapItem> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("Database not available");
  }

  const { data: existing, error: fetchError } = await supabase
    .from("roadmap_items")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    throw new Error(fetchError?.message ?? "Item not found");
  }

  const { data, error } = await supabase
    .from("roadmap_items")
    .update({ accelerations: (existing.accelerations ?? 0) + 1 })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Accelerate failed");
  }

  return mapRowToRoadmapItem(data);
}

// ==========================================
// COMMUNITY IDEAS (User Submissions)
// ==========================================

function mapRowToIdea(row: Record<string, unknown>): CommunityIdea {
  return {
    id: String(row.id ?? randomUUID()),
    title: String(row.title ?? ""),
    description: typeof row.description === "string" ? row.description : "",
    category: typeof row.category === "string" ? row.category : undefined,
    status: (typeof row.status === "string" ? row.status : "open") as CommunityIdea["status"],
    upvotes: toNumber(row.upvotes),
    downvotes: toNumber(row.downvotes),
    coverImage: typeof row.cover_image === "string" ? row.cover_image : undefined,
    created_at: typeof row.created_at === "string" ? row.created_at : null,
  };
}

const ideaSubmissionSchema = z.object({
  title: z.string().min(6, "Title is too short").max(140),
  description: z.string().min(12, "Tell us more about the idea").max(800),
  category: z.string().max(80).optional(),
});

const mockIdeas: CommunityIdea[] = [
  {
    id: "mock-idea-1",
    title: "Dark mode for mobile app",
    description: "I often study at night and the white background is too bright.",
    status: "open",
    category: "UIUX",
    upvotes: 45,
    downvotes: 0,
    created_at: new Date().toISOString(),
  },
];

export async function listCommunityIdeas(): Promise<CommunityIdea[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [...mockIdeas];

  const { data, error } = await supabase
    .from("community_ideas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("Falling back to mock ideas", error);
    return [...mockIdeas];
  }

  return data.map(mapRowToIdea);
}

export async function createIdea(payload: IdeaSubmission): Promise<CommunityIdea> {
  const parsed = ideaSubmissionSchema.parse(payload);
  const supabase = getSupabaseClient();

  const newIdea = {
    id: randomUUID(),
    title: parsed.title,
    description: parsed.description,
    category: parsed.category,
    status: "open",
    upvotes: 0,
    downvotes: 0,
  };

  if (!supabase) {
    return { ...newIdea, created_at: new Date().toISOString() } as CommunityIdea;
  }

  const { data, error } = await supabase
    .from("community_ideas")
    .insert([newIdea])
    .select()
    .single();

  if (error || !data) {
    console.warn("Failed to create idea", error);
    throw new Error(error?.message ?? "Failed to create idea");
  }

  return mapRowToIdea(data);
}

export async function voteIdea(id: string, direction: "up" | "down"): Promise<CommunityIdea> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("Database not available");
  }

  const { data: existing, error: fetchError } = await supabase
    .from("community_ideas")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    throw new Error(fetchError?.message ?? "Idea not found");
  }

  const updates = direction === "up"
    ? { upvotes: (existing.upvotes ?? 0) + 1 }
    : { downvotes: (existing.downvotes ?? 0) + 1 };

  const { data, error } = await supabase
    .from("community_ideas")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Vote failed");
  }

  return mapRowToIdea(data);
}

// ==========================================
// BUG REPORTS
// ==========================================

function mapRowToBugReport(row: Record<string, unknown>): BugReport {
  return {
    id: String(row.id ?? randomUUID()),
    title: String(row.title ?? ""),
    description: typeof row.description === "string" ? row.description : undefined,
    stepsToReproduce: typeof row.steps_to_reproduce === "string" ? row.steps_to_reproduce : undefined,
    expectedResult: typeof row.expected_result === "string" ? row.expected_result : undefined,
    actualResult: typeof row.actual_result === "string" ? row.actual_result : undefined,
    severity: (typeof row.severity === "string" ? row.severity : "minor") as BugReport["severity"],
    platform: (typeof row.platform === "string" ? row.platform : "Web") as BugReport["platform"],
    status: (typeof row.status === "string" ? row.status : "reported") as BugReport["status"],
    upvotes: toNumber(row.upvotes),
    created_at: typeof row.created_at === "string" ? row.created_at : null,
  };
}

const bugSubmissionSchema = z.object({
  title: z.string().min(6, "Title is too short").max(140),
  stepsToReproduce: z.string().min(10, "Please describe how to reproduce").max(1000),
  expectedResult: z.string().min(5, "Tell us what should happen").max(500),
  actualResult: z.string().min(5, "Tell us what actually happens").max(500),
  severity: z.enum(["minor", "major", "blocker"]),
  platform: z.enum(["iOS", "Android", "Web"]),
});

const mockBugs: BugReport[] = [];

export async function listBugReports(): Promise<BugReport[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [...mockBugs];

  const { data, error } = await supabase
    .from("bug_reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("Falling back to mock bugs", error);
    return [...mockBugs];
  }

  return data.map(mapRowToBugReport);
}

export async function createBugReport(payload: BugSubmission): Promise<BugReport> {
  const parsed = bugSubmissionSchema.parse(payload);
  const supabase = getSupabaseClient();

  const newBug = {
    id: randomUUID(),
    title: parsed.title,
    steps_to_reproduce: parsed.stepsToReproduce,
    expected_result: parsed.expectedResult,
    actual_result: parsed.actualResult,
    severity: parsed.severity,
    platform: parsed.platform,
    status: "reported",
    upvotes: 0,
  };

  if (!supabase) {
    return {
      ...newBug,
      stepsToReproduce: newBug.steps_to_reproduce,
      expectedResult: newBug.expected_result,
      actualResult: newBug.actual_result,
      created_at: new Date().toISOString(),
    } as BugReport;
  }

  const { data, error } = await supabase
    .from("bug_reports")
    .insert([newBug])
    .select()
    .single();

  if (error || !data) {
    console.warn("Failed to create bug report", error);
    throw new Error(error?.message ?? "Failed to create bug report");
  }

  return mapRowToBugReport(data);
}

export async function voteBugReport(id: string): Promise<BugReport> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error("Database not available");
  }

  const { data: existing, error: fetchError } = await supabase
    .from("bug_reports")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    throw new Error(fetchError?.message ?? "Bug not found");
  }

  const { data, error } = await supabase
    .from("bug_reports")
    .update({ upvotes: (existing.upvotes ?? 0) + 1 })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Vote failed");
  }

  return mapRowToBugReport(data);
}
