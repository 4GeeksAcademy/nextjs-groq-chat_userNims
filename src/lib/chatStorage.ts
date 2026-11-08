import { EMPTY_USAGE, type ChatMessage, type SessionUsage } from "@/types/chat";

const STORAGE_KEY = "groq-chat-session";

export interface StoredSession {
  messages: ChatMessage[];
  usage: SessionUsage;
}

const isMessage = (value: unknown): value is ChatMessage => {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string"
  );
};

const toTokenCount = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

export function readSession(): StoredSession {
  const empty: StoredSession = { messages: [], usage: EMPTY_USAGE };

  if (typeof window === "undefined") return empty;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return empty;

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const messages = Array.isArray(parsed.messages) ? parsed.messages.filter(isMessage) : [];
    const usage =
      typeof parsed.usage === "object" && parsed.usage !== null
        ? (parsed.usage as Record<string, unknown>)
        : {};

    return {
      messages,
      usage: {
        promptTokens: toTokenCount(usage.promptTokens),
        completionTokens: toTokenCount(usage.completionTokens),
        totalTokens: toTokenCount(usage.totalTokens),
      },
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return empty;
  }
}

export function writeSession(session: StoredSession): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
