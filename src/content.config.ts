import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()),
    categories: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

// La doc que `pnpm docs:components` genera en docs/components. Se carga como
// colección para que el pipeline de Markdown (y con él expressive-code) la
// renderice en /dev/componentes sin escribir un parser. Sin schema: los
// ficheros son Markdown pelado, sin frontmatter. El README es el índice del
// directorio en GitHub y la ruta ya tiene el suyo.
const componentes = defineCollection({
  loader: glob({
    base: "./docs/components",
    pattern: ["*.md", "!README.md"],
  }),
});

export const collections = { blog, componentes };
