import rss from "@astrojs/rss";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { render } from "astro:content";
import type { APIRoute } from "astro";
import { toFeedHtml, toFeedText } from "../feed.ts";
import { getPosts } from "../posts";

const TITLE = "ann.log";
const DESCRIPTION = "små innlegg når det passer seg";
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export const GET: APIRoute = async (context) => {
  const site = context.site;
  if (!site) throw new Error("site is required for the feed");
  // the feed is served from the base path, so the channel link and item links start there
  const feedSite = new URL(`${BASE}/`, site);
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
        content: toFeedHtml(html, site),
        link: `${BASE}/#${post.id}`,
      };
    }),
  );
  return rss({
    title: TITLE,
    description: DESCRIPTION,
    site: feedSite,
    trailingSlash: false,
    items,
  });
};
