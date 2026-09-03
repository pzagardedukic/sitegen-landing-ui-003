"use client";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/section/Section";
import { getPricingItems } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import Footer from "@/page-content/components/footer/Footer";
import Header from "@/page-content/components/header/Header";
import HeaderSection from "@/page-content/components/section/header/HeaderSection";
import PricingItemSection from "@/page-content/components/section/pricing/PricingItemSection";

export default function PricingItemPage({ slug }: { slug: string }) {
  const { lang } = useLanguage();

  const pricingId = parseInt(slug, 10);
  const pricingItem = getPricingItems(lang).find(
    (item) => item.id === pricingId
  );

  if (isNaN(pricingId) || !pricingItem) {
    return null;
  }

  return (
    <PageLayout header={<Header />} footer={<Footer />}>
      <HeaderSection title={pricingItem.title} />

      <Section id="pricing-item">
        <PricingItemSection id={pricingItem.id} />
      </Section>
    </PageLayout>
  );
}
