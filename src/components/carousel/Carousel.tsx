"use client";

import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardRounded";
import { useCallback, useEffect, useRef, useState } from "react";

type CarouselProps = {
  items: React.ReactNode[];
  /** Slides visible at once. Design system: two on desktop, one full-width on mobile. */
  perView?: { mobile: number; desktop: number };
  gap?: number;
  ariaLabel?: string;
  /**
   * Relative widths of the visible slides, cycled across the track. The about carousel is
   * drawn as an unequal pair (740 / 428 of 1200), so it passes [0.633, 0.367]; leaving this
   * out gives equal columns. Only used at the desktop count.
   */
  weights?: number[];
};

/*
 * Scroll-snap based rather than JS-animated: touch dragging, momentum and keyboard
 * scrolling then come from the browser, and there is no state to fall out of sync when
 * the slide count changes with the data.
 *
 * Controls follow the design system — arrows bottom-left, dots bottom-right, both in one
 * row under the slides. Mobile shows a single full-width slide with no peek of the next.
 */
export default function Carousel({
  items,
  perView = { mobile: 1, desktop: 2 },
  gap = 24,
  ariaLabel,
  weights,
}: CarouselProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const visible = isDesktop ? perView.desktop : perView.mobile;

  /*
   * grid-auto-columns takes a list and cycles it, which is what makes an unequal pair
   * possible without tracking slide indices: each cycle still adds up to one page width,
   * so scroll-snap paging by clientWidth keeps working unchanged.
   */
  const usableWeights =
    isDesktop && weights && weights.length === visible ? weights : null;

  const track = `calc(100% - ${(visible - 1) * gap}px)`;

  const autoColumns = usableWeights
    ? usableWeights.map((w) => `calc(${track} * ${w})`).join(" ")
    : `calc(${track} / ${visible})`;

  const trackRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);

  const pageCount = Math.max(1, Math.ceil(items.length / visible));

  const syncPage = useCallback(() => {
    const node = trackRef.current;
    if (!node) return;

    const width = node.clientWidth || 1;
    setPage(Math.round(node.scrollLeft / width));
  }, []);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;

    node.addEventListener("scroll", syncPage, { passive: true });
    syncPage();

    return () => node.removeEventListener("scroll", syncPage);
  }, [syncPage, visible]);

  const goTo = (target: number) => {
    const node = trackRef.current;
    if (!node) return;

    const clamped = Math.min(Math.max(target, 0), pageCount - 1);

    node.scrollTo({ left: clamped * node.clientWidth, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  const showControls = items.length > visible;

  return (
    <Box aria-roledescription="carousel" aria-label={ariaLabel}>
      <Box
        ref={trackRef}
        sx={{
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: autoColumns,
          gap: `${gap}px`,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {items.map((item, index) => (
          <Box key={index} sx={{ scrollSnapAlign: "start", minWidth: 0 }}>
            {item}
          </Box>
        ))}
      </Box>

      {showControls && (
        <Box
          sx={{
            mt: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              onClick={() => goTo(page - 1)}
              disabled={page === 0}
              aria-label="Prejšnje"
              sx={(t) => ({
                border: `1px solid ${t.palette.surfaces.border}`,
                color: t.palette.text.primary,
              })}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>

            <IconButton
              onClick={() => goTo(page + 1)}
              disabled={page >= pageCount - 1}
              aria-label="Naslednje"
              sx={(t) => ({
                border: `1px solid ${t.palette.surfaces.border}`,
                color: t.palette.text.primary,
              })}
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {Array.from({ length: pageCount }).map((_, index) => (
              <Box
                key={index}
                component="button"
                type="button"
                aria-label={`Stran ${index + 1}`}
                aria-current={index === page}
                onClick={() => goTo(index)}
                sx={(t) => ({
                  cursor: "pointer",
                  border: 0,
                  padding: 0,
                  height: 4,
                  width: index === page ? 28 : 12,
                  borderRadius: 999,
                  transition: t.transitions.create(["width", "background-color"]),
                  backgroundImage:
                    index === page ? t.palette.brandGradient : "none",
                  backgroundColor:
                    index === page ? "transparent" : t.palette.surfaces.border,
                })}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
