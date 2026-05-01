import { NextResponse } from "next/server";
import { getFollowData, followUser, unfollowUser } from "../../../lib/repository";
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));
    const data = await getFollowData(userId);
    return NextResponse.json(data);
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
    await followUser(Number(body.followerId), Number(body.followingId));
    return NextResponse.json({ message: "Followed successfully." });
  } catch {
    return NextResponse.json({ message: "Follow failed." }, { status: 500 });
  }
}
export async function DELETE(request) {
  try {
    const body = await request.json();
    await unfollowUser(Number(body.followerId), Number(body.followingId));
    return NextResponse.json({ message: "Unfollowed successfully." });
  } catch {
    return NextResponse.json({ message: "Unfollow failed." }, { status: 500 });
  }
}
