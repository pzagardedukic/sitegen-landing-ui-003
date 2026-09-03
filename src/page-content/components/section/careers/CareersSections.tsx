"use client";

import { useRouter } from "next/navigation";

import { getCareersItems, getCareersSection } from "@/core/runtime";
import { getPageSlugByKey } from "@/core/static";
import { useLanguage } from "@/core/runtime";
import { getCareersTranslation } from "@/core/translations";
import DualColumnSection from "../common/DualColumnSection";
import CareersList from "./CareersList";

/* Figma frame 1440x1163: the 600/80/520 intro, then the vacancies as full-width rows. */
export default function CareersSection() {
  const router = useRouter();
  const { lang } = useLanguage();
  const careersTranslation = getCareersTranslation(lang);
  const careersSection = getCareersSection(lang);

  if (!careersSection) {
    return null;
  }

  const careersItems = getCareersItems(lang);

  const handleApply = (title: string) => {
    const subject = `${careersTranslation.applicationSubject}: ${title}`;

    router.push(
      `/${getPageSlugByKey("contact")}?subject=${encodeURIComponent(subject)}`,
    );
  };

  return (
    <DualColumnSection
      title={careersTranslation.title}
      description={careersSection.text}
      columns="600fr 80fr 520fr"
    >
      <CareersList careers={careersItems} onApply={handleApply} />
    </DualColumnSection>
  );
}
