import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // TODO: Get user's conversations from database
  const conversations = [
    {
      id: "conv-1",
      title: "New Conversation",
      createdAt: new Date().toISOString(),
      model: "standard",
    },
  ];

  return NextResponse.json(conversations);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, model } = body;

    // TODO: Create new conversation in database
    const conversation = {
      id: `conv-${Date.now()}`,
      title: title || "New Conversation",
      createdAt: new Date().toISOString(),
      model: model || "standard",
    };

    return NextResponse.json(conversation);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
  }
}
