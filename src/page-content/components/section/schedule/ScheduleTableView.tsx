"use client";

import { Box, Typography } from "@mui/material";

type ScheduleTableViewProps = {
  title: string;
  text: string;
  rows: string[][];
};

/*
 * A timetable from the Figma frame: the table title and a line about it, then the rows —
 * the first one being the header, set apart by weight and a rule rather than by a filled bar.
 *
 * Built as a grid rather than a <table> so a row can reflow to two lines on a phone instead
 * of forcing a horizontal scroll.
 */
export default function ScheduleTableView({
  title,
  text,
  rows,
}: ScheduleTableViewProps) {
  const columnCount = rows.reduce((count, row) => Math.max(count, row.length), 0);
  const headerCells = rows[0] ?? [];
  const bodyRows = rows.slice(1);

  if (columnCount === 0) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {title && (
        <Typography variant="h4" component="h3">
          {title}
        </Typography>
      )}

      {text && (
        <Typography variant="body2" sx={{ opacity: 0.72, maxWidth: 900 }}>
          {text}
        </Typography>
      )}

      <Box
        role="table"
        sx={(theme) => ({
          mt: 1,
          borderRadius: "25px",
          border: `1px solid ${theme.palette.surfaces.border}`,
          overflow: "hidden",
        })}
      >
        <Box
          role="row"
          sx={(theme) => ({
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              md: `repeat(${columnCount}, 1fr)`,
            },
            gap: 2,
            px: "24px",
            py: 2,
            backgroundColor: theme.palette.surfaces.tint,
            borderBottom: `1px solid ${theme.palette.surfaces.border}`,
          })}
        >
          {headerCells.map((cell, index) => (
            <Typography
              key={index}
              role="columnheader"
              variant="caption"
              sx={{ opacity: 0.6, letterSpacing: "0.4px" }}
            >
              {cell}
            </Typography>
          ))}
        </Box>

        {bodyRows.map((row, rowIndex) => (
          <Box
            key={rowIndex}
            role="row"
            sx={(theme) => ({
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                md: `repeat(${columnCount}, 1fr)`,
              },
              gap: 2,
              px: "24px",
              py: 2,
              ...(rowIndex < bodyRows.length - 1 && {
                borderBottom: `1px solid ${theme.palette.surfaces.border}`,
              }),
            })}
          >
            {row.map((cell, cellIndex) => (
              <Typography key={cellIndex} role="cell" variant="body2">
                {cell}
              </Typography>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
