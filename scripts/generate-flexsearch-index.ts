import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

import { buildSearchDoc, isPublishedPost } from "../src/utils/build-search-doc";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");
const OUTPUT_PATH = path.join(process.cwd(), "public/search-index.json");

function walkDir(dir: string): Promise<string[]> {
  return fs.readdir(dir, { withFileTypes: true }).then((entries) =>
    Promise.all(
      entries.map((entry) => {
        const res = path.resolve(dir, entry.name);
        if (entry.isDirectory()) {
          return walkDir(res);
        } else if (res.endsWith(".md") || res.endsWith(".mdx")) {
          return [res];
        } else {
          return [];
        }
      })
    ).then((files) => files.flat())
  );
}

async function main() {
  console.log("[FlexSearch] Starting index generation...");
  const files = await walkDir(BLOG_DIR);
  console.log(`[FlexSearch] Found ${files.length} markdown files.`);

  const docs = [];
  for (const file of files) {
    const raw = await fs.readFile(file, "utf-8");
    const { data, content } = matter(raw);
    if (!isPublishedPost(data)) {
      continue;
    }
    const relPath = path.relative(BLOG_DIR, file).replace(/\\/g, "/");
    docs.push(
      buildSearchDoc({
        data,
        content,
        relativePath: relPath,
      })
    );
  }
  console.log(`[FlexSearch] Parsed ${docs.length} documents.`);

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(docs, null, 2), "utf-8");
  console.log(`[FlexSearch] Docs written to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error("[FlexSearch] Error during index generation:", err);
  process.exit(1);
});
