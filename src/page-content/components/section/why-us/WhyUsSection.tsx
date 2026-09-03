"use client";

import { Box } from "@mui/material";
import { getExperienceItems, getExperienceSection } from "@/core/runtime";
import StatBox from "./StatBox";
import { useLanguage } from "@/core/runtime";
import { getWhyUsTranslation } from "@/core/translations";
import DualColumnSection from "../common/DualColumnSection";
import ExperienceItems from "./ExperienceItems";

/*
 * Figma frame 1440x899: the 560/80/560 intro, then the two figures side by side on the same
 * split, then the certification tiles across the full width.
 */
export default function WhyUsSection() {
  const { lang } = useLanguage();
  const whyUsTranslation = getWhyUsTranslation(lang);

  const experience = getExperienceSection(lang);
  const experienceItemsCount = getExperienceItems().length;

  const stats = [
    experience?.clientCount && {
      value: `${experience.clientCount} +`,
      label: whyUsTranslation.clientCount,
    },
    experience?.projectCount && {
      value: `${experience.projectCount} +`,
      label: whyUsTranslation.projectCount,
    },
  ].filter(Boolean);

  return (
    <DualColumnSection
      title={whyUsTranslation.title}
      description={experience?.text ?? ""}
      columns="560fr 80fr 560fr"
    >
      {stats.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "560fr 80fr 560fr" },
            gap: { xs: 4, sm: 0 },
          }}
        >
          {stats.map((stat, i) =>
            stat ? (
              <Box key={i} sx={{ gridColumn: { sm: i === 0 ? "1" : "3" } }}>
                <StatBox value={stat.value} label={stat.label} />
              </Box>
            ) : null,
          )}
        </Box>
      )}

      {experienceItemsCount > 0 && <ExperienceItems />}
    </DualColumnSection>
  );
}
