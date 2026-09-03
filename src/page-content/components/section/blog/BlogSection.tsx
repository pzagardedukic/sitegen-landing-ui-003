"use client";

import { Box } from "@mui/material";
import { getBlogItems } from "@/core/runtime";
import BlogPreviewCard from "./BlogPreviewCard";
import { useLanguage } from "@/core/runtime";
import { usePagination } from "@/core/react";
import PaginationControls from "@/components/button/PaginationControls";
import { getBlogSlugById } from "@/core/static";
import { withBasePath } from "@/core/static";

export default function BlogSection() {
  const { lang } = useLanguage();

  const blogItems = getBlogItems(lang);
  const { page, setPage, pageCount, paginatedItems } = usePagination(
    blogItems,
    6,
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 5, md: 8 } }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {paginatedItems.map((item) => (
          <BlogPreviewCard
            key={item.id}
            image={item.image}
            title={item.title}
            text={item.description}
            author={item.author}
            date={item.date}
            href={withBasePath(`/blog/${getBlogSlugById(item.id)}`)}
          />
        ))}
      </Box>

      {pageCount > 1 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <PaginationControls
            page={page}
            pageCount={pageCount}
            onChange={setPage}
          />
        </Box>
      )}
    </Box>
  );
}
