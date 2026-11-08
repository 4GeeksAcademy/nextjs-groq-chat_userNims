# Consola de chat con Groq

Prototipo de interfaz de chat que llama a la API de Groq con `fetch` y muestra el consumo de tokens de la sesión.

## Requisitos

- Node.js 20.9 o superior
- Una cuenta gratuita en [Groq](https://console.groq.com/) con una API Key

## Puesta en marcha

```bash
npm install
cp .env.example .env
# pegá tu clave en NEXT_PUBLIC_GROQ_API_KEY
node --env-file=.env scripts/check-groq.mjs
npm run dev
```

Abrí http://localhost:3000.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `NEXT_PUBLIC_GROQ_API_KEY` | Bearer token que se envía en la cabecera `Authorization` |
| `NEXT_PUBLIC_GROQ_MODEL` | Identificador del modelo, por defecto `qwen/qwen3.6-27b` |

El archivo `.env` está en `.gitignore`; `.env.example` sí se versiona.

## Estructura

```txt
src/
  app/                 layout, página y estilos globales
  components/          historial, composer, panel de consumo y vista
  context/             ChatProvider con el estado de la sesión
  lib/                 cliente de Groq y utilidades de localStorage
  types/               tipos compartidos
scripts/check-groq.mjs comprobación de la API Key por consola
```

## Notas

- La llamada se hace desde el navegador con `NEXT_PUBLIC_GROQ_API_KEY`, como pide la consigna del prototipo. Una clave `NEXT_PUBLIC_` queda visible en el bundle: para producción conviene mover la llamada a un route handler del servidor.
- El historial y los totales de tokens se guardan en `localStorage` bajo la clave `groq-chat-session`.
