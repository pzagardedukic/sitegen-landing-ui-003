import { stripRichText, TextStyling, truncateWordSafe } from "@/core/utils";
import Typography from "@mui/material/Typography";
import RichText from "./RichText";
import { memo } from "react";

type SectionDescriptionProps = {
  description: string;
  textAlign?: "center" | "left" | "right";
  highContrast?: boolean;
  maxChars?: number;
  isRichText?: boolean;
  allowStyling?: TextStyling;
};

function SectionDescription({
  description,
  textAlign = "left",
  highContrast = false,
  maxChars,
  isRichText = true,
  allowStyling = {
    newLine: true,
    bold: true,
    italic: true,
    underline: true,
  },
}: SectionDescriptionProps) {
  const cleaned = stripRichText(description, allowStyling);
  const truncated = maxChars ? truncateWordSafe(cleaned, maxChars) : cleaned;

  return (
    <Typography
      component="div"
      variant="body1"
      textAlign={textAlign}
      /*
       * Inherit the colour and step it back with opacity instead of pinning a grey. Several
       * sections render over a photograph and set white on their container; a fixed
       * text.secondary turns unreadable there.
       */
      sx={{
        overflow: "hidden",
        color: highContrast ? "common.white" : "inherit",
        opacity: highContrast ? 0.9 : 0.72,
      }}
    >
      {isRichText && !maxChars ? (
        <RichText text={description} allowStyling={allowStyling} />
      ) : (
        truncated
      )}
    </Typography>
  );
}

export default memo(SectionDescription);
