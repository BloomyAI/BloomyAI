export type SSEEvent = { type: string; content?: string };

/** Parse SSE stream with proper line buffering across chunks */
export async function readSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onEvent: (event: SSEEvent) => void
): Promise<string> {
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;
      try {
        const data = JSON.parse(trimmed.slice(6)) as SSEEvent;
        if (data.type === "chunk" && data.content) {
          fullText += data.content;
          onEvent({ type: "chunk", content: fullText });
        } else if (data.type === "done") {
          onEvent({ type: "done", content: data.content ?? fullText });
        } else if (data.type === "error") {
          onEvent({ type: "error", content: data.content ?? "Unknown error" });
        }
      } catch {
        /* skip malformed line */
      }
    }
  }

  return fullText;
}
