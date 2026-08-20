import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Helper que esperan los componentes de bejamas/ui en `@/lib/utils`. */
export function cn(...inputs: readonly ClassValue[]): string {
  return twMerge(clsx(inputs));
}
