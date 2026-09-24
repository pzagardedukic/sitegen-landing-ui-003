import { getAllEventSlugs, isSectionEnabled } from "@/core/static";
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

export default async function Event({ params }: PageProps) {
  const { slug } = await params;

  if (slug === "__disabled__") {
    notFound();
  }

  return <EventPage slug={slug} />;
}
