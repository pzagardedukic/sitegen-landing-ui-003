import { getAllPricingSlugs, isSectionEnabled } from "@/core/static";
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

export default async function PricingItem({ params }: PageProps) {
  const { slug } = await params;

  if (slug === "__disabled__") {
    notFound();
  }

  return <PricingItemPage slug={slug} />;
}
