import type { Metadata } from "next";
import {
  getAllCareerSlugs,
  isSectionEnabled,
  getPageSlugByKey,
} from "@/core/static";
import { getSeoCareerItem } from "@/core/seo";
import { buildItemMetadata } from "@/core/seo";
import CareerPage from "@/page-content/pages/careers/Career";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  if (!isSectionEnabled("careers")) {
    return [{ slug: "__disabled__" }];
  }

  return getAllCareerSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getSeoCareerItem(parseInt(slug, 10));
  if (!item) return {};

  return buildItemMetadata({
    title: item.title,
    description: item.description,
    path: `/${getPageSlugByKey("careers")}/${slug}`,
  });
}

export default async function Career({ params }: PageProps) {
  const { slug } = await params;

  if (slug === "__disabled__") {
    notFound();
  }

  return <CareerPage slug={slug} />;
}
