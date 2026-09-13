import type { MiddlewareHandler } from "astro";

const isApiRoute = (pathname: string): boolean => pathname.startsWith("/api/");
const isFeedOrDataRoute = (pathname: string): boolean =>
  pathname.includes(".json") ||
  pathname.includes(".xml") ||
  pathname === "/feed" ||
  pathname === "/rss" ||
  pathname === "/en/rss";
const isBlogRoute = (pathname: string): boolean =>
  pathname.startsWith("/blog/");
const isAssetRoute = (pathname: string): boolean =>
  pathname.startsWith("/assets/") ||
  // Imágenes redimensionadas por Astro al vuelo. La query lleva el hash del
  // original y los parámetros, así que el contenido de una URL no cambia nunca;
  // sin esto, cada visita volvía a pasar la imagen por sharp.
  pathname === "/_image" ||
  pathname.includes(".css") ||
  pathname.includes(".js");
const isFontRoute = (pathname: string): boolean =>
  pathname.startsWith("/fonts/");
const isImageFile = (pathname: string): boolean =>
  pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/) !== null;
// Políticas de caché con comentarios explicativos
const CACHE_POLICIES = {
  // Sin caché para APIs - siempre obtener datos frescos
  NO_CACHE: "no-cache, must-revalidate",
  // Caché corto para feeds y datos dinámicos - actualizar cada 5 minutos
  SHORT_CACHE: "max-age=300, must-revalidate",
  // Caché medio para contenido de blog - actualizar cada hora
  MEDIUM_CACHE: "max-age=3600, must-revalidate",
  // Caché largo para imágenes - actualizar cada 30 días
  IMAGE_CACHE: "max-age=2592000, must-revalidate",
  // Caché inmutable para assets estáticos - nunca cambiar, caché por 1 año
  IMMUTABLE_CACHE: "max-age=31536000, immutable",
  // Caché por defecto para páginas - actualizar cada 10 minutos
  DEFAULT_CACHE: "max-age=600, must-revalidate",
} as const;

const getCacheControl = (pathname: string): string => {
  // 1 año (IMMUTABLE_CACHE)
  if (isAssetRoute(pathname) || isFontRoute(pathname)) {
    return CACHE_POLICIES.IMMUTABLE_CACHE;
  }
  // 30 días (IMAGE_CACHE)
  if (isImageFile(pathname)) {
    return CACHE_POLICIES.IMAGE_CACHE;
  }
  // 1 hora (MEDIUM_CACHE)
  if (isBlogRoute(pathname)) {
    return CACHE_POLICIES.MEDIUM_CACHE;
  }
  // 5 minutos (SHORT_CACHE)
  if (isFeedOrDataRoute(pathname)) {
    return CACHE_POLICIES.SHORT_CACHE;
  }
  // Sin caché (NO_CACHE)
  if (isApiRoute(pathname)) {
    return CACHE_POLICIES.NO_CACHE;
  }
  // Por defecto, 10 minutos
  return CACHE_POLICIES.DEFAULT_CACHE;
};

export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next();

  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // Cabeceras de seguridad y caché (agnóstico del proveedor)
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  // Cache-Control específico por tipo de contenido
  response.headers.set("Cache-Control", getCacheControl(pathname));

  return response;
};
