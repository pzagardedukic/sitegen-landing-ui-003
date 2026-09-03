"use client";

import { Box, IconButton, Typography } from "@mui/material";
import {
  LinkedIn,
  Instagram,
  Facebook,
  Twitter,
  Language,
  Phone,
  Email,
} from "@mui/icons-material";
import { JSX } from "react";
import { ContactType } from "@/core/runtime";

export interface ContactItem {
  type: ContactType;
  value: string;
}

export interface TeamCardProps {
  name: string;
  text: string;
  image: string;
  contact?: ContactItem[];
}

const iconMap: Record<ContactType, JSX.Element> = {
  EMAIL: <Email fontSize="small" />,
  PHONE: <Phone fontSize="small" />,
  LINKEDIN: <LinkedIn fontSize="small" />,
  INSTAGRAM: <Instagram fontSize="small" />,
  FACEBOOK: <Facebook fontSize="small" />,
  TWITTER: <Twitter fontSize="small" />,
  WEBSITE: <Language fontSize="small" />,
  TIKTOK: <Language fontSize="small" />,
};

const hrefFor = (item: ContactItem) => {
  if (item.type === "EMAIL") return `mailto:${item.value}`;
  if (item.type === "PHONE") return `tel:${item.value.replace(/\s+/g, "")}`;
  return item.value;
};

/*
 * A team member from the Figma frame (277x479): the portrait on top at 277x300, the contact
 * icons sitting on the picture itself in the lower-left corner, then the name and one line
 * about the person underneath.
 */
export default function TeamCard({ name, text, image, contact = [] }: TeamCardProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={(theme) => ({
          position: "relative",
          height: { xs: 320, md: 300 },
          borderRadius: "25px",
          overflow: "hidden",
          backgroundColor: theme.palette.surfaces.placeholder,
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

        {contact.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              left: 18,
              bottom: 18,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {contact.map((item) => (
              <IconButton
                key={`${item.type}-${item.value}`}
                component="a"
                href={hrefFor(item)}
                target={item.type === "EMAIL" || item.type === "PHONE" ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={item.type}
                size="small"
                sx={(theme) => ({
                  width: 34,
                  height: 34,
                  backgroundColor: "rgba(255,255,255,0.92)",
                  color: theme.palette.text.primary,
                  "&:hover": {
                    backgroundImage: theme.palette.brandGradient,
                    color: theme.palette.primary.contrastText,
                  },
                })}
              >
                {iconMap[item.type]}
              </IconButton>
            ))}
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, px: 0.5 }}>
        <Typography variant="h4" component="h3">
          {name}
        </Typography>

        <Typography variant="body2" sx={{ color: "inherit", opacity: 0.72 }}>
          {text}
        </Typography>
      </Box>
    </Box>
  );
}
