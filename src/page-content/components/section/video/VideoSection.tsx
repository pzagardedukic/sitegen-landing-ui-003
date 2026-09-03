"use client";

import { Box, Typography } from "@mui/material";
import { getVideoSection } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import { getVideosTranslation } from "@/core/translations";
import VideoThumbnail from "./VideoThumbnail";

/* Figma frame 1440x1037: a title, then tiles two across the 1200 grid with a 40 gutter. */
export default function VideoSection() {
  const { lang } = useLanguage();
  const videosTranslation = getVideosTranslation(lang);
  const videoSection = getVideoSection();

  if (!videoSection || videoSection.items.length === 0) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 4, md: 5 } }}>
      <Typography variant="h2" component="h2">
        {videosTranslation.title}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: "40px",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
        }}
      >
        {videoSection.items.map((url: string, index: number) => (
          <VideoThumbnail key={index} videoUrl={url} />
        ))}
      </Box>
    </Box>
  );
}
