"use client";

import { useState } from "react";
import { Box, Collapse, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

type Props = {
  question: string;
  answer: string;
  defaultOpen?: boolean;
};

/*
 * One question from the Figma frame: the question and a round toggle on one row, 30 in from
 * the card edge, and when open a hairline rule with the answer beneath it. Closed rows are
 * 90 tall, the open one 146.
 */
export default function FaqItem({
  question,
  answer,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Box
      sx={(theme) => ({
        borderRadius: "25px",
        border: `1px solid ${theme.palette.surfaces.border}`,
        backgroundColor: open ? theme.palette.surfaces.tint : "transparent",
        px: "30px",
        py: "26px",
        transition: theme.transitions.create("background-color"),
      })}
    >
      <Box
        component="button"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          background: "none",
          border: 0,
          padding: 0,
          cursor: "pointer",
          textAlign: "left",
          color: "inherit",
        }}
      >
        <Typography variant="h5" component="h3">
          {question}
        </Typography>

        <IconButton
          component="span"
          size="small"
          aria-hidden
          sx={(theme) => ({
            width: 38,
            height: 38,
            flexShrink: 0,
            border: `1px solid ${theme.palette.surfaces.border}`,
            color: theme.palette.text.primary,
            ...(open && {
              backgroundImage: theme.palette.brandGradient,
              borderColor: "transparent",
              color: theme.palette.primary.contrastText,
            }),
          })}
        >
          {open ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" />}
        </IconButton>
      </Box>

      <Collapse in={open}>
        <Box
          aria-hidden
          sx={(theme) => ({
            height: "1px",
            backgroundColor: theme.palette.surfaces.border,
            mt: 2,
            mb: 2,
          })}
        />

        <Typography variant="body1" sx={{ opacity: 0.75 }}>
          {answer}
        </Typography>
      </Collapse>
    </Box>
  );
}
