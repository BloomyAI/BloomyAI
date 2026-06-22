// Backend integration for Bloomy AI
// This will connect to the Python backend

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  model: string;
  messages: ChatMessage[];
}

export interface Model {
  id: string;
  name: string;
  tier: string;
  description: string;
  source: string;
  capabilities: string[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function sendMessage(
  message: string,
  model: string,
  conversationId?: string
): Promise<ChatMessage> {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, model, conversationId }),
  });
  return response.json();
}

export async function getModels(): Promise<Model[]> {
  const response = await fetch(`${API_BASE}/api/models`);
  return response.json();
}

export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch(`${API_BASE}/api/conversations`);
  return response.json();
}

export async function createConversation(
  title: string,
  model: string
): Promise<Conversation> {
  const response = await fetch(`${API_BASE}/api/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, model }),
  });
  return response.json();
}

export async function getConversation(id: string): Promise<Conversation> {
  const response = await fetch(`${API_BASE}/api/conversations/${id}`);
  return response.json();
}

export async function deleteConversation(id: string): Promise<void> {
  await fetch(`${API_BASE}/api/conversations/${id}`, {
    method: "DELETE",
  });
}
