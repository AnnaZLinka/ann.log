import rss from "@astrojs/rss";
import { getPublishedPosts } from "../posts";
import { statSync } from "node:fs";

const mimeTypes = {
  gif: "image/gif",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  mp4: "video/mp4",
  webm: "video/webm",
};

// rss enclosures require byte length and mime type; media lives in public/
const enclosure = (path) => ({
  url: path,
  length: statSync(`public${path}`).size,
  type:
    mimeTypes[path.split(".").pop().toLowerCase()] ??
    "application/octet-stream",
});

export async function GET(context) {
  const posts = await getPublishedPosts();
  return rss({
    title: "Mitt personlige nettsted",
    description: "her poster jeg små innlegg når det passer seg",
    site: context.site,
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedAt,
      description: post.body,
      link: `/#${post.id}`,
      ...(post.data.media && { enclosure: enclosure(post.data.media) }),
    })),
  });
}
