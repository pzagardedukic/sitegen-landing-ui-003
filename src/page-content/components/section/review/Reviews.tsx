"use client";

import { Box, useMediaQuery, useTheme } from "@mui/material";
import ReviewCard from "./ReviewCard";
import { getReviewItems } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";

/*
 * The Figma lays reviews out as a three-column mosaic with a 30px gutter, each column
 * splitting its height differently — 300/240, 240/300, 270/270. ui-001 scrolled them past
 * in a marquee instead, which meant a visitor could not read one without chasing it.
 *
 * The heights are minimums here rather than fixed: the frame allots a single line to the
 * review body, which is wireframe sizing, and a real review runs longer.
 */
const HEIGHTS: Record<number, number[][]> = {
  1: [[270]],
  2: [
    [300, 240],
    [240, 300],
  ],
  3: [
    [300, 240],
    [240, 300],
    [270, 270],
  ],
};

export default function Reviews() {
  const { lang } = useLanguage();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isTablet = useMediaQuery(theme.breakpoints.up("sm"));
  const columnCount = isDesktop ? 3 : isTablet ? 2 : 1;

  const reviewItems = getReviewItems(lang);
  if (reviewItems.length === 0) return null;

  const columns: (typeof reviewItems)[] = Array.from(
    { length: columnCount },
    () => [],
  );
  reviewItems.forEach((item, index) => {
    columns[index % columnCount].push(item);
  });

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: "30px",
        alignItems: "start",
      }}
    >
      {columns.map((column, columnIndex) => (
        <Box
          key={columnIndex}
          sx={{ display: "flex", flexDirection: "column", gap: "30px" }}
        >
          {column.map((item, position) => {
            const pattern = HEIGHTS[columnCount][columnIndex % HEIGHTS[columnCount].length];

            return (
              <ReviewCard
                key={`${item.title}-${position}`}
                minHeight={pattern[position % pattern.length]}
                review={{
                  text: item.text,
                  author: item.title,
                  url: item.url,
                  image: item.image,
                }}
              />
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
