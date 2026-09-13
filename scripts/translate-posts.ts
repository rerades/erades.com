import fs from "fs";
import path from "path";
import OpenAI from "openai";
import matter from "gray-matter";

// Lee los idiomas desde argumentos de línea de comandos
const [, , from = "es", to = "en"] = process.argv;

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

function getSystemPrompt(from: string, to: string) {
  return `You are a translator from ${
    from === "es" ? "Spanish" : "English"
  } to ${
    to === "es" ? "Spanish" : "English"
  }. Only translate, do not explain, don't add any string about the translation, just the translation. Keep the markdown format.`;
}

async function translateText(
  text: string,
  from: string,
  to: string
): Promise<string> {
  const { choices } = await openai.chat.completions.create({
    model: "openai/gpt-4",
    messages: [
      { role: "system", content: getSystemPrompt(from, to) },
      {
        role: "user",
        content: `Translate this text to ${
          to === "es" ? "Spanish" : "English"
        }:\n\n${text}`,
      },
    ],
  });
  return choices[0].message.content?.trim() ?? text;
}

async function translatePost(filePath: string, from: string, to: string) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  // Traduce solo title y description del frontmatter si existen
  const newData = { ...data };
  if (typeof data.title === "string") {
    newData.title = await translateText(data.title, from, to);
  }
  if (typeof data.description === "string") {
    newData.description = await translateText(data.description, from, to);
  }

  // Traduce el contenido markdown
  const translatedContent = await translateText(content, from, to);

  // Reconstruye el markdown traducido
  const dest = matter.stringify(translatedContent, newData);
  const destPath = filePath.replace(`/${from}/`, `/${to}/`);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, dest);
  console.log(`Traducido: ${filePath} → ${destPath}`);
  if (!data.translationKey) {
    console.log(
      `  Falta emparejarlos: pon el mismo translationKey en los dos ficheros.`
    );
  }
  console.log(`  Renombra ${destPath} a un slug en "${to}".`);
}

function getAllMarkdownFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(filePath));
    } else if (file.endsWith(".md") || file.endsWith(".mdx")) {
      results.push(filePath);
    }
  }
  return results;
}

async function main() {
  const srcDir = path.join("src", "content", "blog", from);
  if (!fs.existsSync(srcDir)) {
    console.error(`No existe la carpeta: ${srcDir}`);
    process.exit(1);
  }
  // Cada idioma tiene su slug, así que la traducción no se encuentra por nombre
  // de fichero sino por `translationKey`. Sin esto, re-traduciría todo.
  const destDir = path.join("src", "content", "blog", to);
  const translatedKeys = new Set(
    fs.existsSync(destDir)
      ? getAllMarkdownFiles(destDir).map(
          (f) => matter(fs.readFileSync(f, "utf-8")).data.translationKey
        )
      : []
  );
  const files = getAllMarkdownFiles(srcDir);
  for (const srcPath of files) {
    const destPath = srcPath.replace(`/${from}/`, `/${to}/`);
    const { translationKey } = matter(fs.readFileSync(srcPath, "utf-8")).data;
    if (translationKey && translatedKeys.has(translationKey)) {
      console.log(`Saltado: ${srcPath} (ya traducido, ${translationKey})`);
      continue;
    }
    if (fs.existsSync(destPath)) {
      console.log(
        `Saltado: ${srcPath} → ${destPath} (ya existe el fichero traducido)`
      );
      continue;
    }
    await translatePost(srcPath, from, to);
  }
}

main();
