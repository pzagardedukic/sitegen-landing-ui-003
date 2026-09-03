"use client";

import { getBlogItems } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import { Box, Divider, Typography } from "@mui/material";
import HoverZoomImage from "@/components/image/HoverZoomImage";
import { useRouter } from "next/navigation";
import { getBlogTranslation } from "@/core/translations";
import { getBlogSlugById, getPageSlugByKey } from "@/core/static";

type LatestPostsProps = {
  excludeId?: number;
  count?: number;
};

export default function LatestPosts({ excludeId, count }: LatestPostsProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const blogTranslations = getBlogTranslation(lang);

  const handlePostClick = (postId: number) => {
    router.push(`/${getPageSlugByKey("blog")}/${getBlogSlugById(postId)}`);
  };

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}
    >
      {/* h5, not the section scale: this is a 320 sidebar and h3 shouted over the article. */}
      <Typography variant="h5" component="h2" sx={{ color: "text.primary" }}>
        {blogTranslations.posts.latestPosts}
      </Typography>

      <Divider />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        {getBlogItems(lang)
          .filter((post) => post.id !== excludeId)
          .slice(0, count ?? 5)
          .map((post) => (
            <Box
              key={post.id}
              className="zoom-image-parent"
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                alignItems: "center",
                justifyContent: "flex-start",
                cursor: "pointer",
                "&:hover .MuiTypography-root": { color: "primary.main" },
              }}
              onClick={() => {
                handlePostClick(post.id);
              }}
            >
              {/* Image */}
              <HoverZoomImage
                src={post.image}
                alt={post.title}
                loading="lazy"
                zoomOnParentHover
                width="90px"
                sx={{ flexShrink: 0, height: "70px", borderRadius: "16px" }}
              />
              <Typography
                key={post.id}
                variant="body2"
                sx={{
                  color: "text.primary",
                  transition: (theme) => theme.transitions.create(["color"]),
                }}
              >
                {post.title}
              </Typography>
            </Box>
          ))}
      </Box>
    </Box>
  );
}
