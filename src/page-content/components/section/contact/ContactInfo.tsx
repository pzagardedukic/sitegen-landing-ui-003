"use client";

import React from "react";
import { Box, Link, Typography } from "@mui/material";
import ContactInfoCard from "./ContactInfoCard";
import WorkingHours from "./WorkingHours";
import {
  getCompany,
  getMap,
  getContacts,
  getWorkingHours,
} from "@/core/runtime";
import { getContactTranslation } from "@/core/translations";
import { useLanguage } from "@/core/runtime";

/*
 * The details grid from the Figma frame: two columns of 260 with a 40 gutter — location and
 * phone on the first row, e-mail and opening hours on the second.
 */
export default function ContactInfo() {
  const { lang } = useLanguage();
  const contactTranslation = getContactTranslation(lang);

  const company = getCompany();
  const map = getMap();
  const contacts = getContacts();
  const workingHours = getWorkingHours();

  const email = contacts.find((c) => c.type === "EMAIL")?.value || "";
  const phone = contacts.find((c) => c.type === "PHONE")?.value || "";

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
        columnGap: "40px",
        rowGap: { xs: 4, md: 5 },
        alignItems: "start",
      }}
    >
      <ContactInfoCard label={contactTranslation.contactInfo.address.title}>
        <Typography variant="body1">{company.address}</Typography>
        <Typography variant="body1">
          {company.postalCode} {company.postalOffice}
        </Typography>

        {map.url && (
          <Link
            href={map.url}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            variant="subtitle2"
            color="primary.main"
            sx={{ mt: 0.5 }}
          >
            {contactTranslation.contactInfo.address.callToAction}
          </Link>
        )}
      </ContactInfoCard>

      {phone && (
        <ContactInfoCard label={contactTranslation.contactInfo.phone.title}>
          <Typography
            component={Link}
            href={`tel:${phone.replace(/\s+/g, "")}`}
            underline="hover"
            variant="body1"
            color="inherit"
          >
            {phone}
          </Typography>
        </ContactInfoCard>
      )}

      {email && (
        <ContactInfoCard label={contactTranslation.contactInfo.email.title}>
          <Typography
            component={Link}
            href={`mailto:${email}`}
            underline="hover"
            variant="body1"
            color="inherit"
            sx={{ wordBreak: "break-word" }}
          >
            {email}
          </Typography>
        </ContactInfoCard>
      )}

      {workingHours.enabled && (
        <ContactInfoCard label={contactTranslation.workingHours.title}>
          <WorkingHours />
        </ContactInfoCard>
      )}
    </Box>
  );
}
