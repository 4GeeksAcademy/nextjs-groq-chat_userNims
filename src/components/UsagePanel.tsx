"use client";

import { useChat } from "@/context/ChatContext";

const numberFormat = new Intl.NumberFormat("es-AR");

const Stat = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
  <div className="rounded-xl border border-stone-200 bg-white px-3 py-2.5">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">{label}</p>
    <p className="mt-0.5 text-xl font-bold tabular-nums text-stone-900">{value}</p>
    {hint ? <p className="text-[11px] text-stone-500">{hint}</p> : null}
  </div>
);

export const UsagePanel = () => {
  const { usage, lastMetrics, messages, clearConversation } = useChat();
  const replies = messages.filter((message) => message.role === "assistant").length;

  return (
    <aside
      aria-label="Consumo de tokens de la sesión"
      className="flex w-full flex-col gap-4 border-t border-stone-200 bg-stone-100/70 p-4 lg:w-80 lg:border-t-0 lg:border-l"
    >
      <div>
        <h2 className="text-sm font-semibold text-stone-900">Consumo de la sesión</h2>
        <p className="mt-1 text-xs text-stone-500">
          Acumulado de {replies} {replies === 1 ? "respuesta" : "respuestas"}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
        <Stat label="Tokens de prompt" value={numberFormat.format(usage.promptTokens)} hint="Enviados" />
        <Stat
          label="Tokens de completado"
          value={numberFormat.format(usage.completionTokens)}
          hint="Recibidos"
        />
        <Stat label="Total de tokens" value={numberFormat.format(usage.totalTokens)} hint="Prompt + completado" />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-stone-900">Última respuesta</h3>
        {lastMetrics ? (
          <dl className="mt-2 space-y-1.5 text-xs">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-stone-500">Modelo</dt>
              <dd className="text-right font-medium text-stone-900">{lastMetrics.model}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-stone-500">Tiempo de respuesta</dt>
              <dd className="font-medium tabular-nums text-stone-900">{lastMetrics.responseTimeMs} ms</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-stone-500">Tokens por segundo</dt>
              <dd className="font-medium tabular-nums text-stone-900">
                {lastMetrics.tokensPerSecond.toFixed(1)}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-2 text-xs text-stone-500">Aparece después de la primera respuesta.</p>
        )}
      </div>

      <button
        type="button"
        onClick={clearConversation}
        disabled={messages.length === 0}
        className="mt-auto rounded-xl border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Borrar conversación
      </button>
    </aside>
  );
};
