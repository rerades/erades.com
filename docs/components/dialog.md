# Dialog

> Generado por `pnpm docs:components` desde [`Dialog.astro`](../../src/components/ui/dialog/Dialog.astro). No editar a mano.

An accessible modal window for focused content or user actions with customizable open/close behavior.

[Figma](https://www.figma.com/design/koxai7zw5vIuBzuVxe5T2l/bejamas-ui?node-id=2543-9384&t=YFStJ3V8fXEO8QD8-4)

## Importar

> Del registry de bejamas/ui. Descartados Trigger, Description y Footer:
> el disparador va con `data-slot` sobre el propio &lt;button> (así el runtime
> pone ahí aria-expanded), y los otros dos no se usan.

```astro
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from "./ui/dialog";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

Extiende `HTMLAttributes<"div">`.

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` | — |  |
| `class` | `string` | — |  |
| `closeOnClickOutside` | `boolean` | — |  |
| `closeOnEscape` | `boolean` | — |  |
| `lockScroll` | `boolean` | — |  |

## Slots

- `default`

Detectados en el markup; los slots con nombre se comprueban con `Astro.slots.has()`.

> **Ojo:** los ejemplos de abajo vienen del registry y usan `DialogDescription`, `DialogFooter`, `DialogTrigger`, que esta copia no exporta (el motivo, arriba). Adáptalos.

## Preview

```astro
<Dialog>
  <DialogTrigger asChild>
    <Button>Manage Cookies</Button>
  </DialogTrigger>

  <DialogContent class="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>Manage Cookies</DialogTitle>
      <DialogDescription>
        Using websites and apps involves storing and retrieving information from your device, including cookies and other identifiers.
      </DialogDescription>
    </DialogHeader>
    <div class="mt-3">
      <div class="flex items-center gap-3">
        <Checkbox id="cookies-necessary" name="cookies-necessary" disabled checked />
        <Label for="cookies-necessary">Strictly Necessary Cookies (always active)</Label>
      </div>
      <p class="text-sm text-muted-foreground ml-8 mt-1">These cookies are essential for the site to function and cannot be toggled off. They assist with security, user authentication, customer support, etc.</p>
    </div>
    <div class="mt-3">
      <div class="flex items-center gap-3">
        <Checkbox id="cookies-analytics" name="cookies-analytics" />
        <Label for="cookies-analytics">Analytics Cookies</Label>
      </div>
      <p class="text-sm text-muted-foreground ml-8 mt-1">These cookies help us understand how visitors interact with our site. They allow us to measure traffic and improve site performance.</p>
    </div>
    <div class="mt-3">
      <div class="flex items-center gap-3">
        <Checkbox id="cookies-marketing-performance" name="cookies-marketing-performance" />
        <Label for="cookies-marketing-performance">Marketing Performance Cookies</Label>
      </div>
      <p class="text-sm text-muted-foreground ml-8 mt-1">These cookies help us measure the effectiveness of our marketing campaigns.</p>
    </div>
    <DialogFooter>
      <Button data-slot="dialog-close" class="mt-4" variant="outline">Close</Button>
      <Button data-dialog-close class="mt-4">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Uso

```astro
---
import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogFooter, DialogClose } from './ui/dialog';
import { Button } from './ui/button';
---

<Dialog id="myDialog">
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogTitle>Dialog Title</DialogTitle>
    <DialogDescription>Dialog description.</DialogDescription>
    Content here
    <DialogFooter>
      <DialogClose>Close</DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## API

### Events

The dialog emits custom events that you can listen to:

| Event | Detail | Description |
|-------|--------|-------------|
| `dialog:change` | `{ open: boolean }` | Fired when the open state changes |

```astro
<Dialog id="my-dialog">
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogTitle>Title</DialogTitle>
    <DialogDescription>Description</DialogDescription>
  </DialogContent>
</Dialog>
```

```js
  const dialog = document.getElementById('my-dialog');

  dialog.addEventListener('dialog:change', (e) => {
    console.log('Is open:', e.detail.open);
  });
```

### Programmatic Control

You can control the dialog programmatically by dispatching a `dialog:set` event:

```js
const dialog = document.getElementById('my-dialog');

// Open the dialog
dialog.dispatchEvent(new CustomEvent('dialog:set', {
  detail: { open: true }
}));

// Close the dialog
dialog.dispatchEvent(new CustomEvent('dialog:set', {
  detail: { open: false }
}));
```

### Data Attributes

The dialog sets these data attributes that you can use for styling or querying state:

| Attribute | Element | Description |
|-----------|---------|-------------|
| `data-state` | dialog | Current state (`open` or `closed`) |

## Ejemplos

### Nested Dialogs

<Dialog>
  <Button data-slot="dialog-trigger" class="">Open Nested Dialog</Button>
  <DialogContent class="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>Nested Dialog</DialogTitle>
      <DialogDescription>
        Using websites and apps involves storing and retrieving information from your device, including cookies and other identifiers.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button data-slot="dialog-close" class="mt-4" variant="outline">Close</Button>
      <Dialog>
        <Button data-slot="dialog-trigger" class="mt-4">Open Nested Dialog</Button>
        <DialogContent class="sm:max-w-md border-red-800">
          <DialogHeader>
            <DialogTitle>Nested Dialog</DialogTitle>
            <DialogDescription>
              Using websites and apps involves storing and retrieving information from your device, including cookies and other identifiers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </DialogFooter>
  </DialogContent>
</Dialog>
