"use client";

import { Box, Typography } from "@mui/material";
import Carousel from "@/components/carousel/Carousel";

export type ImageCarouselItem = {
  image: string;
  text: string;
};

type ImageCarouselProps = {
  items: ImageCarouselItem[];
};

/*
 * The about carousel from the Figma frame: slides 470 tall with the item's copy over the
 * photograph in a bottom band. Desktop shows an unequal pair — 740 and 428 of a 1200 track
 * — and mobile one slide with no peek of the next.
 *
 * The frame also draws a small label at the top of each slide, but nothing in the data
 * feeds it (items carry only an image and a text), so it is left out rather than invented.
 */
export default function ImageCarousel({ items }: ImageCarouselProps) {
  if (items.length === 0) return null;

  const slides = items.map((item, index) => (
    <Box
      key={`${item.image}-${index}`}
      sx={(theme) => ({
        position: "relative",
        height: { xs: 380, sm: 430, md: 470 },
        borderRadius: "25px",
        overflow: "hidden",
        backgroundColor: theme.palette.surfaces.placeholder,
      })}
    >
      <Box
        component="img"
        src={item.image}
        alt=""
        loading="lazy"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {item.text && (
        <>
          <Box
            aria-hidden
            sx={(theme) => ({
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "55%",
              background: `linear-gradient(to top, ${theme.palette.surfaces.scrim}, transparent)`,
            })}
          />

          <Typography
            variant="body2"
            sx={{
              position: "absolute",
              left: { xs: 20, md: 28 },
              right: { xs: 20, md: 28 },
              bottom: { xs: 20, md: 28 },
              color: "common.white",
            }}
          >
            {item.text}
          </Typography>
        </>
      )}
    </Box>
  ));

  return (
    <Carousel
      items={slides}
      perView={{ mobile: 1, desktop: 2 }}
      weights={[0.633, 0.367]}
      gap={32}
      ariaLabel="Galerija o nas"
    />
  );
}
