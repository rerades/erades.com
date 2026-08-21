// Del registry de bejamas/ui. Se han descartado Trigger, Portal, Group,
// Shortcut, RadioGroup, RadioItem y CheckboxItem: los dos primeros arrastraban
// `../button` (y con él class-variance-authority) y `../icon/SemanticIcon`, que
// no existen aquí, y ninguno se usa. El trigger va con `data-slot` sobre el
// propio <button>, que es donde deben ir aria-haspopup y aria-expanded.
export { default as DropdownMenu } from "./DropdownMenu.astro";
export { default as DropdownMenuContent } from "./DropdownMenuContent.astro";
export { default as DropdownMenuItem } from "./DropdownMenuItem.astro";
export { default as DropdownMenuLabel } from "./DropdownMenuLabel.astro";
export { default as DropdownMenuSeparator } from "./DropdownMenuSeparator.astro";
