import sanitizeHtml from "sanitize-html";
import { parseDocument } from "htmlparser2";

const MAX_FEED_IMAGE_WIDTH = 1280;
const DESCRIPTION_MAX_LENGTH = 300;

const parseSrcset = (srcset) =>
  srcset
    .split(",")
    .map((candidate) => candidate.trim().split(/\s+/))
    .filter(([url, descriptor]) => url && /^\d+w$/.test(descriptor ?? ""))
    .map(([url, descriptor]) => ({ url, width: parseInt(descriptor, 10) }));

// feed readers ignore srcset, so the single src must be a bounded variant rather than the intrinsic-size fallback
export const pickFeedImage = (attribs, maxWidth = MAX_FEED_IMAGE_WIDTH) => {
  const { srcset, sizes, ...rest } = attribs;
  if (!rest.src) return null;
  const candidates = srcset ? parseSrcset(srcset) : [];
  if (candidates.length === 0) return rest;

  const fitting = candidates.filter((c) => c.width <= maxWidth);
  const chosen = fitting.length
    ? fitting.reduce((a, b) => (b.width > a.width ? b : a))
    : candidates.reduce((a, b) => (b.width < a.width ? b : a));

  const width = Number(rest.width);
  const height = Number(rest.height);
  const out = { ...rest, src: chosen.url };
  if (width > 0 && height > 0) {
    out.width = String(chosen.width);
    out.height = String(Math.round((height * chosen.width) / width));
  } else {
    delete out.width;
    delete out.height;
  }
  return out;
};

const toAbsolute = (value, site) => {
  try {
    return new URL(value, site).href;
  } catch {
    return undefined;
  }
};

export const toFeedHtml = (html, site) =>
  sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height"],
    },
    transformTags: {
      img: (tagName, attribs) => {
        const picked = pickFeedImage(attribs);
        const src = picked && toAbsolute(picked.src, site);
        if (!src) return { tagName, attribs: {} };
        return { tagName, attribs: { ...picked, src } };
      },
      a: (tagName, attribs) => {
        const href = attribs.href && toAbsolute(attribs.href, site);
        if (href) return { tagName, attribs: { ...attribs, href } };
        const { href: _dropped, ...rest } = attribs;
        return { tagName, attribs: rest };
      },
    },
    exclusiveFilter: (frame) => frame.tag === "img" && !frame.attribs.src,
  });

const collectText = (node, parts) => {
  if (node.type === "text") parts.push(node.data);
  else if (node.name === "img") parts.push(node.attribs?.alt ?? "");
  else if (node.name === "script" || node.name === "style") return;
  for (const child of node.children ?? []) collectText(child, parts);
};

const truncate = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  const cut = text.lastIndexOf(" ", maxLength);
  return text.slice(0, cut > 0 ? cut : maxLength) + "…";
};

export const toFeedText = (html, maxLength = DESCRIPTION_MAX_LENGTH) => {
  const parts = [];
  collectText(parseDocument(html), parts);
  return truncate(parts.join(" ").replace(/\s+/g, " ").trim(), maxLength);
};
