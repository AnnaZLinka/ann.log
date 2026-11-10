import { readdir, stat } from "node:fs/promises";
import { join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const MAX_SIDE_PX = 4000;
const MAX_FILE_MB = 10;
const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
]);

const listImages = async (dir) => {
  try {
    return (await readdir(dir, { recursive: true })).filter((name) =>
      IMAGE_EXTENSIONS.has(extname(name).toLowerCase()),
    );
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
};

export const findOversizedImages = async (dir) => {
  const problems = [];
  for (const name of await listImages(dir)) {
    const path = relative(process.cwd(), join(dir, name));
    const sizeMb = (await stat(path)).size / 1024 / 1024;
    if (sizeMb > MAX_FILE_MB) {
      problems.push(
        `${path} er ${sizeMb.toFixed(1)} MB, grensen er ${MAX_FILE_MB} MB.\n` +
          `  Komprimer eller skaler ned bildet før du legger det inn.`,
      );
    }

    let width, height;
    try {
      ({ width, height } = await sharp(path).metadata());
    } catch (error) {
      problems.push(`${path} kunne ikke leses som bilde: ${error.message}`);
      continue;
    }
    if (!width || !height) {
      problems.push(`${path} mangler dimensjoner, kan ikke sjekke størrelsen.`);
      continue;
    }
    if (Math.max(width, height) > MAX_SIDE_PX) {
      problems.push(
        `${path} er ${width}×${height} px, grensen er ${MAX_SIDE_PX} px på lengste side.\n` +
          `  Skaler ned, f.eks.: magick ${path} -resize ${MAX_SIDE_PX}x${MAX_SIDE_PX}\\> ${path}`,
      );
    }
  }
  return problems;
};

export default () => {
  let assetsDir;
  return {
    name: "check-assets",
    hooks: {
      "astro:config:done": ({ config }) => {
        assetsDir = fileURLToPath(new URL("assets/", config.srcDir));
      },
      "astro:build:start": async ({ logger }) => {
        const problems = await findOversizedImages(assetsDir);
        if (problems.length === 0) return;
        for (const problem of problems) logger.error(problem);
        throw new Error(
          `Bygget stoppet: ${problems.length} bilde(r) i ${relative(process.cwd(), assetsDir)} er for store eller ugyldige.`,
        );
      },
    },
  };
};
