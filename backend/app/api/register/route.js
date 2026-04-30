import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.username || !body.email || !body.password)
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    const existing = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existing)
      return NextResponse.json(
        { message: "This email is already registered." },
        { status: 400 },
      );
    await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: body.password,
      },
    });
    return NextResponse.json({ message: "User created successfully." });
  } catch {
    return NextResponse.json({ message: "Register failed." }, { status: 500 });
  }
}
