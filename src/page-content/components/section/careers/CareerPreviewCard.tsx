"use client";

import { Box, Typography } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import GradientButton from "@/components/button/GradientButton";

import { stripRichText, truncateWordSafe } from "@/core/utils";

type CareerPreviewCardProps = {
  href: string;
  title: string;
  text: string;
  requirements: string[];
  requirementsLabel: string;
  applyLabel: string;
  onApply: () => void;
};

/*
 * A vacancy from the Figma frame (1200x241): the role, a line about it and the note on the
 * left at 600 wide, the requirements and the apply button on the right at 488.
 */
export default function CareerPreviewCard({
  href,
  title,
  text,
  requirements,
  requirementsLabel,
  applyLabel,
  onApply,
}: CareerPreviewCardProps) {
  const truncatedText = stripRichText(truncateWordSafe(text, 180));
  const previewRequirements = requirements.slice(0, 3);

  return (
    <Box
      sx={(theme) => ({
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "600fr 80fr 488fr" },
        gap: { xs: 3, md: 0 },
        p: { xs: "24px", md: "30px 32px" },
        borderRadius: "25px",
        border: `1px solid ${theme.palette.surfaces.border}`,
        transition: theme.transitions.create("border-color"),
        "&:hover": { borderColor: theme.palette.primary.main },
      })}
    >
      <Box
        sx={{
          gridColumn: { md: "1" },
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Typography
          component="a"
          href={href}
          variant="h4"
          sx={{ textDecoration: "none", color: "inherit", "&:hover": { opacity: 0.75 } }}
        >
          {title}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.72 }}>
          {truncatedText}
        </Typography>
      </Box>

      <Box
        sx={{
          gridColumn: { md: "3" },
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        {previewRequirements.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              {requirementsLabel}
            </Typography>

            <Box component="ul" sx={{ listStyle: "none", display: "grid", gap: 0.75 }}>
              {previewRequirements.map((requirement, index) => (
                <Box
                  key={index}
                  component="li"
                  sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}
                >
                  <Box
                    aria-hidden
                    sx={(theme) => ({
                      mt: "9px",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      flexShrink: 0,
                      backgroundImage: theme.palette.brandGradient,
                    })}
                  />
                  <Typography variant="body2">{requirement}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <GradientButton onClick={onApply} endIcon={<ArrowOutwardIcon />}>
          {applyLabel}
        </GradientButton>
      </Box>
    </Box>
  );
}
