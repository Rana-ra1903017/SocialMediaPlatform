import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));
    const users = await prisma.user.findMany({
      where: { id: { not: userId } },
      select: { id: true, username: true, email: true },
      orderBy: { username: "asc" },
    });
    const follows = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    return NextResponse.json({
      users,
      followingIds: follows.map((x) => x.followingId),
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to load follow data." },
      { status: 500 },
    );
  }
}
export async function POST(request) {
  try {
    const body = await request.json();
    const existing = await prisma.follow.findFirst({
      where: {
        followerId: Number(body.followerId),
        followingId: Number(body.followingId),
      },
    });
    if (!existing)
      await prisma.follow.create({
        data: {
          followerId: Number(body.followerId),
          followingId: Number(body.followingId),
        },
      });
    return NextResponse.json({ message: "Followed successfully." });
  } catch {
    return NextResponse.json({ message: "Follow failed." }, { status: 500 });
  }
}
export async function DELETE(request) {
  try {
    const body = await request.json();
    await prisma.follow.deleteMany({
      where: {
        followerId: Number(body.followerId),
        followingId: Number(body.followingId),
      },
    });
    return NextResponse.json({ message: "Unfollowed successfully." });
  } catch {
    return NextResponse.json({ message: "Unfollow failed." }, { status: 500 });
  }
}
