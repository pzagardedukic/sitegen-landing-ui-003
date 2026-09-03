"use client";

import { Box, Typography } from "@mui/material";

type ServiceCardProps = {
  image: string;
  title: string;
  text: string;
  features?: string[];
};

/*
 * A service is drawn as a photograph card, 560 tall, under the flat black overlay at 60 %,
 * with all copy in its lower half: title, a line of text, then the feature list with a
 * check in front of each.
 *
 * The frame also carries a small label top-left and a round open button top-right. Neither
 * is built: service items hold only title, text, features and an image, and there is no
 * per-service route for the button to lead to.
 */
export default function ServiceCard({
  image,
  title,
  text,
  features = [],
}: ServiceCardProps) {
  return (
    <Box
      sx={(theme) => ({
        position: "relative",
        height: { xs: 440, sm: 500, md: 560 },
        borderRadius: "25px",
        overflow: "hidden",
        backgroundColor: theme.palette.surfaces.placeholder,
        display: "flex",
      })}
    >
      <Box
        component="img"
        src={image}
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

      <Box
        aria-hidden
        sx={(theme) => ({
          position: "absolute",
          inset: 0,
          backgroundColor: theme.palette.surfaces.scrim,
        })}
      />

      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 2,
          p: "28px",
          color: "common.white",
          width: "100%",
        }}
      >
        <Typography variant="h4" component="h3">
          {title}
        </Typography>

        {text && (
          <Typography
            variant="body2"
            sx={{
              opacity: 0.9,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {text}
          </Typography>
        )}

        {features.length > 0 && (
          <Box
            component="ul"
            sx={{ listStyle: "none", display: "grid", gap: 1.25, mt: 0.5 }}
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                component="li"
                sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}
              >
                <Box
                  aria-hidden
                  sx={(theme) => ({
                    flexShrink: 0,
                    mt: "3px",
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    backgroundImage: theme.palette.brandGradient,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 11,
                    lineHeight: 1,
                    color: theme.palette.primary.contrastText,
                  })}
                >
                  ✓
                </Box>

                <Typography variant="body2">{feature}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
