import * as React from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { getContacts } from "@/core/runtime";
import { Web } from "@mui/icons-material";

function TikTokIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M21 8.5a6.5 6.5 0 0 1-4-1.36v6.12a6.26 6.26 0 1 1-6.26-6.26c.3 0 .6.03.89.08v3.18a3.11 3.11 0 1 0 2.22 2.98V2h3.19a6.47 6.47 0 0 0 4.96 4.93V8.5z" />
    </SvgIcon>
  );
}

export interface FooterSocialsProps {
  /** Adjust icon color (CSS color, hex, theme var, etc.) */
  color?: string;

  /** Icon size in pixels */
  size?: number;

  /** Gap between icons */
  gap?: number;

  /** Layout direction */
  direction?: "row" | "column";

  /** Link target behavior */
  target?: "_blank" | "_self" | "_parent" | "_top";
}

/** Social icon bar for footer use */
export default function FooterSocials({
  color = "inherit",
  size = 22,
  gap = 8,
  direction = "row",
  target = "_blank",
}: FooterSocialsProps) {
  const contacts = getContacts();

  const icons = [
    {
      name: "Facebook",
      url: contacts.find((c) => c.type === "FACEBOOK")?.value,
      icon: <FacebookIcon />,
    },
    {
      name: "Twitter",
      url: contacts.find((c) => c.type === "TWITTER")?.value,
      icon: <TwitterIcon />,
    },
    {
      name: "Instagram",
      url: contacts.find((c) => c.type === "INSTAGRAM")?.value,
      icon: <InstagramIcon />,
    },
    {
      name: "LinkedIn",
      url: contacts.find((c) => c.type === "LINKEDIN")?.value,
      icon: <LinkedInIcon />,
    },
    {
      name: "TikTok",
      url: contacts.find((c) => c.type === "TIKTOK")?.value,
      icon: <TikTokIcon />,
    },
    {
      name: "Website",
      url: contacts.find((c) => c.type === "WEBSITE")?.value,
      icon: <Web />,
    },
  ].filter((item) => !!item.url);

  if (icons.length === 0) return null;

  return (
    <Stack
      direction={direction}
      spacing={0}
      sx={{
        gap,
        color,
        "& .MuiIconButton-root": { color: "currentColor" },
        "& .MuiSvgIcon-root": { fontSize: size },
        "& .MuiIconButton-root:hover": { opacity: 0.85 },
      }}
    >
      {icons.map(({ name, url, icon }) => (
        <Tooltip title={name} key={name}>
          <IconButton
            component="a"
            href={url}
            target={target}
            rel="noopener noreferrer"
            aria-label={name}
          >
            {icon}
          </IconButton>
        </Tooltip>
      ))}
    </Stack>
  );
}
