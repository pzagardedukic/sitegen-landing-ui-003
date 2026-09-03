import type { Metadata } from "next";
import {
  getAllBlogSlugs,
  isSectionEnabled,
  getPageSlugByKey,
} from "@/core/static";
import { getSeoBlogItem } from "@/core/seo";
import { buildItemMetadata } from "@/core/seo";
import BlogPostPage from "@/page-content/pages/blog/BlogPost";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  if (!isSectionEnabled("blog")) {
    return [{ slug: "__disabled__" }];
  }

  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getSeoBlogItem(parseInt(slug, 10));
  if (!item) return {};

  return buildItemMetadata({
    title: item.title,
    description: item.description,
    image: item.image,
    path: `/${getPageSlugByKey("blog")}/${slug}`,
  });
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;

  if (slug === "__disabled__") {
    notFound();
  }

  return <BlogPostPage slug={slug} />;
}
