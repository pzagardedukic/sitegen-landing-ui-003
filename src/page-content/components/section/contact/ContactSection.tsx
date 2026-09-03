"use client";

import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";
import CustomMap from "./CustomMap";
import { getMap } from "@/core/runtime";
import { getContactTranslation } from "@/core/translations";
import { useLanguage } from "@/core/runtime";
import EstablishedAndClients from "../common/EstablishedAndClients";
import { useSearchParams } from "next/navigation";
import { ANCHOR_OFFSET } from "@/app/theme/headerMetrics";

export default function ContactSection() {
  const { lang } = useLanguage();
  const contactTranslation = getContactTranslation(lang);

  const searchParams = useSearchParams();
  const subject = searchParams.get("subject") ?? undefined;

  const map = getMap();

  /*
   * Arriving with a subject means arriving from somewhere else — the apply button on a job,
   * which fills the subject in for you. Without this the page opens at the top and the
   * filled-in form is out of sight: on a phone it sits below the address, the phone number,
   * the email and the whole working-hours table, so nothing on the first screen explains
   * why you are here.
   *
   * The scroll waits a frame. The router puts the document back to the top on the way in,
   * and a scroll fired before that is simply undone.
   */
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!subject) return;

    const form = formRef.current;
    if (!form) return;

    const stillness = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = requestAnimationFrame(() => {
      form.scrollIntoView({ behavior: stillness ? "auto" : "smooth", block: "start" });
    });

    return () => cancelAnimationFrame(frame);
  }, [subject]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 6, md: 10 } }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "560fr 80fr 560fr" },
          gap: { xs: 5, md: 0 },
          alignItems: "start",
        }}
      >
        <Box
          sx={{
            gridColumn: { md: "1" },
            display: "flex",
            flexDirection: "column",
            gap: { xs: 4, md: 6 },
          }}
        >
          <Typography variant="h2" component="h2">
            {contactTranslation.title}
          </Typography>

          <ContactInfo />
        </Box>

        <Box
          ref={formRef}
          sx={{
            gridColumn: { md: "3" },
            /*
             * The header is fixed and taller than it looks, so a plain scroll would tuck the
             * top of the form underneath it. Same offset the section anchors use.
             */
            scrollMarginTop: {
              xs: ANCHOR_OFFSET.xs,
              sm: ANCHOR_OFFSET.sm,
              md: ANCHOR_OFFSET.md,
            },
          }}
        >
          <ContactForm subject={subject} />
        </Box>
      </Box>

      {map.enabled && <CustomMap />}

      {/* Year + Happy Clients - full screen width */}
      <EstablishedAndClients />
    </Box>
  );
}
