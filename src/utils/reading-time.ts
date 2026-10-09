const WORDS_PER_MINUTE = 250;

// Minutos de lectura de un cuerpo markdown/MDX, mínimo 1. El marcado no se
// lee: sin quitarlo, un diagrama SVG cuenta como cientos de palabras.
export function readingTime(body: string): number {
  const text = body
    .replace(/<svg[\s\S]*?<\/svg>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .trim();
  if (!text) return 1;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
