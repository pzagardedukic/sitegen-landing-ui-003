import { getAllBlogSlugs, isSectionEnabled } from "@/core/static";
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

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;

  if (slug === "__disabled__") {
    notFound();
  }

  return <BlogPostPage slug={slug} />;
}
