---
name: nuevo-articulo
description: Flujo completo para escribir y publicar un artículo del blog de erades.com en español e inglés — rutas, frontmatter, diagramas SVG, bibliografía, portada, verificación y PR. Úsala siempre que el usuario quiera publicar, escribir, resumir o traducir un post o artículo del blog (pega un texto, pasa un enlace para resumir o propone un tema). Es un documento vivo: el último paso de cada artículo es actualizarla con lo aprendido.
---

# Nuevo artículo (es + en)

Estas instrucciones salen de los artículos ya publicados (ver **Registro**) y se
reescriben con cada uno. Si algo de aquí contradice al repo, manda el repo:
corrígelo aquí en el mismo PR.

## 1. Entrada

Tres modos, cada uno con su tratamiento:

- **Texto propio del usuario** (#188): respetar su redacción. Solo formatear,
  poner negritas en las ideas clave, buscar y enlazar la fuente que menciona y
  añadir iconos/diagramas donde aporten.
- **Resumen de un artículo externo** (#219): sintetizar al máximo. Lo que
  interesa son los **conceptos y las acciones a tomar**; ilustrar lo máximo
  posible. Estructura que funcionó: la idea en una frase → por sección,
  bullets de **Concepto** y **Acciones** → cómo saber si funciona → por dónde
  empezar → opinión propia al cierre.
- **Resumen ya hecho por el usuario** (p. ej. de una transcripción) (#226):
  reordenarlo alrededor de una tesis en vez de seguir el orden de la fuente, y
  **proponer índice y diagramas antes de escribir**. Sale más corto de lo que
  parece: el usuario quitó todo lo periférico (cifras de tracción, «el resto
  de la conversación», secciones que no se entienden sin la fuente). Ante la
  duda, fuera.
- **Tema libre**: proponer índice antes de escribir.

Primera persona solo en la sección de opinión del cierre. Empezar directamente
por `## La idea en una frase` + cita, sin párrafo de introducción antes: el
enlace a la fuente va en el párrafo que sigue a la cita.

Pregunta solo lo que no se pueda decidir: carpeta y slug se eligen solos si son
obvios. El artículo va siempre en los dos idiomas salvo que el usuario diga otra
cosa.

## 2. Rutas y emparejado

- `src/content/blog/{es,en}/<carpeta>/<slug>.mdx`. La ruta **es** la URL.
- Cada idioma nombra su propia ruta, carpeta incluida:

  | es | en |
  | --- | --- |
  | `ia/` | `ai-take-aways/` |
  | `funcional/` | `functional/` |
  | `patrones/` | `patterns/` |
  | `experimentos/` | `experiments/` |
  | `wpo/` | — |

- Slugs traducidos, en minúsculas, sin tildes, eñes ni puntos (lo comprueba
  `src/content/translation-pairs.test.ts`).
- Mismo `translationKey` en los dos ficheros, con la forma
  `<carpeta-en>/<slug-en>` (p. ej. `ai-take-aways/ai-native-sdlc`). Sin él, el
  selector de idioma y el `hreflang` no encuentran la pareja.

## 3. Frontmatter

Schema en `src/content.config.ts` (fuente de verdad). Plantilla:

```yaml
---
title: "…"
description: "…"            # una frase; la usa también el prompt de la portada
pubDate: YYYY-MM-DD         # hoy
heroImage: /hero-<slug-es>.webp   # lo escribe `pnpm hero`, no a mano
tags:
  - …
categories:
  - …
translationKey: "<carpeta-en>/<slug-en>"
draft: true                 # hasta que esté todo; ver §9
---
```

- **Reutilizar** tags y categorías existentes antes de inventar nuevos
  (`grep -rh -A6 "^tags:" src/content/blog | sort | uniq -c | sort -rn`).
  Posts de IA: tags `ai-coding`, `artificial-intelligence`, `best-practices`…;
  categorías `AI`, `Crafting`.
- Las categorías se escriben igual en los dos idiomas.

## 4. Formato

Modelo a copiar: `src/content/blog/es/ia/sdlc-nativo-ia.mdx`.

- `##` por sección, negritas en las ideas clave, `>` para la frase fuerte.
- Enlace a la fuente original en el primer párrafo de texto (tras la cita inicial).
- `.prose` no hace nada (no hay plugin de tipografía): cada elemento markdown
  se estiliza a mano en `src/styles/global.css`. Si uno sale sin estilo
  (pasó con `blockquote`, #226), se arregla allí, no en el post.
- **Iconos**: `@lucide/astro`, importados al principio del MDX
  (`import { Lightbulb, Rocket } from "@lucide/astro";`) y puestos delante del
  título de sección.
- **Diagramas**: SVG inline (en los posts no se renderiza mermaid):
  - `<figure class="not-prose my-8">` + `<svg viewBox="…" role="img" aria-labelledby="<id>-title" class="w-full h-auto text-current">`
    con `<title id="<id>-title">` descriptivo.
  - Colores con `currentColor` para que funcionen en claro y oscuro.
  - Ids únicos por post (prefijo corto por figura).
  - Texto de los SVG legible en móvil: revisarlo a 375 px.
  - Llaves en el texto de un SVG (`switch (x) { … }`) rompen el build: MDX las
    lee como expresión JSX. Escribirlas como `&#123;` y `&#125;`.
  - Nada de gráficas «cualitativas» sin datos detrás: el usuario las quita.

## 5. Bibliografía

Obligatoria en los dos idiomas **desde el primer commit**, al final del post,
con el formato exacto de `src/content/blog/en/functional/combinators.mdx`:

```html
<div class="bibliography">
Bibliography:

<ul>
<li><a href="https://url-completa">Título de la obra</a>. Autor o fuente</li>
<li>Título de un libro. Ed: EDITORIAL. Author: Nombre Autor.</li>
</ul>
</div>
```

- Etiqueta `Bibliography:` / `Bibliografía:` en texto plano. Nada de `##`,
  `**Fuentes**`, `<br />` ni listas `-`.
- Sin enlace (libro, curso ya retirado): `<li>Título. Autor</li>`.
- Solo fuentes que el post cita o de las que sale su texto. **Nada inventado.**
- Cada enlace comprobado: responde 200 y trata del tema. Medium y Stack
  Overflow bloquean curl → Chrome o `api.stackexchange.com`. Enlace muerto →
  copia en web.archive.org indicándolo ("Internet Archive copy" / "copia en
  Internet Archive"); sin copia, entrada sin enlace.

## 6. Traducción

- La hace Claude directamente (o `pnpm translate:es-en`, que empareja por
  `translationKey`).
- Traducir también el `<title>` y los textos de cada SVG, y la etiqueta de la
  bibliografía. Imports y estructura de los SVG, idénticos.

## 7. Portada

- `pnpm hero src/content/blog/es/<carpeta>/<slug>.mdx "extra"` (necesita
  `OPENROUTER_API_KEY` en `.env`). Genera
  `src/assets/heroes/hero-<slug>.webp` y escribe `heroImage` en los dos
  idiomas.
- El "extra" se saca del contenido: metáfora visual concreta del post. El
  script ya añade "sin texto ni logos".
- Después: abrir la imagen y enseñársela al usuario, y comprobar con `grep`
  que `heroImage` está en **los dos** `.mdx`.

## 8. Verificación

1. `pnpm lint && pnpm typecheck && pnpm test:unit`.
2. `pnpm build` **después** de tener portada y `draft` definitivo: regenera
   `public/search-index.json`, que se commitea en el PR. Si se commitea antes,
   el índice queda sin portada.
3. Servidor de producción en una pestaña de Supacode (ver memoria
   `arrancar-servidor-en-pestana-supacode`), nunca en background. Cada
   cambio que el usuario pide al revisar exige rebuild + reinicio; guardar el
   PID en `<scratchpad>/server.ref` y encadenar `kill $PID; pnpm build &&
   supacode tab new …` en una sola llamada.
4. Revisar las dos URLs en claro, oscuro y móvil; la tarjeta en el listado; y
   que el selector ES/EN salta a la traducción, no a un 404.

## 9. PR y merge

- Rama `content/<slug-es>`; PR **draft** desde el primer commit; push por
  commit. Título: `content: post "<título es>" (es/en)`.
- Un draft (`draft: true`) no se sirve: para revisarlo en local, cambiarlo a
  `false` sin commitear y avisar.
- **Visual-Regression fallará** siempre que el post cambie el listado (home,
  blog, tags, tarjeta, paginador, menú móvil). Proceso:
  1. Lanzar CI con `update_visual_snapshots=true` sobre la rama.
  2. Descargar `playwright-updated-snapshots` y copiar **todas** las capturas
     que difieren de su test, no solo las que salieron en rojo: los tests con
     varias capturas (`blog-card`, `blog-card-hover`, `blog-card-focus`) se
     paran en la primera que falla.
  3. Comprobar que solo cambian listados (un cambio de **dimensiones** fuera
     de ahí es un desplazamiento de layout, no el post).
- CI toda verde ⇒ `gh pr ready` + `gh pr merge --squash --delete-branch` sin
  preguntar (memoria `pr-draft-workflow`).
- Lighthouse solo si el usuario lo pide, y tras confirmar que Render ya sirve
  el commit.

## 10. Paso final obligatorio: mejorar esta skill

Antes del merge, en el **mismo PR** del artículo:

1. Añadir una fila al **Registro**.
2. Cada corrección del usuario, tropiezo o paso repetido se convierte en
   **regla en la sección donde toca** (no solo en una nota). Si algo se hizo a
   mano dos veces, proponer script.
3. Borrar o reescribir las reglas que ya no apliquen (script cambiado, carpeta
   nueva, formato nuevo). Esta skill debe describir el repo actual, no su
   historia.
4. Decirle al usuario en una línea qué ha cambiado aquí.

## Registro

| Fecha | Post (es) | PR | Entrada | Qué se corrigió después |
| --- | --- | --- | --- | --- |
| 2026-09-13 | `ia/el-asteroide-del-frontend` | #188 | Texto propio | `pnpm hero` no encontraba la traducción (buscaba por nombre y no por `translationKey`); baselines en dos pasadas (faltaron `blog-card-hover`/`-focus`); portadas en `public/` sin optimizar (#190). |
| 2026-09-23 | `ia/sdlc-nativo-ia` | #219 | Resumen de enlace | Índice de búsqueda commiteado sin portada; bibliografía olvidada (#221) y en formato equivocado, unificada en #223. |
| 2026-09-26 | `ia/jev-modelo-para-codigo` | #226 | Resumen del usuario (transcripción) | Sin párrafo de intro; recortadas tres secciones periféricas y un diagrama sin datos; `blockquote` sin estilo en todo el blog (arreglado en `global.css`); llaves en SVG rompían el build. |
