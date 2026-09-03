"use client";

import SingleColumnSection from "../common/SingleColumnSection";
import Reviews from "./Reviews";
import { getReviewTranslation } from "@/core/translations";
import { getReviewSection } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";

export default function ReviewSection() {
  const { lang } = useLanguage();
  const reviewTranslation = getReviewTranslation(lang);

  const reviewSection = getReviewSection(lang);
  if (!reviewSection) {
    return null;
  }

  return (
    <SingleColumnSection
      title={reviewTranslation.title}
      description={reviewSection.text}
    >
      <Reviews />
    </SingleColumnSection>
  );
}
