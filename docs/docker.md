# Errores posibles

**FALLO DE LA IMAGEN DOCKER:**
el error aparece porque la versión de Playwright del proyecto (`@playwright/test` 1.55.0) no coincide con la de la imagen Docker (`mcr.microsoft.com/playwright:v1.54.0-jammy`). Para evitarlo, el tag de la imagen tiene que ir siempre alineado con la dependencia de Playwright. El tag vive ahora en el bloque `container:` del job `Visual-Regression-Tests` en `.github/workflows/ci.yml` — mantenlo en sync con `@playwright/test` en `package.json` (Dependabot excluye ese paquete de sus PRs agrupados precisamente por esto).
También se puede parametrizar la versión con variables de entorno para facilitar actualizaciones futuras.

- No conviene desincronizar las versiones: **dejar imagen y librería desfasadas es pedir bugs el mes que viene.**

- **DECISIÓN TOMADA:** uso la versión de la imagen Docker como referencia y ajusto `package.json` para que coincida, porque las imágenes se actualizan menos a menudo que los paquetes (puede hacer falta bajar la versión en `package.json`). De vez en cuando actualizo la imagen y vuelvo a alinear `package.json`.

# Baselines visuales

**Las baselines son autoritativas desde CI.** No las regeneres en local si tu
máquina no es amd64 nativo.

El rasterizado de texto pequeño no coincide entre el amd64 nativo de los
runners de GitHub y el amd64 emulado de un Mac Apple Silicon. La diferencia es
de unos 250 px por captura, siempre en el mismo sitio (el header, los chips de
tag), y es indistinguible de una regresión real salvo que se afloje el umbral —
que es justo lo que llevaba años tapando cambios de contenido de verdad.

En CI eso no es un problema: el job corre dentro de la imagen oficial de
Playwright (`container:` en `ci.yml`) sobre un runner amd64 nativo, así que la
captura es siempre la misma. Lo que cambió en agosto de 2026 es que ya no se
construye una imagen propia para ello — ver la sección siguiente.

## Refrescar las baselines

1. Actions → CI → *Run workflow*, con `update_visual_snapshots` marcado.
2. Descargar el artefacto `playwright-updated-snapshots`.
3. Descomprimirlo sobre `tests/visual-regression/` y commitear el cambio.

## Correr los tests visuales en local

`pnpm run test:visual` ya no pasa por Docker: lanza Playwright directamente
contra un servidor tuyo en el puerto 4321.

```bash
pnpm build
PORT=4321 pnpm start     # en otra terminal:
pnpm test:visual
```

Sirve para ver *qué* ha cambiado: el reporte HTML y los `-diff.png` señalan la
zona. Lo que **no** vale es dar por buena una baseline generada aquí, y ahora
menos que antes: hasta agosto de 2026 el contenedor forzaba `linux/amd64`
emulado, y hoy corres el navegador de tu propia máquina. En un Mac Apple
Silicon eso significa diferencias de rasterizado mayores que los ~250 px de
antes. Es un empeoramiento aceptado a conciencia, porque una baseline local
nunca fue autoritativa: para refrescarlas, usa el workflow de arriba.

## Umbral

`playwright.visual.config.ts` usa `maxDiffPixels: 100`. Si empieza a dar falsos
positivos, la respuesta es estabilizar la captura (esperas de fuentes, imágenes,
animaciones), no subir el número.
