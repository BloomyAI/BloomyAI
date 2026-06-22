import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const models = [
    {
      id: "mini",
      name: "Bloomy Mini",
      tier: "Mini",
      description: "Fast and efficient for quick responses",
      source: "",
      capabilities: ["Quick answers", "Summarization", "Basic QA"],
    },
    {
      id: "standard",
      name: "Bloomy Standard",
      tier: "Standard",
      description: "Balanced performance for general tasks",
      source: "",
      capabilities: ["Detailed answers", "Analysis", "Problem solving"],
    },
    {
      id: "pro",
      name: "Bloomy Pro",
      tier: "Pro",
      description: "High-performance for complex tasks",
      source: "",
      capabilities: ["Deep research", "Complex analysis", "Expert knowledge"],
    },
    {
      id: "code",
      name: "Bloomy Code",
      tier: "Code",
      description: "Specialized for software development",
      source: "",
      capabilities: ["Code generation", "Debugging", "Code review"],
    },
  ];

  return NextResponse.json(models);
}
