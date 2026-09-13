import fs from "fs";
import path from "path";
import matter from "gray-matter";
import sharp from "sharp";

// Uso: pnpm hero src/content/blog/es/<carpeta>/<post>.mdx ["indicaciones extra"]
// Genera public/hero-<slug>.webp a partir de title y description, y apunta
// `heroImage` a ella en el post y en su espejo del otro idioma.
const [, , postPath, extra = ""] = process.argv;

const MODEL = "black-forest-labs/flux.2-pro";

interface ImageResponse {
  readonly data?: readonly { readonly b64_json?: string }[];
  readonly error?: { readonly message: string };
}

function buildPrompt(title: string, description: string): string {
  return [
    "Editorial hero illustration for a technical blog post.",
    `Post title: ${title}`,
    `Summary: ${description}`,
    extra,
    "Wide composition with a clear focal point, conceptual rather than literal.",
    "No text, letters, logos or watermarks.",
  ]
    .filter(Boolean)
    .join("\n");
}

// Toca solo la línea de heroImage: matter.stringify reescribiría el frontmatter
// entero (pubDate pasaría a ISO con hora, se perderían las comillas).
function setHeroImage(file: string, url: string): void {
  if (!fs.existsSync(file)) return;
  const raw = fs.readFileSync(file, "utf-8");
  const line = `heroImage: ${url}`;
  const next = /^heroImage:.*$/m.test(raw)
    ? raw.replace(/^heroImage:.*$/m, line)
    : raw.replace(/^(pubDate:.*)$/m, `$1\n${line}`);
  fs.writeFileSync(file, next);
  process.stdout.write(`heroImage → ${file}\n`);
}

async function main(): Promise<void> {
  if (!postPath || !fs.existsSync(postPath)) {
    throw new Error(`Post no encontrado: ${postPath ?? "(sin ruta)"}`);
  }

  const { data } = matter(fs.readFileSync(postPath, "utf-8"));
  const slug = path.basename(postPath).replace(/\.mdx?$/, "");

  // OpenRouter tiene su propia Image API; no es la ruta /images/generations de OpenAI.
  const response = await fetch("https://openrouter.ai/api/v1/images", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: buildPrompt(String(data.title), String(data.description)),
      aspect_ratio: "3:2",
      output_format: "png",
    }),
  });
  const result = (await response.json()) as ImageResponse;
  if (!response.ok) {
    throw new Error(`OpenRouter ${response.status}: ${result.error?.message}`);
  }

  const b64 = result.data?.[0]?.b64_json;
  if (!b64) throw new Error("La API no devolvió imagen");

  // FLUX.2 no entrega webp: pedimos png (sin pérdida) y comprimimos una sola vez.
  const fileName = `hero-${slug}.webp`;
  await sharp(Buffer.from(b64, "base64"))
    .webp({ quality: 82 })
    .toFile(path.join("public", fileName));
  process.stdout.write(`Imagen → public/${fileName}\n`);

  setHeroImage(postPath, `/${fileName}`);
  const mirror = findTranslation(postPath, data.translationKey);
  if (mirror) setHeroImage(mirror, `/${fileName}`);
}

// Cada idioma tiene su propio slug: la traducción se encuentra por
// `translationKey`, no por nombre de fichero.
function findTranslation(file: string, key: unknown): string | undefined {
  if (typeof key !== "string") return undefined;
  const otherDir = file.includes("/es/")
    ? file.slice(0, file.indexOf("/es/")) + "/en"
    : file.slice(0, file.indexOf("/en/")) + "/es";
  const walk = (dir: string): string[] =>
    fs
      .readdirSync(dir, { withFileTypes: true })
      .flatMap((e) =>
        e.isDirectory()
          ? walk(path.join(dir, e.name))
          : /\.mdx?$/.test(e.name)
            ? [path.join(dir, e.name)]
            : []
      );
  return walk(otherDir).find(
    (f) => matter(fs.readFileSync(f, "utf-8")).data.translationKey === key
  );
}

main().catch((error: unknown) => {
  process.stderr.write(`${String(error)}\n`);
  process.exit(1);
});
