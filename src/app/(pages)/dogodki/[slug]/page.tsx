import type { Metadata } from "next";
import {
  getAllEventSlugs,
  isSectionEnabled,
  getPageSlugByKey,
} from "@/core/static";
import { getSeoEventItem } from "@/core/seo";
import { buildItemMetadata } from "@/core/seo";
import EventPage from "@/page-content/pages/events/Event";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  if (!isSectionEnabled("events")) {
    return [{ slug: "__disabled__" }];
  }

  return getAllEventSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getSeoEventItem(parseInt(slug, 10));
  if (!item) return {};

  return buildItemMetadata({
    title: item.title,
    description: item.description,
    image: item.image,
    path: `/${getPageSlugByKey("events")}/${slug}`,
  });
}

export default async function Event({ params }: PageProps) {
  const { slug } = await params;

  if (slug === "__disabled__") {
    notFound();
  }

  return <EventPage slug={slug} />;
}
