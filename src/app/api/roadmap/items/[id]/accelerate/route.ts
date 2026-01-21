import { NextRequest, NextResponse } from "next/server";
import { accelerateRoadmapItem } from "@/lib/roadmap";

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const item = await accelerateRoadmapItem(id);
    return NextResponse.json({ item });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unable to accelerate task";
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
