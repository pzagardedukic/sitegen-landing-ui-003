"use client";

import PageLayout from "@/components/layout/PageLayout";
import { getPageSlugByKey, isSectionEnabled } from "@/core/static";
import Footer from "@/page-content/components/footer/Footer";
import Header from "@/page-content/components/header/Header";
import AboutPreviewSection from "@/page-content/components/section/about/AboutPreviewSection";
import BlogPreviewSection from "@/page-content/components/section/blog/BlogPreviewSection";
import CallToAction from "@/page-content/components/section/call-to-action/CallToAction";
import ContactPreviewSection from "@/page-content/components/section/contact/ContactPreviewSection";
import GalleryPreviewSection from "@/page-content/components/section/gallery/GalleryPreviewSection";
import HomeSection from "@/page-content/components/section/home/HomeSection";
import PortfolioPreviewSection from "@/page-content/components/section/portfolio/PortfolioPreviewSection";
import ReviewSection from "@/page-content/components/section/review/ReviewSection";
import ServicesPreviewSection from "@/page-content/components/section/services/ServicesPreviewSection";
import SubscribeSection from "@/page-content/components/section/subscribe/SubscribeSection";

import {
  renderSectionsWithDividers,
  SectionItem,
} from "@/page-content/components/section-renderer/SectionRenderer";

export default function HomePage() {
  const sections: SectionItem[] = [
    {
      key: "about",
      kind: "content",
      sectionId: getPageSlugByKey("about"),
      render: <AboutPreviewSection />,
    },
    {
      key: "services",
      kind: "content",
      enabled: isSectionEnabled("services"),
      sectionId: getPageSlugByKey("services"),
      // No banner behind this section: the Figma frame is a plain background with the
      // decorative shapes only. ui-001 ran the banner image across the top 460px, which
      // cut a hard horizontal edge through the middle of the service cards.
      render: <ServicesPreviewSection />,
    },
    {
      key: "portfolio",
      kind: "content",
      enabled: isSectionEnabled("portfolio"),
      sectionId: getPageSlugByKey("portfolio"),
      render: <PortfolioPreviewSection />,
    },
    {
      key: "cta",
      kind: "cta",
      render: <CallToAction href={`#${getPageSlugByKey("contact")}`} />,
    },
    {
      key: "gallery",
      kind: "content",
      enabled: isSectionEnabled("gallery"),
      sectionId: getPageSlugByKey("gallery"),
      render: <GalleryPreviewSection />,
    },
    {
      key: "reviews",
      kind: "content",
      enabled: isSectionEnabled("reviews"),
      sectionId: "reviews",
      render: <ReviewSection />,
    },
    {
      key: "blog",
      kind: "content",
      enabled: !isSectionEnabled("reviews") && isSectionEnabled("blog"),
      sectionId: getPageSlugByKey("blog"),
      render: <BlogPreviewSection />,
    },
    {
      key: "subscribe",
      kind: "cta",
      enabled: isSectionEnabled("subscribe"),
      render: <SubscribeSection />,
    },
    {
      key: "contact",
      kind: "content",
      sectionId: getPageSlugByKey("contact"),
      render: <ContactPreviewSection />,
    },
  ];

  return (
    <PageLayout header={<Header />} footer={<Footer />}>
      <HomeSection />
      {renderSectionsWithDividers(sections)}
    </PageLayout>
  );
}
