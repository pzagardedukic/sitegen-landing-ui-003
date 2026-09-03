"use client";

import { Box } from "@mui/material";
import { getTeamItems, getTeamSection } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import { getTeamTranslation } from "@/core/translations";
import DualColumnSection from "../common/DualColumnSection";
import TeamCard from "./TeamCard";

/*
 * Figma frame 1440x973: the 560/80/560 intro, then four cards of 277 across the 1200 grid.
 * Every second card is dropped by 60px — the stagger is what stops four portraits in a row
 * from reading as a row of passport photographs.
 */
export default function TeamSection() {
  const { lang } = useLanguage();
  const teamTranslation = getTeamTranslation(lang);

  const teamSection = getTeamSection(lang);
  if (!teamSection) {
    return null;
  }
  const teamItems = getTeamItems(lang);

  return (
    <DualColumnSection
      title={teamTranslation.title}
      description={teamSection.text}
      columns="560fr 80fr 560fr"
    >
      <Box
        sx={{
          display: "grid",
          gap: "30px",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          alignItems: "start",
        }}
      >
        {teamItems.map((member, index) => (
          <Box
            key={index}
            sx={{ mt: { md: index % 2 === 1 ? "60px" : 0 } }}
          >
            <TeamCard
              name={member.name}
              text={member.text}
              image={member.image}
              contact={member.contact}
            />
          </Box>
        ))}
      </Box>
    </DualColumnSection>
  );
}
