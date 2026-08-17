# Possible Errors

**DOCKER IMAGE FAILURE:**
The error occurs because the Playwright version in your project (@playwright/test 1.55.0) does not match the version of the Docker image you're using (mcr.microsoft.com/playwright:v1.54.0-jammy). To avoid these issues, you should always align the image version with your Playwright dependency. The recommended solution is to update the Docker image tag to match your dependency version, or vice versa, and rebuild the container.
It also explains how to parameterize the version with environment variables to facilitate future updates.

- Keeping versions out of sync is not recommended: **Keeping image and library out of sync is asking for bugs next month.**

- **DECISION MADE:** I will use the Docker file version as reference and modify my package.json to match because images are updated less frequently than packages (I may need to downgrade package.json), and occasionally update the Docker file version and match it with package.json

# Baselines visuales

**Las baselines son autoritativas desde CI.** No las regeneres en local si tu
máquina no es amd64 nativo.

El rasterizado de texto pequeño no coincide entre el amd64 nativo de los
runners de GitHub y el amd64 emulado de un Mac Apple Silicon. La diferencia es
de unos 250 px por captura, siempre en el mismo sitio (el header, los chips de
tag), y es indistinguible de una regresión real salvo que se afloje el umbral —
que es justo lo que llevaba años tapando cambios de contenido de verdad.

`docker-compose.yml` fija `platform: linux/amd64` para que al menos la
arquitectura sea la misma en todas partes.

## Refrescar las baselines

1. Actions → CI → *Run workflow*, con `update_visual_snapshots` marcado.
2. Descargar el artefacto `playwright-updated-snapshots`.
3. Descomprimirlo sobre `tests/visual-regression/` y commitear el cambio.

## Correr los tests visuales en local

`pnpm run test:visual` sigue sirviendo para ver *qué* ha cambiado (el reporte
HTML y los `-diff.png` señalan la zona). Lo que no vale es dar por buena una
baseline generada aquí: eso es lo que hace `pnpm run test:visual:update`, y solo
tiene sentido si estás en amd64 nativo.

## Umbral

`playwright.visual.config.ts` usa `maxDiffPixels: 100`. Si empieza a dar falsos
positivos, la respuesta es estabilizar la captura (esperas de fuentes, imágenes,
animaciones), no subir el número.
