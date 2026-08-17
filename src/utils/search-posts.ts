import { Document, Index } from "flexsearch";
import fs from "fs/promises";

const INDEX_PATH = "public/search-index.json";

export interface BlogDoc {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly tags: string[];
  readonly categories: string[];
  readonly content: string;
  readonly path: string;
  readonly heroImage: string;
  readonly [key: string]: string | string[];
}

function isIdObject(val: unknown): val is { id: string } {
  return typeof val === "object" && val !== null && "id" in val;
}

function extractIds(results: unknown): string[] {
  // FlexSearch Document puede devolver arrays de ids o arrays de objetos con .id
  if (Array.isArray(results)) {
    if (results.length === 0) return [];
    if (isIdObject(results[0])) {
      return (results as { id: string }[]).map((r) => r.id);
    }
    if (typeof results[0] === "string") {
      return results as string[];
    }
    if (Array.isArray(results[0])) {
      // aplanar y extraer ids recursivamente
      return (results as unknown[]).flatMap(extractIds);
    }
  }
  return [];
}

export async function searchPosts(rawQuery: string): Promise<BlogDoc[]> {
  const query = rawQuery.toLowerCase().trim();
  if (!query) return [];

  // Cargar los documentos serializados
  const raw = await fs.readFile(INDEX_PATH, "utf-8");
  const docs: BlogDoc[] = JSON.parse(raw);

  // Índice para metadatos (Document)
  const docIndex = new Document<BlogDoc, string>({
    document: {
      id: "id",
      index: ["title", "description", "tags", "categories"],
    },
    tokenize: "forward",
    cache: true,
  });
  // Índice fulltext para content (Index)
  const contentIndex = new Index<string>({
    tokenize: "full",
    cache: true,
  });
  docs.forEach((doc: BlogDoc) => {
    docIndex.add(doc);
    contentIndex.add(doc.id, doc.content);
  });

  // Buscar en metadatos (Document)
  const fields = ["title", "description", "tags", "categories"];
  const docResultIdSets = await Promise.all(
    fields.map((field) =>
      docIndex.search({
        query,
        field,
        limit: 20,
        enrich: true,
        suggest: true,
      })
    )
  );
  // Buscar en content (Index)
  const contentResultIds = await contentIndex.search(query, 20);

  // Unifica y deduplica los ids
  const allIds = [
    ...new Set([
      ...docResultIdSets.flatMap(extractIds),
      ...(Array.isArray(contentResultIds) ? contentResultIds : []),
    ]),
  ];

  // Devuelve los documentos completos
  return allIds
    .map((id) => docs.find((doc) => doc.id === id))
    .filter((doc): doc is BlogDoc => Boolean(doc));
}
