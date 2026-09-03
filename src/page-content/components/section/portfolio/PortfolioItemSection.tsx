"use client";

import { useState } from "react";
import { getPortfolioItems } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import { Box, Typography } from "@mui/material";
import BackButton from "@/components/button/BackButton";
import SectionDescription from "../common/SectionDescription";
import { getPortfolioTranslation } from "@/core/translations";
import { useRouter } from "next/navigation";
import RelatedProjects from "./RelatedProjects";
import { getPageSlugByKey } from "@/core/static";
import ShareActions from "../common/ShareActions";

/*
 * Project detail from the Figma frame (1440x1842): a back button, the main picture at
 * 1200x540 with thumbnails beneath, the title on the left and the description on the right,
 * a rule, then date / client / category as three labelled columns, and the related projects.
 *
 * The thumbnails swap the main picture rather than opening a lightbox — on a project page
 * the pictures are one story, and a lightbox takes the reader out of it.
 */
export default function PortfolioItemSection({ id }: { id: number }) {
  const router = useRouter();
  const { lang } = useLanguage();
  const projectTranslations = getPortfolioTranslation(lang).project;
  const [activeImage, setActiveImage] = useState(0);

  const portfolioItem = getPortfolioItems(lang).find((item) => item.id === id);
  if (!portfolioItem) {
    return null;
  }

  const relatedItemIds = getPortfolioItems(lang)
    .filter(
      (item) =>
        item.id !== portfolioItem.id &&
        item.category === portfolioItem.category,
    )
    .map((item) => item.id);

  const images = portfolioItem.images ?? [];

  const details = [
    { label: projectTranslations.details.date, value: portfolioItem.date },
    { label: projectTranslations.details.client, value: portfolioItem.client },
    { label: projectTranslations.details.category, value: portfolioItem.category },
  ].filter((detail) => Boolean(detail.value));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 5, md: 8 } }}>
      <BackButton
        label={projectTranslations.backToPortfolio}
        onClick={() => router.push(`/${getPageSlugByKey("portfolio")}`)}
      />

      {images.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Box
            sx={(theme) => ({
              height: { xs: 260, sm: 380, md: 540 },
              borderRadius: "25px",
              overflow: "hidden",
              backgroundColor: theme.palette.surfaces.placeholder,
            })}
          >
            <Box
              component="img"
              src={images[activeImage]}
              alt=""
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>

          {images.length > 1 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(images.length, 4)}, 1fr)`,
                gap: "16px",
              }}
            >
              {images.slice(0, 4).map((image, index) => (
                <Box
                  key={image}
                  component="button"
                  type="button"
                  aria-label={`${index + 1}`}
                  onClick={() => setActiveImage(index)}
                  sx={(theme) => ({
                    height: { xs: 64, md: 104 },
                    borderRadius: "16px",
                    overflow: "hidden",
                    padding: 0,
                    cursor: "pointer",
                    border: `2px solid ${
                      index === activeImage
                        ? theme.palette.primary.main
                        : "transparent"
                    }`,
                    backgroundColor: theme.palette.surfaces.placeholder,
                  })}
                >
                  <Box
                    component="img"
                    src={image}
                    alt=""
                    loading="lazy"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "620fr 80fr 500fr" },
          gap: { xs: 3, md: 0 },
          alignItems: "start",
        }}
      >
        <Typography variant="h2" component="h1" sx={{ gridColumn: { md: "1" } }}>
          {portfolioItem.title}
        </Typography>

        <Box sx={{ gridColumn: { md: "3" } }}>
          <SectionDescription description={portfolioItem.text} />
        </Box>
      </Box>

      {details.length > 0 && (
        <Box
          sx={(theme) => ({
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: `repeat(${details.length}, 1fr)` },
            gap: { xs: 3, sm: "40px" },
            pt: { xs: 3, md: 4 },
            borderTop: `1px solid ${theme.palette.surfaces.border}`,
          })}
        >
          {details.map((detail) => (
            <Box key={detail.label} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="caption" sx={{ opacity: 0.6 }}>
                {detail.label}
              </Typography>
              <Typography variant="body1">{detail.value}</Typography>
            </Box>
          ))}
        </Box>
      )}

      <ShareActions title={portfolioItem.title} />

      {relatedItemIds.length > 0 && <RelatedProjects projectIds={relatedItemIds} />}
    </Box>
  );
}
