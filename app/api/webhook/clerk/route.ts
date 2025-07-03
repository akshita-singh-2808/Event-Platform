import { Webhook } from "svix";
import { NextResponse } from "next/server";
import type { WebhookEvent } from "@clerk/nextjs/server"; // 👈 Clerk types

export async function POST(req: Request) {
  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);

  const wh = new Webhook(process.env.SIGNING_SECRET!);

  let evt: WebhookEvent; // 👈 FIX: Type it properly
  try {
    evt = wh.verify(payload, headers) as WebhookEvent; // 👈 FIX: type assertion
  } catch (err) {
    return new NextResponse("Webhook verification failed", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    console.log("✅ New Clerk user created:", evt.data.id);
    // Handle DB logic here (e.g. insert user into MongoDB)
  }

  return new NextResponse("Webhook handled", { status: 200 });
}
