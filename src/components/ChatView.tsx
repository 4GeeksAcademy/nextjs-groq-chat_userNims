"use client";

import { ChatComposer } from "@/components/ChatComposer";
import { MessageList } from "@/components/MessageList";
import { UsagePanel } from "@/components/UsagePanel";
import { useChat } from "@/context/ChatContext";
import { GROQ_MODEL } from "@/lib/groq";

export const ChatView = () => {
  const { messages, isLoading, error, isHydrated, sendMessage, dismissError } = useChat();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col">
      <header className="flex flex-col gap-1 border-b border-stone-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-stone-900">Consola de chat con Groq</h1>
          <p className="text-xs text-stone-500">
            Prototipo interno: cada respuesta muestra su consumo de tokens.
          </p>
        </div>
        <p className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
          Modelo: {GROQ_MODEL}
        </p>
      </header>

      {error ? (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:px-6"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={dismissError}
            className="shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold text-red-700 hover:bg-red-100"
          >
            Cerrar
          </button>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col lg:flex-row">
        <main className="flex min-h-0 flex-1 flex-col bg-stone-50">
          {isHydrated ? (
            <>
              <MessageList messages={messages} isLoading={isLoading} />
              <ChatComposer isLoading={isLoading} onSend={sendMessage} />
            </>
          ) : (
            <p className="m-auto text-sm text-stone-500">Cargando la conversación guardada…</p>
          )}
        </main>

        <UsagePanel />
      </div>
    </div>
  );
};
