import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
export async function POST(request) {
  try {
    const body = await request.json();
    await prisma.comment.create({
      data: {
        text: body.text,
        postId: Number(body.postId),
        userId: Number(body.userId),
      },
    });
    return NextResponse.json({ message: "Comment added successfully." });
  } catch {
    return NextResponse.json(
      { message: "Failed to add comment." },
      { status: 500 },
    );
  }
}
