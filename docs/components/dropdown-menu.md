# Dropdown Menu

> Generado por `pnpm docs:components` desde [`DropdownMenu.astro`](../../src/components/ui/dropdown-menu/DropdownMenu.astro). No editar a mano.

Action and selection menus with runtime-owned open, highlight, and committed selection state.

## Importar

> Del registry de bejamas/ui. Se han descartado Trigger, Portal, Group,
> Shortcut, RadioGroup, RadioItem y CheckboxItem: los dos primeros arrastraban
> `../button` (y con él class-variance-authority) y `../icon/SemanticIcon`, que
> no existen aquí, y ninguno se usa. El trigger va con `data-slot` sobre el
> propio &lt;button>, que es donde deben ir aria-haspopup y aria-expanded.

```astro
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "./ui/dropdown-menu";
```

Ruta relativa desde `src/components/`, que es como se importa aquí.

## Props

Extiende `HTMLAttributes<"div">`.

| Prop | Tipo | Obligatoria | Descripción |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` | — |  |
| `defaultValue` | `string \| null` | — |  |
| `defaultValues` | `string[]` | — |  |
| `closeOnClickOutside` | `boolean` | — |  |
| `closeOnEscape` | `boolean` | — |  |
| `closeOnSelect` | `boolean` | — |  |
| `lockScroll` | `boolean` | — |  |
| `highlightItemOnHover` | `boolean` | — |  |
| `class` | `string` | — |  |

## Slots

- `default`

Detectados en el markup; los slots con nombre se comprueban con `Astro.slots.has()`.

> **Ojo:** los ejemplos de abajo vienen del registry y usan `DropdownMenuCheckboxItem`, `DropdownMenuGroup`, `DropdownMenuRadioItem`, `DropdownMenuTrigger`, que esta copia no exporta (el motivo, arriba). Adáptalos.

## Preview

```astro
<DropdownMenu defaultValue="pro">
  <DropdownMenuTrigger variant="outline">Open</DropdownMenuTrigger>
  <DropdownMenuContent align="start">
    <DropdownMenuLabel>Plans</DropdownMenuLabel>
    <DropdownMenuGroup>
      <DropdownMenuRadioItem value="starter">Starter</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="pro">Pro</DropdownMenuRadioItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
```

## Uso

```astro
---
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioItem,
} from './ui/dropdown-menu';
---

<DropdownMenu>
  <DropdownMenuTrigger variant="outline">Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Item 1</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## API

### Events

The dropdown menu emits custom events that you can listen to:

| Event | Detail | Description |
|-------|--------|-------------|
| `dropdown-menu:open-change` | `{ open, previousOpen, source, reason }` | Fired on real open-state changes |
| `dropdown-menu:change` | same detail | Deprecated alias for `dropdown-menu:open-change` |
| `dropdown-menu:highlight-change` | `{ value, previousValue, item, previousItem, source }` | Fired when highlight changes |
| `dropdown-menu:select` | `{ value, item, itemType, source, checked? }` | Cancelable user activation event fired before commit |
| `dropdown-menu:value-change` | `{ value, previousValue, item, previousItem, source }` | Fired when radio selection commits |
| `dropdown-menu:values-change` | `{ values, previousValues, changedValue, checked, item, source }` | Fired when checkbox selection commits |

```astro
<DropdownMenu id="my-dropdown" defaultValue="edit">
  <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuRadioItem value="edit">Edit</DropdownMenuRadioItem>
    <DropdownMenuRadioItem value="delete">Delete</DropdownMenuRadioItem>
  </DropdownMenuContent>
</DropdownMenu>
```

```js
  const dropdown = document.getElementById('my-dropdown');

  dropdown.addEventListener('dropdown-menu:open-change', (e) => {
    console.log('Is open:', e.detail.open);
  });

  dropdown.addEventListener('dropdown-menu:value-change', (e) => {
    console.log('Selected:', e.detail.value);
  });
```

### Programmatic Control

You can control the dropdown menu programmatically by dispatching a `dropdown-menu:set` event:

```js
const dropdown = document.getElementById('my-dropdown');

// Open the dropdown menu
dropdown.dispatchEvent(new CustomEvent('dropdown-menu:set', {
  detail: { open: true }
}));

// Commit radio selection
dropdown.dispatchEvent(new CustomEvent('dropdown-menu:set', {
  detail: { value: 'delete', source: 'restore' }
}));

// Commit checkbox selection
dropdown.dispatchEvent(new CustomEvent('dropdown-menu:set', {
  detail: { values: ['email', 'push'], source: 'restore' }
}));
```

### Structural Wrappers

`DropdownMenuPortal` and `DropdownMenuRadioGroup` are available for low-level authored markup.
Most consumers should keep using `DropdownMenuContent` directly.

### Data Attributes

The dropdown menu sets these data attributes that you can use for styling or querying state:

| Attribute | Element | Description |
|-----------|---------|-------------|
| `data-state` | dropdown-menu, dropdown-menu-content | Current state (`open` or `closed`) |
| `data-value` | dropdown-menu | Current committed radio value |
| `data-variant` | dropdown-menu-item | Visual variant (`default` or `destructive`) |
| `data-side` | dropdown-menu-content | Computed position (`top`, `right`, `bottom`, or `left`) |
| `data-align` | dropdown-menu-content | Alignment (`start`, `center`, or `end`) |
| `data-highlighted` | menu items | Present when item is focused |
| `data-checked` | radio and checkbox items | Present when item is committed as checked |
| `data-disabled` | menu items | Present when item is disabled |

## Ejemplos

### Action Menu

<DropdownMenu>
  <Button variant="outline" data-slot="dropdown-menu-trigger" class="">Account</Button>
  <DropdownMenuContent>
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuGroup>
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem>Duplicate</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

### Single Select

<DropdownMenu defaultValue="pro">
  <Button variant="outline" data-slot="dropdown-menu-trigger" class="">Plan</Button>
  <DropdownMenuContent>
    <DropdownMenuRadioItem value="starter">Starter</DropdownMenuRadioItem>
    <DropdownMenuRadioItem value="pro">Pro</DropdownMenuRadioItem>
    <DropdownMenuRadioItem value="team">Team</DropdownMenuRadioItem>
  </DropdownMenuContent>
</DropdownMenu>

### Multi Select

<DropdownMenu defaultValues={["email", "push"]} closeOnSelect={false}>
  <Button variant="outline" data-slot="dropdown-menu-trigger" class="">Notifications</Button>
  <DropdownMenuContent>
    <DropdownMenuCheckboxItem value="email">Email</DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem value="sms">SMS</DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem value="push">Push</DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>
