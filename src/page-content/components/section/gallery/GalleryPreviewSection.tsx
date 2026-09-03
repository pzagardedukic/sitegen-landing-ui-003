"use client";

import "photoswipe/style.css";
import { Box, Typography } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { getGalleryTranslation } from "@/core/translations";
import { useLanguage } from "@/core/runtime";
import { getGalleryItems } from "@/core/runtime";
import { CustomGallery } from "../common/CustomGallery";
import GradientButton from "@/components/button/GradientButton";
import { getPageSlugByKeyWithBasePath } from "@/core/static";
import { useIsMobileDevice } from "@/hooks/useIsMobileDevice";

/*
 * The Figma frame gives this section a plain left-aligned title — no description column —
 * then the mosaic, then a footer row with the call to action on the left.
 */
export default function GallerySection() {
  const isMobile = useIsMobileDevice();
  const { lang } = useLanguage();
  const galleryTranslation = getGalleryTranslation(lang);

  const galleryItems = getGalleryItems().slice(0, isMobile ? 3 : 6);

  if (galleryItems.length === 0) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 5, md: 8 } }}>
      <Typography variant="h2" component="h2">
        {galleryTranslation.title}
      </Typography>

      <CustomGallery items={galleryItems} />

      <Box>
        <GradientButton
          href={getPageSlugByKeyWithBasePath("gallery")}
          endIcon={<ArrowOutwardIcon />}
        >
          {galleryTranslation.callToAction}
        </GradientButton>
      </Box>
    </Box>
  );
}
