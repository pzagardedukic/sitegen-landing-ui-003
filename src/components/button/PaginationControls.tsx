"use client";

import { Box, Typography } from "@mui/material";

interface PaginationControlsProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}

/*
 * Pagination as the design draws it: a small label with the position, and a row of dashes
 * underneath where the current page is the long one. ui-001 used MUI's numbered Pagination,
 * which is a stock control and reads as a different design language from everything else.
 */
export default function PaginationControls({
  page,
  pageCount,
  onChange,
}: PaginationControlsProps) {
  if (pageCount <= 1) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 1,
      }}
    >
      <Typography variant="caption" sx={{ color: "inherit", opacity: 0.7 }}>
        {page} / {pageCount}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {Array.from({ length: pageCount }).map((_, index) => {
          const current = index + 1 === page;

          return (
            <Box
              key={index}
              component="button"
              type="button"
              aria-label={`Stran ${index + 1}`}
              aria-current={current}
              onClick={() => onChange(index + 1)}
              sx={(theme) => ({
                cursor: "pointer",
                border: 0,
                padding: 0,
                height: 3,
                width: current ? 34 : 24,
                borderRadius: 999,
                transition: theme.transitions.create(["width", "opacity"]),
                backgroundImage: current
                  ? theme.palette.brandGradient
                  : "none",
                backgroundColor: current
                  ? "transparent"
                  : theme.palette.surfaces.border,
              })}
            />
          );
        })}
      </Box>
    </Box>
  );
}
