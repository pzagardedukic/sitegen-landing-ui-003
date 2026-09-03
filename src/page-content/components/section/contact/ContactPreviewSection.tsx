"use client";

import { Box, Typography } from "@mui/material";
import { getContactTranslation } from "@/core/translations";
import { useLanguage } from "@/core/runtime";
import { getMap } from "@/core/runtime";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";
import CustomMap from "./CustomMap";

/*
 * Contact from the Figma frame (1440x1208): details on the left half, the form card on the
 * right, and the map full-bleed underneath at 400 tall.
 */
export default function ContactPreviewSection() {
  const { lang } = useLanguage();
  const contactTranslation = getContactTranslation(lang);
  const map = getMap();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 6, md: 10 } }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "560fr 80fr 560fr" },
          gap: { xs: 5, md: 0 },
          alignItems: "start",
        }}
      >
        <Box
          sx={{
            gridColumn: { md: "1" },
            display: "flex",
            flexDirection: "column",
            gap: { xs: 4, md: 6 },
          }}
        >
          <Typography variant="h2" component="h2">
            {contactTranslation.title}
          </Typography>

          <ContactInfo />
        </Box>

        <Box sx={{ gridColumn: { md: "3" } }}>
          <ContactForm />
        </Box>
      </Box>

      {map.enabled && <CustomMap />}
    </Box>
  );
}
