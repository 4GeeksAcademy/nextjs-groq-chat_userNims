// Comprueba que la API Key y el modelo funcionan antes de tocar la interfaz.
// Uso: node --env-file=.env scripts/check-groq.mjs

const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
const model = process.env.NEXT_PUBLIC_GROQ_MODEL ?? "qwen/qwen3.6-27b";

if (!apiKey) {
  console.error("Falta NEXT_PUBLIC_GROQ_API_KEY en el archivo .env");
  process.exit(1);
}

const startedAt = Date.now();

const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model,
    messages: [{ role: "user", content: "Respondé solo con la palabra: listo" }],
  }),
});

const data = await response.json().catch(() => null);

if (!response.ok) {
  console.error(`La API respondió ${response.status}: ${data?.error?.message ?? "sin detalle"}`);
  process.exit(1);
}

console.log("Modelo devuelto:", data.model);
console.log("Respuesta:", data.choices?.[0]?.message?.content);
console.log("usage:", data.usage);
console.log("Tiempo total:", Date.now() - startedAt, "ms");
