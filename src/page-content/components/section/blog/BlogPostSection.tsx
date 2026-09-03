"use client";

import { getBlogItems } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import { Box, Typography } from "@mui/material";
import BackButton from "@/components/button/BackButton";
import SectionDescription from "../common/SectionDescription";
import LatestPosts from "./LatestPosts";
import { getBlogTranslation } from "@/core/translations";
import { useRouter } from "next/navigation";
import { getPageSlugByKey } from "@/core/static";
import ShareActions from "../common/ShareActions";

/*
 * Post detail from the Figma frame (1440x1819): a back button, then the article in a 760
 * column — date and author, the headline, the picture at 760x420, the text — with the latest
 * posts as a 320 sidebar beside it, and the share row on a rule at the bottom.
 */
export default function BlogPostSection({ id }: { id: number }) {
  const router = useRouter();
  const { lang } = useLanguage();
  const blogTranslations = getBlogTranslation(lang);

  const blog = getBlogItems(lang).find((item) => item.id === id);

  if (!blog) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 5, md: 7 } }}>
      <BackButton
        label={blogTranslations.posts.backToBlogs}
        onClick={() => router.push(`/${getPageSlugByKey("blog")}`)}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "760fr 120fr 320fr" },
          gap: { xs: 6, md: 0 },
          alignItems: "start",
        }}
      >
        <Box
          component="article"
          sx={{
            gridColumn: { md: "1" },
            display: "flex",
            flexDirection: "column",
            gap: { xs: 3, md: 4 },
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            {blog.date} · {blog.author}
          </Typography>

          <Typography variant="h2" component="h1">
            {blog.title}
          </Typography>

          <Box
            sx={(theme) => ({
              height: { xs: 240, sm: 340, md: 420 },
              borderRadius: "25px",
              overflow: "hidden",
              backgroundColor: theme.palette.surfaces.placeholder,
            })}
          >
            <Box
              component="img"
              src={blog.image}
              alt=""
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>

          <SectionDescription description={blog.description} />

          <Box
            sx={(theme) => ({
              pt: 3,
              borderTop: `1px solid ${theme.palette.surfaces.border}`,
            })}
          >
            <ShareActions title={blog.title} />
          </Box>
        </Box>

        <Box sx={{ gridColumn: { md: "3" } }}>
          <LatestPosts excludeId={id} count={5} />
        </Box>
      </Box>
    </Box>
  );
}
