import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: { select: { posts: true, followers: true, following: true } },
      },
    });
    return NextResponse.json({
      profile: {
        id: user.id,
        username: user.username,
        email: user.email,
        postsCount: user._count.posts,
        followersCount: user._count.followers,
        followingCount: user._count.following,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to load profile." },
      { status: 500 },
    );
  }
}
export async function PUT(request) {
  try {
    const body = await request.json();
    const existing = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existing && existing.id !== Number(body.userId))
      return NextResponse.json(
        { message: "This email is already used by another account." },
        { status: 400 },
      );
    const user = await prisma.user.update({
      where: { id: Number(body.userId) },
      data: { username: body.username, email: body.email },
      select: { id: true, username: true, email: true },
    });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { message: "Failed to update profile." },
      { status: 500 },
    );
  }
}
