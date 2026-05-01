import { NextResponse } from "next/server";
import { findUserByCredentials } from "../../../lib/repository";
export async function POST(request) {
  try {
    const body = await request.json();
    const user = await findUserByCredentials(body.email, body.password);
    if (!user)
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 400 },
      );
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ message: "Login failed." }, { status: 500 });
  }
}
