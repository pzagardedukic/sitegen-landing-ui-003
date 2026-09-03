"use client";

import { Box } from "@mui/material";
import MarqueeBand from "@/components/marquee/MarqueeBand";
import { getAboutSection } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import { getAboutTranslation } from "@/core/translations";

/*
 * The two scrolling bands under the about section. Full-bleed by design — in the wireframes
 * the tablet band stopped 175px short of the right edge and read as broken, so the width
 * comes from the viewport rather than the content container.
 *
 * The pair is the last thing in the about section, so the white below it is the section's
 * own bottom padding plus the next section's top padding, twice what sits above: measured
 * 48 above against 128 below at 390, and 80 against 240 at 1440. The bands read as stuck to
 * the content above and adrift from the section below.
 *
 * PULL moves the group down by half that difference and takes the same amount off the
 * bottom, so the air ends up even — 88 at 390, 160 at 1440 — without making the page any
 * longer. It stays smaller than the section's own bottom padding, so nothing reaches into
 * the next section.
 */
const PULL = { xs: 5, sm: 7, md: 10 };
export default function EstablishedAndClients() {
  const { lang } = useLanguage();
  const aboutTranslation = getAboutTranslation(lang);

  const aboutSection = getAboutSection(lang);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 1.5, md: 2 },
        mt: PULL,
        mb: { xs: -PULL.xs, sm: -PULL.sm, md: -PULL.md },
      }}
    >
      {aboutSection.establishedYear && (
        <MarqueeBand
          items={[`${aboutTranslation.establishedIn} ${aboutSection.establishedYear}`]}
          speed={45}
          tone="brand"
        />
      )}

      <MarqueeBand
        items={[`100% ${aboutTranslation.satisfiedClients}`]}
        speed={60}
        tone="quiet"
      />
    </Box>
  );
}
