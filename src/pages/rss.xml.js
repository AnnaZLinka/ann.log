import rss from "@astrojs/rss";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { render } from "astro:content";
import { toFeedHtml, toFeedText } from "../feed.mjs";
import { getPosts } from "../posts";

const TITLE = "Mitt personlige nettsted";
const DESCRIPTION = "her poster jeg små innlegg når det passer seg";

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
