"use client";

import Marquee from "react-fast-marquee";
import { Box } from "@mui/material";

export type ClientLogo = {
  src: string;
  href: string;
};

type ClientLogoSliderProps = {
  clients: ClientLogo[];
  speed?: number;
};

/*
 * The partner strip from the Figma frame: logos 216 wide with a 24 gutter, scrolling past,
 * and the section background fading in over the last 173px at each end so the row appears
 * to run out of the page rather than stopping at a hard edge.
 *
 * ui-001 put the strip on a raised white panel with a drop shadow. There is no panel in the
 * design — the logos sit straight on the page.
 */
export default function ClientLogoSlider({
  clients,
  speed = 30,
}: ClientLogoSliderProps) {
  if (clients.length === 0) return null;

  return (
    <Box sx={{ position: "relative", overflow: "hidden", py: { xs: 4, md: 6 } }}>
      <Marquee speed={speed} gradient={false} autoFill pauseOnHover>
        {clients.map((client, index) => (
          <Box
            key={`${client.src}-${index}`}
            {...(client.href
              ? {
                  component: "a",
                  href: client.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                }
              : {})}
            sx={{
              width: 216,
              /*
               * Without this the logo shrinks to fit the flex row that Marquee builds.
               * autoFill sizes the copies from the measured width of one group, so a
               * shrinking group asks for more copies, which shrink further: the strip
               * grew past 32000 <img> elements at 1440 and froze the page.
               */
              flexShrink: 0,
              mr: "24px",
              display: "grid",
              placeItems: "center",
              textDecoration: "none",
            }}
          >
            <Box
              component="img"
              src={client.src}
              alt=""
              loading="lazy"
              sx={{
                maxWidth: "100%",
                height: 120,
                objectFit: "contain",
                filter: "grayscale(1)",
                opacity: 0.65,
                transition: "opacity .2s ease, filter .2s ease",
                "a:hover &": { filter: "none", opacity: 1 },
              }}
            />
          </Box>
        ))}
      </Marquee>

      {/* Fades at both ends, painted in the page background. */}
      {["left", "right"].map((side) => (
        <Box
          key={side}
          aria-hidden
          sx={(theme) => ({
            position: "absolute",
            top: 0,
            bottom: 0,
            [side]: 0,
            width: { xs: 60, md: 173 },
            pointerEvents: "none",
            background: `linear-gradient(to ${side === "left" ? "right" : "left"}, ${
              theme.palette.background.default
            }, transparent)`,
          })}
        />
      ))}
    </Box>
  );
}
