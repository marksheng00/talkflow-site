import { NextResponse } from "next/server";
import { listRoadmapItems } from "@/lib/roadmap";

export async function GET() {
  const items = await listRoadmapItems();
  return NextResponse.json({ items });
}

// POST is no longer needed here - use server actions directly
// Ideas are created via createIdea, Bugs via createBugReport
