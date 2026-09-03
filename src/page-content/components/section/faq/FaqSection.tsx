"use client";

import { getFaqSection } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import { getFaqTranslation } from "@/core/translations";
import { Box } from "@mui/material";
import DualColumnSection from "../common/DualColumnSection";
import FaqItem from "./FaqItem";

/* Figma frame 1440x970: the 560/80/560 intro, then the questions stacked full width. */
export default function FaqSection() {
  const { lang } = useLanguage();
  const faqTranslation = getFaqTranslation(lang);
  const faqSection = getFaqSection(lang);

  if (!faqSection) {
    return null;
  }

  return (
    <DualColumnSection
      title={faqTranslation.title}
      description={faqSection.text}
      columns="560fr 80fr 560fr"
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {faqSection.items.map((item, index) => (
          <FaqItem
            key={index}
            question={item.question}
            answer={item.answer}
            defaultOpen={index === 0}
          />
        ))}
      </Box>
    </DualColumnSection>
  );
}
