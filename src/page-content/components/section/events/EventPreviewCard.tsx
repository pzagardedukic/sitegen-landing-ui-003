import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Typography } from "@mui/material";
import Tag from "@/components/common/Tag";

import HoverZoomImage from "@/components/image/HoverZoomImage";
import type { LanguageKey } from "@/core/types";
import { formatEventDate, getRelativeEventDay } from "@/core/utils";
import { FALLBACK_IMAGE } from "@/core/static";
import { stripRichText, truncateWordSafe } from "@/core/utils";

type EventPreviewCardProps = {
  image: string;
  title: string;
  text: string;
  date: string;
  location: string;
  category: string;
  isCancelled: boolean;
  cancelledLabel: string;
  todayLabel: string;
  tomorrowLabel: string;
  lang: LanguageKey | null;
};

export default function EventPreviewCard({
  image,
  title,
  text,
  date,
  location,
  category,
  isCancelled,
  cancelledLabel,
  todayLabel,
  tomorrowLabel,
  lang,
}: EventPreviewCardProps) {
  const truncatedText = stripRichText(truncateWordSafe(text, 150));
  const formattedDate = formatEventDate(date, lang);
  const relativeDay = getRelativeEventDay(date);
  const relativeDayLabel =
    relativeDay === "today"
      ? todayLabel
      : relativeDay === "tomorrow"
        ? tomorrowLabel
        : "";

  return (
    <Box
      className="zoom-image-parent"
      sx={(theme) => ({
        position: "relative",
        borderRadius: "25px",
        border: `1px solid ${theme.palette.surfaces.border}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        opacity: isCancelled ? 0.82 : 1,
        transition: theme.transitions.create(["border-color"]),
        "&:hover": { borderColor: theme.palette.primary.main },
      })}
    >
      {(isCancelled || relativeDayLabel) && (
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 1,
          }}
        >
          {isCancelled && (
            <Tag label={cancelledLabel} tone="outline" />
          )}

          {relativeDayLabel && (
            <Tag
              label={relativeDayLabel}
              tone={relativeDay === "today" ? "brand" : "neutral"}
            />
          )}
        </Box>
      )}

      <HoverZoomImage
        src={image || FALLBACK_IMAGE}
        alt={title}
        loading="lazy"
        zoomOnParentHover
        sx={{
          width: "100%",
          height: 210,
          objectFit: "cover",
        }}
      />

      <Box px={2.5} py={2.5} flexGrow={1}>
        {category && (
          <Typography
            variant="overline"
            color="primary.main"
            sx={{ display: "block", lineHeight: 1.4, mb: 0.5 }}
          >
            {category}
          </Typography>
        )}

        <Typography variant="h6" color="text.primary">
          {title}
        </Typography>

        {truncatedText && (
          <Typography variant="body2" color="text.secondary" mt={1}>
            {truncatedText}
          </Typography>
        )}
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        gap={1}
        px={2.5}
        py={2}
        borderTop="1px solid"
        borderColor="divider"
        mt="auto"
      >
        {formattedDate && (
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarMonthIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {formattedDate}
            </Typography>
          </Box>
        )}

        {location && (
          <Box display="flex" alignItems="center" gap={1}>
            <LocationOnIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {location}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
