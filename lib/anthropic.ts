/**
 * Shared low-level Anthropic Messages API caller (no SDK). Returns null
 * (never throws) when ANTHROPIC_API_KEY is unset or the call fails — every
 * caller must handle that gracefully.
 */
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
export const DEFAULT_CHAT_MODEL = "claude-haiku-5-5";

export interface AnthropicMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AnthropicTool {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

export interface AnthropicResponse {
  content: Array<{ type: string; text?: string; name?: string; input?: Record<string, unknown> }>;
}

export async function callAnthropic(options: {
  system: string;
  messages: AnthropicMessage[];
  tools?: AnthropicTool[];
  maxTokens?: number;
  /** Per-call override — falls back to ANTHROPIC_CHAT_MODEL, then DEFAULT_CHAT_MODEL. Lets one caller (e.g. the sales chat widget) use a different model without changing every other agent's default. */
  model?: string;
}): Promise<AnthropicResponse | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  const model = options.model || process.env.ANTHROPIC_CHAT_MODEL || DEFAULT_CHAT_MODEL;
  try {
    const res = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: options.maxTokens ?? 1024,
        system: options.system,
        messages: options.messages,
        ...(options.tools ? { tools: options.tools } : {}),
      }),
    });
    if (!res.ok) {
      console.error(`Anthropic API responded ${res.status}: ${await res.text().catch(() => "")}`);
      return null;
    }
    return (await res.json()) as AnthropicResponse;
  } catch (err) {
    console.error("Anthropic API call failed:", (err as Error).message);
    return null;
  }
}

export function extractText(content: AnthropicResponse["content"]): string {
  return content
    .filter((block) => block.type === "text")
    .map((block) => block.text || "")
    .join("\n")
    .trim();
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
