"use client";

import { Box, Typography } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

import { getLegalSection } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import { getLegalTranslation } from "@/core/translations";

type LegalDocument = {
  key: "termsOfService" | "privacyPolicy";
  title: string;
  file: string;
};

/*
 * Legal documents as rows in the Figma frame (1200x93): the document name on the left, the
 * open link on the right. ui-001 drew each as a 270x300 card with a large file-type icon,
 * which gave two links the weight of a product grid.
 */
export default function LegalSection() {
  const { lang } = useLanguage();
  const legalSection = getLegalSection(lang);
  const legalTranslation = getLegalTranslation(lang);

  const documents: LegalDocument[] = [];

  if (legalSection?.termsOfService) {
    documents.push({
      key: "termsOfService",
      title: legalTranslation.termsOfService,
      file: legalSection.termsOfService,
    });
  }

  if (legalSection?.privacyPolicy) {
    documents.push({
      key: "privacyPolicy",
      title: legalTranslation.privacyPolicy,
      file: legalSection.privacyPolicy,
    });
  }

  if (documents.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {documents.map((legalDocument) => (
        <Box
          key={legalDocument.key}
          component="a"
          href={legalDocument.file}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${legalDocument.title}: ${legalTranslation.openDocument}`}
          sx={(theme) => ({
            minHeight: 93,
            px: "30px",
            py: 2,
            borderRadius: "25px",
            border: `1px solid ${theme.palette.surfaces.border}`,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            textDecoration: "none",
            color: "inherit",
            transition: theme.transitions.create(["border-color", "background-color"]),
            "&:hover": {
              borderColor: theme.palette.primary.main,
              backgroundColor: theme.palette.surfaces.tint,
            },
          })}
        >
          <Typography variant="h5" component="h3">
            {legalDocument.title}
          </Typography>

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              color: "primary.main",
              flexShrink: 0,
            }}
          >
            <Typography variant="subtitle2" component="span">
              {legalTranslation.openDocument}
            </Typography>
            <ArrowOutwardIcon sx={{ fontSize: 16 }} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
