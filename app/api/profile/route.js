import { NextResponse } from "next/server";
import { getUserProfile, findUserByEmail, updateUserProfile } from "../../../lib/repository";
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));
    const user = await getUserProfile(userId);
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
    const existing = await findUserByEmail(body.email);
    if (existing && existing.id !== Number(body.userId))
      return NextResponse.json(
        { message: "This email is already used by another account." },
        { status: 400 },
      );
    const user = await updateUserProfile(Number(body.userId), body.username, body.email);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { message: "Failed to update profile." },
      { status: 500 },
    );
  }
}
