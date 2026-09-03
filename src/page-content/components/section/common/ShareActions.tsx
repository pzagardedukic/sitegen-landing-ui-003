"use client";

import { Box, IconButton, Tooltip } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X"; // MUI X (Twitter)
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useLanguage } from "@/core/runtime";
import { getButtonTranslation } from "@/core/translations";

type ShareActionsProps = {
  url?: string;
  title?: string;
};

export default function ShareActions({
  url = typeof window !== "undefined" ? window.location.href : "",
  title = "",
}: ShareActionsProps) {
  const { lang } = useLanguage();
  const buttonTranslations = getButtonTranslation(lang);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
  };

  return (
    <Box display="flex" gap={1}>
      <Tooltip title={`${buttonTranslations.shareOn} Facebook`}>
        <IconButton
          component="a"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={circleStyle}
        >
          <FacebookIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title={`${buttonTranslations.shareOn} X`}>
        <IconButton
          component="a"
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={circleStyle}
        >
          <XIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title={`${buttonTranslations.shareOn} LinkedIn`}>
        <IconButton
          component="a"
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={circleStyle}
        >
          <LinkedInIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title={buttonTranslations.copyLink}>
        <IconButton onClick={handleCopy} sx={circleStyle}>
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

/* Same border token as the back button and the cards, so the detail footer reads as one row. */
const circleStyle: SxProps<Theme> = (theme) => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: `1px solid ${theme.palette.surfaces.border}`,
  color: theme.palette.text.secondary,
  transition: theme.transitions.create(["border-color", "color"]),
  "&:hover": {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
});
