"use client";

import { Box, Typography } from "@mui/material";

type FilterOption = {
  value: string;
  label: string;
};

type FilterChipsProps = {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
};

/*
 * Category filters. The row wraps rather than scrolling out of view: in the wireframes the
 * mobile row ran 70 px past the frame and the last category was simply cut off, which reads
 * as a bug rather than as something scrollable.
 */
export default function FilterChips({
  options,
  value,
  onChange,
  ariaLabel,
}: FilterChipsProps) {
  if (options.length === 0) return null;

  return (
    <Box
      role="group"
      aria-label={ariaLabel}
      sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Box
            key={option.value}
            component="button"
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            sx={(theme) => ({
              cursor: "pointer",
              borderRadius: 999,
              px: 2,
              py: 1.25,
              transition: theme.transitions.create([
                "background-color",
                "border-color",
                "color",
              ]),
              ...(selected
                ? {
                    border: "1px solid transparent",
                    backgroundImage: theme.palette.brandGradient,
                    color: theme.palette.primary.contrastText,
                  }
                : {
                    border: `1px solid ${theme.palette.surfaces.border}`,
                    backgroundColor: "transparent",
                    color: theme.palette.text.primary,
                    "&:hover": {
                      backgroundColor: theme.palette.surfaces.tint,
                    },
                  }),
            })}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: 500, lineHeight: 1, whiteSpace: "nowrap" }}
            >
              {option.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
