"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useLanguage } from "@/core/runtime";
import { getDemoPopupTranslation } from "@/core/translations";
import GradientButton from "@/components/button/GradientButton";

const purchaseUrl = "https://onas.si/nadzorna-plosca";

export default function DemoPopup() {
  const { lang } = useLanguage();
  const t = getDemoPopupTranslation(lang);

  const [open, setOpen] = useState(true);

  const dismiss = () => setOpen(false);

  return (
    <Dialog
      open={open}
      onClose={dismiss}
      slotProps={{
        paper: {
          sx: (theme) => ({
            borderRadius: "25px",
            border: `1px solid ${theme.palette.surfaces.border}`,
            px: 1,
            py: 2,
          }),
        },
      }}
    >
      <DialogTitle sx={{ typography: "h4" }}>{t.title}</DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ typography: "body1" }}>
          {t.description}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={dismiss} sx={{ borderRadius: 999, px: 2.5 }}>
          {t.closeButton}
        </Button>

        <GradientButton
          component="a"
          href={purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.purchaseButton}
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
}
