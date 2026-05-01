import { NextResponse } from "next/server";
import { createComment } from "../../../lib/repository";
export async function POST(request) {
  try {
    const body = await request.json();
    await createComment(body.text, Number(body.postId), Number(body.userId));
    return NextResponse.json({ message: "Comment added successfully." });
  } catch {
    return NextResponse.json(
      { message: "Failed to add comment." },
      { status: 500 },
    );
  }
}
