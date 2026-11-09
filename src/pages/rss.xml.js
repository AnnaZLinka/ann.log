import rss from "@astrojs/rss";
import { getPublishedPosts } from "../posts";

const TITLE = "Mitt personlige nettsted";
const DESCRIPTION = "her poster jeg små innlegg når det passer seg";

export async function GET(context) {
  const posts = await getPublishedPosts();
  return rss({
    title: TITLE,
    description: DESCRIPTION,
    site: context.site,
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedAt,
      description: post.body,
      link: `/#${post.id}`,
    })),
  });
}
