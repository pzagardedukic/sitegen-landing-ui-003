"use client";

import { Box, Typography } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { getBlogItems, getBlogSection } from "@/core/runtime";
import BlogPreviewCard from "./BlogPreviewCard";
import { useLanguage } from "@/core/runtime";
import { getBlogTranslation } from "@/core/translations";
import GradientButton from "@/components/button/GradientButton";
import { getBlogSlugById, getPageSlugByKeyWithBasePath } from "@/core/static";

/*
 * Figma frame: title and standfirst on the left at 700 wide, the call to action on the right,
 * then the posts as full-width rows underneath.
 */
export default function BlogPreviewSection() {
  const { lang } = useLanguage();
  const blogTranslation = getBlogTranslation(lang);

  const blogSection = getBlogSection(lang);
  if (!blogSection) {
    return null;
  }
  const blogItems = getBlogItems(lang).slice(0, 3); // Show only 3 preview items

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 5, md: 8 } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "flex-start" },
          justifyContent: "space-between",
          gap: { xs: 3, md: 6 },
        }}
      >
        <Box sx={{ maxWidth: 700, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h2" component="h2">
            {blogTranslation.title}
          </Typography>

          <Typography variant="body1" sx={{ color: "inherit", opacity: 0.72 }}>
            {blogSection.text}
          </Typography>
        </Box>

        <GradientButton
          href={getPageSlugByKeyWithBasePath("blog")}
          endIcon={<ArrowOutwardIcon />}
          sx={{ flexShrink: 0 }}
        >
          {blogTranslation.callToAction}
        </GradientButton>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {blogItems.map((item) => (
          <BlogPreviewCard
            key={item.id}
            image={item.image}
            title={item.title}
            text={item.description}
            author={item.author}
            date={item.date}
            href={`${getPageSlugByKeyWithBasePath("blog")}/${getBlogSlugById(item.id)}`}
          />
        ))}
      </Box>
    </Box>
  );
}
