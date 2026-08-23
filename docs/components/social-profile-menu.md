# Social Profile Menu

> Generado por `pnpm docs:components` desde [`SocialProfileMenu.astro`](../../src/components/SocialProfileMenu.astro). No editar a mano.

El menú del avatar: nombre, correo y enlaces sociales dentro de un `DropdownMenu` de bejamas/ui.

El botón del avatar vive aquí y no en `Header.astro` porque el disparador y el contenido tienen que colgar de la misma raíz `data-slot="dropdown-menu"`.

## Importar

```astro
import SocialProfileMenu from "./SocialProfileMenu.astro";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `name` | `string` | sí |  |
| `email` | `string` | sí |  |
| `linkedinUrl` | `string` | sí |  |
| `xUrl` | `string` | sí |  |
| `lang` | `string` | sí |  |
| `avatarSrc` | `string` | sí |  |

## Uso

```astro
---
import SocialProfileMenu from "./SocialProfileMenu.astro";
---

<SocialProfileMenu
  name="Ricardo"
  email="hola@erades.com"
  linkedinUrl="https://linkedin.com/in/..."
  xUrl="https://x.com/..."
  avatarSrc={avatar.src}
  lang="es"
/>
```
