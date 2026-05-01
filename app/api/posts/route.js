import { NextResponse } from "next/server";
import { getPostById, getUserPosts, getFeedPosts, createPost, deletePost, likePost } from "../../../lib/repository";
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));
    const postId = searchParams.get("postId");
    const mode = searchParams.get("mode");
    if (postId) {
      const post = await getPostById(Number(postId));
      return NextResponse.json({ post });
    }
    if (mode === "my-posts") {
      const posts = await getUserPosts(userId);
      return NextResponse.json({ posts });
    }
    const posts = await getFeedPosts(userId);
    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json(
      { message: "Failed to load posts." },
      { status: 500 },
    );
  }
}
export async function POST(request) {
  try {
    const body = await request.json();
    await createPost(body.content, Number(body.userId));
    return NextResponse.json({ message: "Post created successfully." });
  } catch {
    return NextResponse.json(
      { message: "Failed to create post." },
      { status: 500 },
    );
  }
}
export async function PUT(request) {
  try {
    const body = await request.json();
    if (body.action === "like") {
      await likePost(Number(body.postId), Number(body.userId));
    }
    return NextResponse.json({ message: "Updated successfully." });
  } catch {
    return NextResponse.json(
      { message: "Failed to update post." },
      { status: 500 },
    );
  }
}
export async function DELETE(request) {
  try {
    const body = await request.json();
    await deletePost(Number(body.postId));
    return NextResponse.json({ message: "Post deleted successfully." });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete post." },
      { status: 500 },
    );
  }
}
