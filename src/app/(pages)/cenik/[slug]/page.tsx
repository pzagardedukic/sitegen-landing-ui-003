import type { Metadata } from "next";
import {
  getAllPricingSlugs,
  isSectionEnabled,
  getPageSlugByKey,
} from "@/core/static";
import { getSeoPricingItem } from "@/core/seo";
import { buildItemMetadata } from "@/core/seo";
import PricingItemPage from "@/page-content/pages/pricing/PricingItem";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  if (!isSectionEnabled("pricing")) {
    return [{ slug: "__disabled__" }];
  }

  return getAllPricingSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getSeoPricingItem(parseInt(slug, 10));
  if (!item) return {};

  return buildItemMetadata({
    title: item.title,
    description: item.description,
    image: item.image,
    path: `/${getPageSlugByKey("pricing")}/${slug}`,
  });
}

export default async function PricingItem({ params }: PageProps) {
  const { slug } = await params;

  if (slug === "__disabled__") {
    notFound();
  }

  return <PricingItemPage slug={slug} />;
}
