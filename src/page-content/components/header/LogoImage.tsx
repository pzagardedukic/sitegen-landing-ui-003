"use client";

import { withBasePath } from "@/core/static";
import { Box } from "@mui/material";
import { memo } from "react";

interface LogoImageProps {
  imageSrc: string;
  name: string;
}

/*
 * The logo is hung on the AppBar rather than carried in the header row.
 *
 * In the row it inherited the content grid and started 144px in on a 1440 screen, which is
 * near the middle of the 350-wide notch drawn for it — the notch itself begins 20px from
 * the page edge. Position and size now come from the bar as --logo-x / --logo-y, so the
 * artwork sits where the notch is instead of where the text column happens to start.
 */
function LogoImage({ imageSrc, name }: LogoImageProps) {
  return (
    <Box
      component="a"
      href={withBasePath("/")}
      sx={(theme) => ({
        position: "fixed",
        left: "var(--logo-x, 16px)",
        top: "var(--logo-y, 36px)",
        transform: "translateY(-50%)",
        display: "flex",
        alignItems: "center",
        transition: theme.transitions.create(["top"], {
          duration: theme.transitions.duration.short,
        }),
      })}
    >
      {/*
        Sized in pixels, not as a percentage of the bar.
        A logo is customer-supplied artwork of unknown proportions — the demo data ships
        a 1536x540 image — so a percentage height only works while some ancestor happens to
        have a resolved height. Capping both dimensions keeps any logo inside the notch:
        at md the notch is 350x102 and the artwork lands at 171x60.
      */}
      <Box
        component="img"
        src={imageSrc}
        alt={`${name} Logo`}
        sx={(theme) => ({
          height: { xs: 36, sm: 44, md: 60 },
          maxWidth: { xs: 140, sm: 200, md: 280 },
          width: "auto",
          objectFit: "contain",
          objectPosition: "left center",
          /*
           * White once the bar is a dark slab behind it. The value comes from the bar as
           * `--logo-filter`, because the artwork is a customer file of unknown colour and
           * nothing here can know whether it would still be legible.
           */
          filter: "var(--logo-filter, none)",
          transition: theme.transitions.create(["opacity", "filter"], {
            duration: theme.transitions.duration.short,
          }),
          "&:hover": { opacity: 0.8 },
        })}
      />
    </Box>
  );
}

export default memo(LogoImage);
