/**
 * Copia componentes de bejamas/ui desde su registry.
 *
 * Existe porque `bejamas add` hace bastante más que copiar ficheros: se añade a
 * sí mismo (un CLI) a `dependencies`, mete `class-variance-authority` aunque el
 * componente no lo use, infla el lockfile ~1900 líneas y escribe un placeholder
 * roto en `allowBuilds` de pnpm-workspace.yaml. El registry, en cambio, es JSON
 * plano con el contenido de cada fichero incrustado.
 *
 *   pnpm tsx scripts/add-bejamas-component.ts dialog dropdown-menu
 *
 * Las dependencias npm se listan al final para instalarlas a mano, que es
 * justo la decisión que no queremos automatizar.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const REGISTRY = "https://ui.bejamas.com/r";
const TARGET = "src/components/ui";

interface RegistryFile {
  readonly path: string;
  readonly content: string;
}

interface RegistryItem {
  readonly name: string;
  readonly dependencies?: readonly string[];
  readonly registryDependencies?: readonly string[];
  readonly files: readonly RegistryFile[];
}

async function fetchItem(name: string): Promise<RegistryItem> {
  const res = await fetch(`${REGISTRY}/${name}.json`);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  return (await res.json()) as RegistryItem;
}

async function main(): Promise<void> {
  const names = process.argv.slice(2);
  if (names.length === 0) {
    throw new Error("uso: add-bejamas-component.ts <componente> [...]");
  }

  const deps = new Set<string>();
  for (const name of names) {
    const item = await fetchItem(name);
    for (const dep of item.dependencies ?? []) deps.add(dep);

    for (const file of item.files) {
      // El registry usa rutas "ui/<componente>/X.astro".
      const out = join(TARGET, file.path.replace(/^ui\//, ""));
      await mkdir(dirname(out), { recursive: true });
      await writeFile(out, file.content, "utf-8");
      process.stdout.write(`  ${out}\n`);
    }

    const registryDeps = item.registryDependencies ?? [];
    if (registryDeps.length > 0) {
      process.stdout.write(
        `  (${name} declara registryDependencies: ${registryDeps.join(", ")} — añádelas a mano si de verdad las usas)\n`
      );
    }
  }

  process.stdout.write(`\ninstala:  pnpm add ${[...deps].join(" ")}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${String(error)}\n`);
  process.exitCode = 1;
});
