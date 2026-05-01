import { NextResponse } from "next/server";
import { getStats } from "../../../lib/repository";
export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json({ stats });
  } catch {
    return NextResponse.json(
      { message: "Failed to load statistics." },
      { status: 500 },
    );
  }
}
