"use client";

import { Box, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import GradientButton from "@/components/button/GradientButton";
import { getCatalogueSection } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import {
  getButtonTranslation,
  getCataloguesTranslation,
} from "@/core/translations";
import { getFileType } from "@/core/static";

/*
 * Catalogues are rows in the Figma frame (1200x90): the file name on the left, the download
 * button on the right. ui-001 drew them as 270x300 cards, which gave a filename the footprint
 * of a product photograph.
 */
export default function CatalogueSection() {
  const { lang } = useLanguage();
  const cataloguesTranslation = getCataloguesTranslation(lang);
  const buttonTranslation = getButtonTranslation(lang);
  const catalogueSection = getCatalogueSection();

  if (!catalogueSection || catalogueSection.items.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 4, md: 5 } }}>
      <Typography variant="h2" component="h2">
        {cataloguesTranslation.title}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {catalogueSection.items.map((item, index) => (
          <Box
            key={index}
            sx={(theme) => ({
              minHeight: 90,
              px: "28px",
              py: 2,
              borderRadius: "25px",
              border: `1px solid ${theme.palette.surfaces.border}`,
              backgroundColor: theme.palette.surfaces.tint,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              gap: 2,
            })}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography variant="subtitle1" component="p">
                {item.name}
              </Typography>

              <Typography variant="caption" sx={{ opacity: 0.6 }}>
                {getFileType(item.file)?.toUpperCase()}
              </Typography>
            </Box>

            <GradientButton
              component="a"
              href={item.file}
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<DownloadIcon sx={{ fontSize: 18 }} />}
              sx={{ flexShrink: 0 }}
            >
              {buttonTranslation.learnMore}
            </GradientButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
