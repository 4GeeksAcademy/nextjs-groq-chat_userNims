import type { ChatMessage } from "@/types/chat";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export const MessageList = ({ messages, isLoading }: MessageListProps) => (
  <div
    role="log"
    aria-live="polite"
    aria-label="Historial de la conversación"
    className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5 sm:px-6"
  >
    {messages.length === 0 && !isLoading ? (
      <p className="m-auto max-w-sm text-center text-sm text-stone-500">
        Todavía no hay mensajes. Escribí tu primera pregunta para ver el consumo de tokens de la sesión.
      </p>
    ) : null}

    {messages.map((message) => (
      <article
        key={message.id}
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          message.role === "user"
            ? "self-end rounded-br-sm bg-stone-900 text-white"
            : "self-start rounded-bl-sm border border-stone-200 bg-white text-stone-800"
        }`}
      >
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide opacity-60">
          {message.role === "user" ? "Vos" : "Asistente"}
        </p>
        {message.content}
      </article>
    ))}

    {isLoading ? (
      <div className="max-w-[85%] self-start rounded-2xl rounded-bl-sm border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-500">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide opacity-60">Asistente</p>
        Pensando…
      </div>
    ) : null}
  </div>
);
