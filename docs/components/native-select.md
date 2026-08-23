# Native Select

> Generado por `pnpm docs:components` desde el JSDoc de [`NativeSelect.astro`](../../src/components/ui/native-select/NativeSelect.astro). No editar a mano: los cambios se pierden en la siguiente copia del registry.

A styled native HTML select element with consistent design system integration.

## Exports en este repo

> Desviación del registry (ver docs/bejamas-ui.md): no se exporta
> `NativeSelectOptGroup` —ni se copia su fichero— porque aquí no hay ningún
> &lt;select> con grupos. Si algún día lo hay, vuelve a copiarlo con el script.

- `NativeSelect` — `NativeSelect.astro`
- `NativeSelectOption` — `NativeSelectOption.astro`

```astro
import { NativeSelect, NativeSelectOption } from "./ui/native-select";
```

Ruta relativa desde `src/components/`, que es como se importan aquí (ver `BlogFilters.astro`, `Header.astro`).

> **Ojo:** los ejemplos de abajo vienen del registry y usan `NativeSelectOptGroup`, que esta copia no exporta (el motivo, arriba). Adáptalos.

## Preview

```astro
<NativeSelect class="w-[200px]">
  <NativeSelectOption value="">Select a fruit</NativeSelectOption>
  <NativeSelectOption value="apple">Apple</NativeSelectOption>
  <NativeSelectOption value="banana">Banana</NativeSelectOption>
  <NativeSelectOption value="cherry">Cherry</NativeSelectOption>
</NativeSelect>
```

## Uso

```astro
---
import {
  NativeSelect,
  NativeSelectOption,
  NativeSelectOptGroup,
} from './ui/native-select';
---

<NativeSelect>
  <NativeSelectOption value="">Select a fruit</NativeSelectOption>
  <NativeSelectOption value="apple">Apple</NativeSelectOption>
  <NativeSelectOption value="banana">Banana</NativeSelectOption>
</NativeSelect>
```

### Native Select vs Select

Use **NativeSelect** when you need standard browser form behavior — native validation, mobile-optimized pickers, and zero JavaScript. Use **Select** when you need a custom-styled dropdown with keyboard navigation, grouped items, and rich content.

## Ejemplos

### With Groups

<NativeSelect class="w-[200px]">
  <NativeSelectOptGroup label="Fruits">
    <NativeSelectOption value="apple">Apple</NativeSelectOption>
    <NativeSelectOption value="banana">Banana</NativeSelectOption>
  </NativeSelectOptGroup>
  <NativeSelectOptGroup label="Vegetables">
    <NativeSelectOption value="carrot">Carrot</NativeSelectOption>
    <NativeSelectOption value="broccoli">Broccoli</NativeSelectOption>
  </NativeSelectOptGroup>
</NativeSelect>

### Sizes

<div class="flex flex-col items-start gap-4 sm:flex-row">
  <NativeSelect class="w-[180px]" size="sm">
    <NativeSelectOption value="">Small (h-8)</NativeSelectOption>
    <NativeSelectOption value="apple">Apple</NativeSelectOption>
    <NativeSelectOption value="banana">Banana</NativeSelectOption>
  </NativeSelect>
  <NativeSelect class="w-[180px]" size="default">
    <NativeSelectOption value="">Default (h-9)</NativeSelectOption>
    <NativeSelectOption value="apple">Apple</NativeSelectOption>
    <NativeSelectOption value="banana">Banana</NativeSelectOption>
  </NativeSelect>
  <NativeSelect class="w-[180px]" size="lg">
    <NativeSelectOption value="">Large (h-10)</NativeSelectOption>
    <NativeSelectOption value="apple">Apple</NativeSelectOption>
    <NativeSelectOption value="banana">Banana</NativeSelectOption>
  </NativeSelect>
</div>

### Disabled

<NativeSelect disabled class="w-[200px]">
  <NativeSelectOption value="apple">Apple</NativeSelectOption>
  <NativeSelectOption value="banana">Banana</NativeSelectOption>
</NativeSelect>

### Invalid

<NativeSelect aria-invalid="true" class="w-[200px]">
  <NativeSelectOption value="">Select a fruit</NativeSelectOption>
  <NativeSelectOption value="apple">Apple</NativeSelectOption>
  <NativeSelectOption value="banana">Banana</NativeSelectOption>
</NativeSelect>
