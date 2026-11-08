export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

export interface SessionUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface ResponseMetrics {
  model: string;
  responseTimeMs: number;
  tokensPerSecond: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export const EMPTY_USAGE: SessionUsage = {
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0,
};
