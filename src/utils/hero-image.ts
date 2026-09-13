import type { ImageMetadata } from "astro";

// Las portadas viven en src/assets/heroes y no en public/: Astro no procesa lo
// que hay en public/, así que una tarjeta de 400 px descargaba el JPG entero
// (hasta 1,5 MB). El frontmatter sigue diciendo `/nombre.jpg` —y así llega
// también desde search-index.json—, y aquí se resuelve al asset importado.
const HEROES = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/heroes/*.{jpg,jpeg,png,webp}",
  { eager: true }
);

// Acepta `undefined` porque las tarjetas evalúan el `src` aunque `ShowWhen`
// no llegue a pintar la imagen.
export function resolveHeroImage(
  src: string | undefined
): ImageMetadata | string | undefined {
  if (!src) return src;
  const name = src.split("/").pop() ?? "";
  return HEROES[`../assets/heroes/${name}`]?.default ?? src;
}
