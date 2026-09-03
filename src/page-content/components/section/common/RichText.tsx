import Box from "@mui/material/Box";
import { memo } from "react";
import type { TextStyling } from "@/core/utils";

type Props = {
  text: string;
  allowStyling: TextStyling;
};

function sanitizeRichText(text: string, allowStyling: TextStyling) {
  let result = text || "";

  if (!allowStyling.bold) {
    result = result.replace(/<\/?(strong|b)>/gi, "");
  }

  if (!allowStyling.italic) {
    result = result.replace(/<\/?(em|i)>/gi, "");
  }

  if (!allowStyling.underline) {
    result = result.replace(/<\/?u>/gi, "");
  }

  if (!allowStyling.newLine) {
    result = result
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/p>\s*<p>/gi, " ")
      .replace(/<\/div>\s*<div>/gi, " ")
      .replace(/<\/?p>/gi, "")
      .replace(/<\/?div>/gi, "");
  }

  return result;
}

function RichText({ text, allowStyling }: Props) {
  const html = sanitizeRichText(text, allowStyling);

  return (
    <Box
      sx={{
        "& p": {
          m: 0,
          mb: allowStyling.newLine ? 1 : 0,
        },
        "& p:last-of-type": {
          mb: 0,
        },
        "& strong, & b": {
          fontWeight: allowStyling.bold ? 700 : "inherit",
        },
        "& em, & i": {
          fontStyle: allowStyling.italic ? "italic" : "normal",
        },
        "& u": {
          textDecoration: allowStyling.underline ? "underline" : "none",
        },
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default memo(RichText);
