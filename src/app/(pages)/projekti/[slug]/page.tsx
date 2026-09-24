import { getAllPortfolioSlugs, isSectionEnabled } from "@/core/static";
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

export default async function PortfolioItem({ params }: PageProps) {
  const { slug } = await params;

  if (slug === "__disabled__") {
    notFound();
  }

  return <PortfolioItemPage slug={slug} />;
}
