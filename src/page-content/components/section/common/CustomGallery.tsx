"use client";

import React from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/style.css";
import HoverZoomImage from "@/components/image/HoverZoomImage";

type CustomGalleryProps = {
  items: string[];
  currentPageItems?: string[];
  /**
   * "mosaic" is the section layout from the Figma frame. "strip" is the plain row of equal
   * thumbnails used on item detail pages, where the pictures all belong to one project or
   * product and the mosaic rhythm would fight the page around it.
   */
  variant?: "mosaic" | "strip";
  thumbSize?: number;
};

type ImgSize = { w: number; h: number };

/*
 * The gallery mosaic from the Figma frame: three columns on a 1200 grid with a 40px gutter,
 * where each column splits its height differently — 380/260, 260/380, 320/320. That is what
 * gives the block its rhythm; a uniform grid of equal tiles reads as a contact sheet.
 *
 * Items are distributed down the columns rather than across the rows, so the pattern holds
 * whatever the item count.
 *
 * The frame also centres a label on each tile, but gallery items carry only an id and a
 * file — that label marks where a picture goes in the wireframe, it is not content.
 */
const HEIGHTS: Record<number, number[][]> = {
  1: [[320, 380, 260]],
  2: [
    [380, 260],
    [260, 380],
  ],
  3: [
    [380, 260],
    [260, 380],
    [320, 320],
  ],
};

export const CustomGallery = ({
  items,
  currentPageItems,
  variant = "mosaic",
  thumbSize = 160,
}: CustomGalleryProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isTablet = useMediaQuery(theme.breakpoints.up("sm"));
  const columnCount = isDesktop ? 3 : isTablet ? 2 : 1;

  const [sizes, setSizes] = React.useState<Record<string, ImgSize>>({});

  React.useEffect(() => {
    let cancelled = false;

    const missing = items.filter((src) => !sizes[src]);
    if (!missing.length) return;

    missing.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;

        setSizes((prev) => ({
          ...prev,
          [src]: {
            w: img.naturalWidth,
            h: img.naturalHeight,
          },
        }));
      };
      img.src = src;
    });

    return () => {
      cancelled = true;
    };
  }, [items, sizes]);

  const visibleSet = new Set(currentPageItems ?? items);

  // Only laid-out items count towards the column pattern, so a paginated page keeps
  // the same shape as a full one.
  const laidOut = items.filter((src) => visibleSet.has(src) && sizes[src]);

  const columns: string[][] = Array.from({ length: columnCount }, () => []);
  laidOut.forEach((src, index) => {
    columns[index % columnCount].push(src);
  });

  const heightFor = (column: number, position: number) => {
    const pattern = HEIGHTS[columnCount][column % HEIGHTS[columnCount].length];
    return pattern[position % pattern.length];
  };

  if (variant === "strip") {
    return (
      <Gallery options={{ loop: true, wheelToZoom: true }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {laidOut.map((src, position) => {
            const size = sizes[src];

            return (
              <Item
                key={`${src}-${position}`}
                original={src}
                thumbnail={src}
                width={size.w}
                height={size.h}
              >
                {({ ref, open }) => (
                  <HoverZoomImage
                    ref={ref}
                    src={src}
                    alt={`Gallery Image ${position + 1}`}
                    onClick={open}
                    width={thumbSize}
                    sx={{ height: thumbSize, borderRadius: "16px", display: "block" }}
                  />
                )}
              </Item>
            );
          })}
        </Box>
      </Gallery>
    );
  }

  return (
    <Gallery options={{ loop: true, wheelToZoom: true }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          gap: "40px",
          alignItems: "start",
        }}
      >
        {columns.map((column, columnIndex) => (
          <Box
            key={columnIndex}
            sx={{ display: "flex", flexDirection: "column", gap: "40px" }}
          >
            {column.map((src, position) => {
              const size = sizes[src];
              const index = items.indexOf(src);

              return (
                <Item
                  key={`${src}-${position}`}
                  original={src}
                  thumbnail={src}
                  width={size.w}
                  height={size.h}
                >
                  {({ ref, open }) => (
                    <HoverZoomImage
                      ref={ref}
                      src={src}
                      alt={`Gallery Image ${index + 1}`}
                      onClick={open}
                      width="100%"
                      sx={{
                        height: heightFor(columnIndex, position),
                        borderRadius: "25px",
                        display: "block",
                      }}
                    />
                  )}
                </Item>
              );
            })}
          </Box>
        ))}
      </Box>
    </Gallery>
  );
};
