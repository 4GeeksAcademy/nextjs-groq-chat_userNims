"use client";

import { useState } from "react";

interface ChatComposerProps {
  isLoading: boolean;
  onSend: (text: string) => void;
}

export const ChatComposer = ({ isLoading, onSend }: ChatComposerProps) => {
  const [draft, setDraft] = useState("");

  const canSend = draft.trim() !== "" && !isLoading;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSend) return;
    onSend(draft);
    setDraft("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border-t border-stone-200 bg-white px-4 py-3 sm:px-6"
    >
      <label htmlFor="chat-input" className="sr-only">
        Mensaje para el asistente
      </label>
      <textarea
        id="chat-input"
        rows={1}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (canSend) {
              onSend(draft);
              setDraft("");
            }
          }
        }}
        placeholder="Escribí tu mensaje…"
        className="max-h-40 min-h-11 flex-1 resize-y rounded-xl border border-stone-300 px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-200"
      />
      <button
        type="submit"
        disabled={!canSend}
        className="h-11 rounded-xl bg-stone-900 px-5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isLoading ? "Esperando…" : "Enviar"}
      </button>
    </form>
  );
};
