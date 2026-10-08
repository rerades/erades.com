---
name: linkedin-post
description: Redactar y publicar en LinkedIn los posts (es + en) de un artículo de erades.com — uno inmediato y otro diferido vía cola + launchd. Úsala cuando el usuario quiera anunciar un artículo en LinkedIn, publicar o programar un post, corregir uno publicado o saber si un post diferido salió. Es el último paso opcional de `nuevo-articulo`.
---

# Post de LinkedIn de un artículo

Relevo de Hermes (`~/.hermes/skills/social-media/linkedin-post-from-blog`). La
infraestructura vive en el Mac del usuario, no en el repo:

| Pieza | Dónde |
| --- | --- |
| MCP `linkedin_api` (`whoami`, `create_post`, `delete_post`), compartido con Hermes | `~/.hermes/linkedin-api/server.mjs` |
| Token OAuth (60 días) | `~/.hermes/linkedin-api/token.json` — **no leerlo** |
| Cola de diferidos | `~/.claude/linkedin/pending/<slug>-<lang>.json` |
| Publicador (cada hora, sin modelo) | `~/.claude/linkedin/publish-due.mjs` + LaunchAgent `com.erades.linkedin-publish` |
| Log | `~/.claude/linkedin/publish.log` |
| Negrita Unicode (`**…**` → 𝗻𝗲𝗴𝗿𝗶𝘁𝗮) | `~/.claude/linkedin/bold.mjs` |

No hay herramienta de comentarios, de edición ni de programación nativa.

## Regla dura

**Nunca publicar sin un «sí» explícito al texto exacto.** Sin respuesta no se
publica (el silencio no es consentimiento). Se publica **byte a byte** lo
enseñado: ni hashtags, ni emojis, ni CTA añadidos después. Para desviarse, no
publicar y preguntar en una línea.

**Todo post lleva imagen**, también los diferidos y los que no anuncian un
artículo. Si no hay portada que usar, preguntar qué imagen poner (o proponer
generarla con `pnpm hero`) antes de pedir el «sí». Nunca publicar solo texto.

## 1. Antes de redactar

- `whoami`: si el token ha caducado o caduca antes del diferido, avisar ya
  (ver **Token**).
- El artículo debe estar servido en producción (después del merge y del deploy
  de Render): `curl -sI https://erades.com/<lang>/blog/<ruta>/` → 200.
- Preguntar **qué idioma sale ya y cuándo sale el otro** (día y hora). El orden
  cambia según el artículo: no suponerlo.
- `ls ~/.claude/linkedin/pending/` y revisar que no haya otro post pendiente
  para la misma mañana; si lo hay, escalonar.

## 2. Redactar un post por idioma

Leer **los dos** `.mdx`: no son traducción literal y cada post cita el suyo.

Estilo de la casa (los dos posts reales están abajo):

1. Gancho: qué se publicó y que lo has destilado.
2. Un párrafo con la tesis.
3. `Five/Four things I take away:` / `Cinco/Cuatro cosas que me llevo:`,
   numeradas, cada una con una frase de cabecera y luego el desarrollo.
4. Una línea de cierre que remata la tesis.
5. Una línea que apunta al blog y la **URL en su propia línea, dentro del
   cuerpo**. El diferido sale sin supervisión y nadie puede poner el enlace en
   un comentario; en el inmediato se puede ofrecer la variante «enlace en el
   primer comentario», que tiene que pegar el usuario a mano.
6. Entre 3 y 5 hashtags, los mismos en los dos idiomas.

**Formato**: LinkedIn no tiene formato real y Markdown sale literal. Lo que sí
funciona:

- **Ritmo con saltos de línea**: párrafos cortos, una línea en blanco entre
  bloques. El gancho tiene que caber en las 2-3 líneas que se ven antes del
  «…ver más».
- **Negrita Unicode solo en las cabeceras numeradas**. Se escribe `**…**` en el
  borrador y se convierte con
  `node ~/.claude/linkedin/bold.mjs < borrador.txt > post.txt`.
  - Las letras con tilde o eñe no tienen versión en negrita y quedan mezcladas:
    en español, elegir una cabecera sin tildes si se puede, o aceptar la mezcla.
  - Los lectores de pantalla y el buscador de LinkedIn no la leen como texto
    normal: nada de negrita en frases enteras ni en el gancho.
- Lo que se enseña para el «sí» es el texto **ya convertido**, y eso es lo que
  se publica.

Máximo 3000 caracteres, contados como `text.length` en JS (que es lo que
valida el servidor). Cada letra en negrita cuenta como 2, así que `wc -m` se
queda corto.

