"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clearSession, readSession, writeSession } from "@/lib/chatStorage";
import { GroqError, requestCompletion } from "@/lib/groq";
import {
  EMPTY_USAGE,
  type ChatMessage,
  type ResponseMetrics,
  type SessionUsage,
} from "@/types/chat";

interface ChatContextValue {
  messages: ChatMessage[];
  usage: SessionUsage;
  lastMetrics: ResponseMetrics | null;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearConversation: () => void;
  dismissError: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

const createId = (): string =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [usage, setUsage] = useState<SessionUsage>(EMPTY_USAGE);
  const [lastMetrics, setLastMetrics] = useState<ResponseMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Carga única al montar: la sesión guardada sobrevive a la recarga.
  // La hidratación va en una sola función porque la regla react-hooks/set-state-in-effect
  // de Next 16 marca las llamadas a setState sueltas dentro del efecto.
  useEffect(() => {
    const stored = readSession();
    const hydrateFromStorage = () => {
      setMessages(stored.messages);
      setUsage(stored.usage);
      setIsHydrated(true);
    };
    hydrateFromStorage();
  }, []);

  // Guarda después de cada cambio, nunca antes de hidratar.
  useEffect(() => {
    if (!isHydrated) return;
    writeSession({ messages, usage });
  }, [messages, usage, isHydrated]);

  const sendMessage = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || isLoading) return;

      const userMessage: ChatMessage = { id: createId(), role: "user", content };
      const history = [...messages, userMessage];

      setMessages(history);
      setError(null);
      setIsLoading(true);

      try {
        const { reply, usage: turnUsage, metrics } = await requestCompletion(history);

        setMessages([...history, { id: createId(), role: "assistant", content: reply }]);
        setUsage((current) => ({
          promptTokens: current.promptTokens + turnUsage.promptTokens,
          completionTokens: current.completionTokens + turnUsage.completionTokens,
          totalTokens: current.totalTokens + turnUsage.totalTokens,
        }));
        setLastMetrics(metrics);
      } catch (caught) {
        setError(
          caught instanceof GroqError
            ? caught.message
            : "Ocurrió un error inesperado al hablar con la API. Intentá de nuevo.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages],
  );

  const clearConversation = useCallback(() => {
    setMessages([]);
    setUsage(EMPTY_USAGE);
    setLastMetrics(null);
    setError(null);
    clearSession();
  }, []);

  const dismissError = useCallback(() => setError(null), []);

  const value = useMemo<ChatContextValue>(
    () => ({
      messages,
      usage,
      lastMetrics,
      isLoading,
      error,
      isHydrated,
      sendMessage,
      clearConversation,
      dismissError,
    }),
    [
      messages,
      usage,
      lastMetrics,
      isLoading,
      error,
      isHydrated,
      sendMessage,
      clearConversation,
      dismissError,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat debe usarse dentro de ChatProvider");
  }
  return context;
}
