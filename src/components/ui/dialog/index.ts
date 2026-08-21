// Del registry de bejamas/ui. Descartados Trigger, Description y Footer:
// el disparador va con `data-slot` sobre el propio <button> (así el runtime
// pone ahí aria-expanded), y los otros dos no se usan.
export { default as Dialog } from "./Dialog.astro";
export { default as DialogClose } from "./DialogClose.astro";
export { default as DialogContent } from "./DialogContent.astro";
export { default as DialogHeader } from "./DialogHeader.astro";
export { default as DialogOverlay } from "./DialogOverlay.astro";
export { default as DialogTitle } from "./DialogTitle.astro";