**Imagen** (obligatoria, ver **Regla dura**): por defecto, la portada del artículo (`heroImage` →
`src/assets/heroes/hero-<slug>.webp`). Se convierte una vez a JPEG en
`~/.claude/linkedin/images/<slug>.jpg`
(`sips -s format jpeg -s formatOptions 90 <webp> --out <jpg>`), porque la API
solo admite JPG, PNG y GIF. Ese mismo fichero lo usan los dos idiomas y vive
fuera del repo, así que el diferido no depende de la rama que haya en el
checkout. Hay que escribir un `image_alt` por idioma, de menos de 120
caracteres. Un post con imagen **no lleva tarjeta de enlace**: la URL sigue
siendo texto en el cuerpo.

<details><summary>Ejemplo real (EN, artículo ai-native-sdlc)</summary>

```
Anthropic just published its AI-native SDLC playbook. I read it end to end and distilled it: what changes at each stage of the lifecycle once agents write most of the code.

The idea holding it together: code is no longer the bottleneck. With AI, build collapses from weeks to hours — and the constraint moves to everything on either side of it: planning, review/testing and deploying.

Five things I take away:

1. From a line to a loop. The six stages form a loop (...) People no longer start the work — they triage and review it.

2. Guardrails run as code, not as habits. CLAUDE.md gives context, a skill advises, a hook guarantees. (...)

(...)

The playbook isn't about writing code faster — that already happened. It's about turning the process into a loop and the gates into code.

I distilled it stage by stage, diagrams included, on the blog:
https://erades.com/en/blog/ai-take-aways/ai-native-sdlc/

#AICoding #SDLC #ClaudeCode #SoftwareEngineering
```
</details>

## 3. Confirmación

Enseñar los **dos** posts completos en bloques de código, la imagen (leer el
JPEG para que se vea) y los dos `image_alt`, y decir cuál sale ya y cuándo sale
el otro. Esperar el «sí».

## 4. Inmediato

`create_post(text, visibility="PUBLIC", image_path, image_alt)` → informar del
`post_urn` y la `url`. Solo el resultado de la herramienta demuestra que el
post existe. La subida de la imagen (initializeUpload → PUT → esperar a
`AVAILABLE`) va dentro de `create_post` y tarda unos segundos.

Si el MCP se registró a mitad de sesión, sus herramientas no aparecen hasta la
siguiente. Se llama al mismo servidor por stdio, construyendo el JSON con
`node` a partir del fichero del texto aprobado, para no escapar nada a mano:
`… | node ~/.hermes/linkedin-api/server.mjs mcp`.

Correcciones (incluida añadir la imagen a un post ya publicado):
1. Publicar primero el post corregido con `create_post`.
2. Cuando haya salido bien, `delete_post` del antiguo. Así un fallo de subida
   no deja el post sin publicar.
3. Decir qué URN se ha borrado y cuál es la nueva.

Aplicar solo la corrección que se ha pedido. Se pierden las reacciones que
tuviera el post antiguo.

## 5. Diferido

Escribir el texto aprobado tal cual en
`~/.claude/linkedin/pending/<slug>-<lang>.json` con la herramienta Write, para
no tener que escapar el texto a mano en la shell:

```json
{
  "post": "<slug>-<lang>",
  "publish_after": "2026-10-13T10:00:00+02:00",
  "text": "<texto aprobado>",
  "image": "/Users/<usuario>/.claude/linkedin/images/<slug>.jpg",
  "image_alt": "<alt aprobado>",
  "published": false,
  "post_urn": null,
  "attempts": 0,
  "error": null
}
```

- La hora va con el offset de Madrid (`+02:00` en verano, `+01:00` en invierno).
- El publicador revisa la cola cada hora: el post sale en la primera pasada
  después de `publish_after`, como mucho una hora más tarde. Si el Mac está
  dormido, sale al despertar. Si falla, lo reintenta hasta 3 veces.
- Comprobar y enseñar al usuario:
  - `node ~/.claude/linkedin/publish-due.mjs --dry-run` no lo lista todavía.
    Con una fecha pasada sí lo listaría, pero **nunca** probarlo así con un
    JSON real.
  - `launchctl print gui/$(id -u)/com.erades.linkedin-publish | grep -E 'state|interval'`
    → el agente está cargado. Si no lo está:
    `launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.erades.linkedin-publish.plist`.
- El aviso llega como notificación de macOS con la URL, o con el error.

## 6. «¿Salió?»

No contestar de memoria. Leer el JSON de la cola (`published`, `url`,
`attempts`, `error`) y `tail ~/.claude/linkedin/publish.log`. Si se agotaron
los 3 intentos, enseñar el error y preguntar antes de poner `attempts: 0`.

## Token

Caduca a los 60 días; `whoami` da la fecha. Para renovarlo, el usuario lo
ejecuta en su Mac (`!` en el prompt), con las credenciales de la app de
LinkedIn:

```
LINKEDIN_CLIENT_ID=... LINKEDIN_CLIENT_SECRET=... node ~/.hermes/linkedin-api/server.mjs auth
```

El puerto de redirección es el 4321: hay que parar antes el servidor del blog.
Errores: 401 → token revocado (volver a ejecutar `auth`). 426 → versión de la
API retirada: subir `LINKEDIN_API_VERSION`.
