import { getAllCareerSlugs, isSectionEnabled } from "@/core/static";
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

export default async function Career({ params }: PageProps) {
  const { slug } = await params;

  if (slug === "__disabled__") {
    notFound();
  }

  return <CareerPage slug={slug} />;
}
