/**
 * Minimal Gemini API caller (REST, no SDK) for the public chat widget.
 * Returns null (never throws) when GEMINI_API_KEY is unset or the call
 * fails, so callers can fall back to a canned reply.
 *
 * The key is read from the environment only (set it in Vercel project
 * env vars) and is only ever sent to Google in the x-goog-api-key header.
 */
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

/** "gemini-flash-latest" is Google's rolling alias for the current Flash model; override with GEMINI_MODEL. */
export const DEFAULT_GEMINI_MODEL = "gemini-flash-latest";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface GeminiFunctionDeclaration {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface GeminiResult {
  text: string;
  functionCall: { name: string; args: Record<string, unknown> } | null;
}

interface GeminiPart {
  text?: string;
  thought?: boolean;
  functionCall?: { name?: string; args?: Record<string, unknown> };
}

export async function callGemini(options: {
  system: string;
  messages: ChatTurn[];
  functions?: GeminiFunctionDeclaration[];
  maxOutputTokens?: number;
}): Promise<GeminiResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set — chat widget is using its fallback reply.");
    return null;
  }
  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;

  // Gemini requires the conversation to start with a user turn, so drop any
  // leading assistant greeting the widget shows client-side.
  const firstUser = options.messages.findIndex((m) => m.role === "user");
  const turns = firstUser === -1 ? [] : options.messages.slice(firstUser);
  if (turns.length === 0) return null;

  const body = {
    systemInstruction: { parts: [{ text: options.system }] },
    contents: turns.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    ...(options.functions?.length ? { tools: [{ functionDeclarations: options.functions }] } : {}),
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: options.maxOutputTokens ?? 1024,
    },
  };

  try {
    const res = await fetch(`${GEMINI_API_BASE}/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(25_000),
    });
    if (!res.ok) {
      console.error(`Gemini API responded ${res.status}: ${(await res.text().catch(() => "")).slice(0, 500)}`);
      return null;
    }
    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: GeminiPart[] } }>;
    };
    const parts = data.candidates?.[0]?.content?.parts ?? [];
    const text = parts
      .filter((p) => typeof p.text === "string" && !p.thought)
      .map((p) => p.text)
      .join("")
      .trim();
    const call = parts.find((p) => p.functionCall?.name)?.functionCall;
    return {
      text,
      functionCall: call?.name ? { name: call.name, args: call.args ?? {} } : null,
    };
  } catch (err) {
    console.error("Gemini API call failed:", (err as Error).message);
    return null;
  }
}
