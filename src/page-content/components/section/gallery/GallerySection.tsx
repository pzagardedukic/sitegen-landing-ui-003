"use client";

import "photoswipe/style.css";
import { Box } from "@mui/material";
import { CustomGallery } from "../common/CustomGallery";
import { getGalleryItems } from "@/core/runtime";
import PaginationControls from "@/components/button/PaginationControls";
import { usePagination } from "@/core/react";

export default function GallerySection() {
  const galleryItems = getGalleryItems();
  const { page, setPage, pageCount, paginatedItems } = usePagination(
    galleryItems,
    6,
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 5, md: 8 } }}>
      <CustomGallery items={galleryItems} currentPageItems={paginatedItems} />

      {pageCount > 1 && (
        /* Footer row: pagination sits on the right margin, as drawn. */
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
