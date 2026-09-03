"use client";

import { getPortfolioItems } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import {
  getButtonTranslation,
  getPortfolioTranslation,
} from "@/core/translations";
import { Box, Typography } from "@mui/material";
import PortfolioPreviewCard from "./PortfolioPreviewCard";
import {
  getPageSlugByKey,
  getPortfolioSlugById,
  withBasePath,
} from "@/core/static";

type RelatedProjectsProps = {
  projectIds: number[];
};

export default function RelatedProjects({ projectIds }: RelatedProjectsProps) {
  const { lang } = useLanguage();
  const projectTranslations = getPortfolioTranslation(lang).project;
  const buttonTranslation = getButtonTranslation(lang);

  const relatedItems = getPortfolioItems(lang)
    .filter((item) => projectIds.includes(item.id))
    .slice(0, 3);

  if (relatedItems.length === 0) return null;

  return (
    <Box display="flex" flexDirection="column" gap={{ xs: 3, md: 5 }}>
      <Typography variant="h3" component="h2">
        {projectTranslations.relatedProjects}
      </Typography>

      {/* Same three-across grid as the section itself, so a project reads the same
          wherever it appears. */}
      <Box
        sx={{
          display: "grid",
          gap: "40px",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        {relatedItems.map((item) => (
          <PortfolioPreviewCard
            key={item.id}
            title={item.title}
            image={item.images[0]}
            text={item.text}
            category={item.category}
            client={item.client}
            openLabel={buttonTranslation.learnMore}
            href={withBasePath(
              `/${getPageSlugByKey("portfolio")}/${getPortfolioSlugById(item.id)}`,
            )}
          />
        ))}
      </Box>
    </Box>
  );
}
