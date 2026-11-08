import type { ChatMessage, ResponseMetrics, SessionUsage } from "@/types/chat";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

export const GROQ_MODEL = process.env.NEXT_PUBLIC_GROQ_MODEL ?? "qwen/qwen3.6-27b";

interface GroqPayload {
  model?: string;
  choices?: { message?: { content?: string } }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
  error?: { message?: string };
}

export interface CompletionResult {
  reply: string;
  usage: SessionUsage;
  metrics: ResponseMetrics;
}

/** Error con un mensaje ya redactado para mostrarle a la persona que usa la app. */
export class GroqError extends Error {}

const readableMessage = (status: number, apiMessage?: string): string => {
  if (status === 401 || status === 403) {
    return "Groq rechazó la credencial. Revisá que NEXT_PUBLIC_GROQ_API_KEY en tu .env sea la clave vigente de la consola.";
  }
  if (status === 404) {
    return "El modelo configurado no existe en tu cuenta de Groq. Revisá NEXT_PUBLIC_GROQ_MODEL contra la lista de modelos de la consola.";
  }
  if (status === 429) {
    return "Alcanzaste el límite de peticiones del plan gratuito. Esperá unos segundos y volvé a enviar el mensaje.";
  }
  if (status >= 500) {
    return "El servicio de Groq falló en este momento. Volvé a intentarlo en unos segundos.";
  }
  return `La API respondió con un error ${status}${apiMessage ? `: ${apiMessage}` : "."}`;
};

export async function requestCompletion(history: ChatMessage[]): Promise<CompletionResult> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

  if (!apiKey) {
    throw new GroqError(
      "Falta la API Key. Copiá .env.example a .env, pegá tu clave de Groq en NEXT_PUBLIC_GROQ_API_KEY y reiniciá el servidor.",
    );
  }

  const startedAt = performance.now();

  let response: Response;
  try {
    response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: history.map(({ role, content }) => ({ role, content })),
      }),
    });
  } catch {
    throw new GroqError("No se pudo conectar con la API de Groq. Revisá tu conexión e intentá de nuevo.");
  }

  const responseTimeMs = Math.round(performance.now() - startedAt);
  const data = (await response.json().catch(() => null)) as GroqPayload | null;

  if (!response.ok) {
    throw new GroqError(readableMessage(response.status, data?.error?.message));
  }

  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    throw new GroqError("La API respondió sin texto. Probá enviar el mensaje otra vez.");
  }

  const usage: SessionUsage = {
    promptTokens: data?.usage?.prompt_tokens ?? 0,
    completionTokens: data?.usage?.completion_tokens ?? 0,
    totalTokens: data?.usage?.total_tokens ?? 0,
  };

  const seconds = responseTimeMs / 1000;

  return {
    reply,
    usage,
    metrics: {
      model: data?.model ?? GROQ_MODEL,
      responseTimeMs,
      tokensPerSecond: seconds > 0 ? Math.round((usage.completionTokens / seconds) * 10) / 10 : 0,
      ...usage,
    },
  };
}
