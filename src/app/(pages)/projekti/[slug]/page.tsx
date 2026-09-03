import type { Metadata } from "next";
import {
  getAllPortfolioSlugs,
  isSectionEnabled,
  getPageSlugByKey,
} from "@/core/static";
import { getSeoPortfolioItem } from "@/core/seo";
import { buildItemMetadata } from "@/core/seo";
import PortfolioItemPage from "@/page-content/pages/portfolio/PortfolioItem";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  if (!isSectionEnabled("portfolio")) {
    return [{ slug: "__disabled__" }];
  }

  return getAllPortfolioSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getSeoPortfolioItem(parseInt(slug, 10));
  if (!item) return {};

  return buildItemMetadata({
    title: item.title,
    description: item.description,
    image: item.image,
    path: `/${getPageSlugByKey("portfolio")}/${slug}`,
  });
}

export default async function PortfolioItem({ params }: PageProps) {
  const { slug } = await params;

  if (slug === "__disabled__") {
    notFound();
  }

  return <PortfolioItemPage slug={slug} />;
}
