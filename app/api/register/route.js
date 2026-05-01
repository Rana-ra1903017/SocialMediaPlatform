import { NextResponse } from "next/server";
import { findUserByEmail, createUser } from "../../../lib/repository";
export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.username || !body.email || !body.password)
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    const existing = await findUserByEmail(body.email);
    if (existing)
      return NextResponse.json(
        { message: "This email is already registered." },
        { status: 400 },
      );
    await createUser(body.username, body.email, body.password);
    return NextResponse.json({ message: "User created successfully." });
  } catch {
    return NextResponse.json({ message: "Register failed." }, { status: 500 });
  }
}
