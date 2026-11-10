import rss from "@astrojs/rss";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { render } from "astro:content";
import sanitizeHtml from "sanitize-html";
import { getPosts } from "../posts";

const TITLE = "Mitt personlige nettsted";
const DESCRIPTION = "her poster jeg små innlegg når det passer seg";

// feed readers can't resolve site-relative paths, so src and href get the full address; unparseable ones are dropped
const absoluteUrls = (site) => (tagName, attribs) => {
  for (const attr of ["src", "href"]) {
    if (!attribs[attr]) continue;
    try {
      attribs[attr] = new URL(attribs[attr], site).href;
    } catch {
      delete attribs[attr];
    }
  }
  return { tagName, attribs };
};

const toFeedHtml = (html, site) =>
  sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height"],
    },
    transformTags: { img: absoluteUrls(site), a: absoluteUrls(site) },
  });

const toFeedText = (html) =>
  sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();

export async function GET(context) {
  const container = await AstroContainer.create();
  const posts = await getPosts();
  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      const html = await container.renderToString(Content);
      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: toFeedText(html),
        content: toFeedHtml(html, context.site),
        link: `/#${post.id}`,
      };
    }),
  );
  return rss({
    title: TITLE,
    description: DESCRIPTION,
    site: context.site,
    trailingSlash: false,
    items,
  });
}
