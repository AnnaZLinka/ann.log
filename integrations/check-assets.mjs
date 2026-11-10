import { readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import sharp from "sharp";

const ASSETS_DIR = "src/assets";
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

const findOversizedImages = async () => {
  const files = (await readdir(ASSETS_DIR, { recursive: true })).filter(
    (name) => IMAGE_EXTENSIONS.has(extname(name).toLowerCase()),
  );

  const problems = [];
  for (const name of files) {
    const path = join(ASSETS_DIR, name);
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

export default () => ({
  name: "check-assets",
  hooks: {
    "astro:build:start": async ({ logger }) => {
      const problems = await findOversizedImages();
      if (problems.length === 0) return;
      for (const problem of problems) logger.error(problem);
      throw new Error(
        `Bygget stoppet: ${problems.length} bilde(r) i ${ASSETS_DIR} er for store eller ugyldige.`,
      );
    },
  },
});
