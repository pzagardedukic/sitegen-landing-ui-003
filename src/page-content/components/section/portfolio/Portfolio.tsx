"use client";

import { getPortfolioItems, getPortfolioSection } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import { getButtonTranslation } from "@/core/translations";
import { Box } from "@mui/material";
import { useState } from "react";
import CategorySelector from "../common/CategorySelector";
import PortfolioPreviewCard from "./PortfolioPreviewCard";
import { usePagination } from "@/core/react";
import PaginationControls from "@/components/button/PaginationControls";
import { getPageSlugByKey, getPortfolioSlugById } from "@/core/static";
import { withBasePath } from "@/core/static";

type PortfolioProps = {
  maxCnt?: number;
};

export default function Portfolio({ maxCnt }: PortfolioProps) {
  const { lang } = useLanguage();
  const buttonTranslation = getButtonTranslation(lang);

  const portfolioSection = getPortfolioSection(lang);
  const portfolioItems = getPortfolioItems(lang);
  const categories = portfolioSection?.categories ?? [];

  // Store selected category index (0 = "All")
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  // Compute selected category value (undefined means "All")
  const selectedCategory =
    selectedIndex === 0 ? undefined : categories[selectedIndex - 1];
  const filteredItems = selectedCategory
    ? portfolioItems.filter((item) => item.category.includes(selectedCategory))
    : portfolioItems;

  // We don't want pagination if maxCnt is set
  const { page, setPage, pageCount, paginatedItems, resetPage } = usePagination(
    filteredItems,
    6,
  );
  const displayedItems = maxCnt
    ? filteredItems.slice(0, maxCnt)
    : paginatedItems;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 4, md: 6 } }}>
      {/* Filters sit on the left margin, not centred — see the Figma frame. */}
      <CategorySelector
        categories={categories}
        selectedIndex={selectedIndex}
        onSelectIndex={(index) => {
          setSelectedIndex(index);
          resetPage();
        }}
      />

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
        {displayedItems.map((item) => (
          <PortfolioPreviewCard
            key={item.id}
            title={item.title}
            text={item.text}
            image={item.images[0]}
            category={item.category}
            client={item.client}
            openLabel={buttonTranslation.learnMore}
            href={withBasePath(
              `/${getPageSlugByKey("portfolio")}/${getPortfolioSlugById(item.id)}`,
            )}
          />
        ))}
      </Box>

      {!maxCnt && pageCount > 1 && (
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
