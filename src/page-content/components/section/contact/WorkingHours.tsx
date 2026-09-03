"use client";

import { Box, Typography } from "@mui/material";
import { groupWorkingHours } from "./groupWorkingHours";
import { useMemo } from "react";
import { useLanguage } from "@/core/runtime";
import { getWorkingHours } from "@/core/runtime";
import { Days, getContactTranslation } from "@/core/translations";

/* Indexed by `Date.getDay()`, so Sunday first. These are the tags the data uses. */
const DAY_TAGS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

/*
 * Day and time rows as drawn: the day on the left, the time on the right, no dividers and
 * no chips. Today's row is marked with the brand colour. The heading comes from the block
 * this sits in, so it is not repeated here.
 */
export default function WorkingHours() {
  const { lang } = useLanguage();

  const workingHoursTranslation = getContactTranslation(lang).workingHours;

  const workingHours = getWorkingHours(lang);

  const grouped = useMemo(
    () => groupWorkingHours(workingHours.items),
    [workingHours.items],
  );

  /*
   * The tag straight off the Date, not a formatted name.
   * `toLocaleDateString("en-US", { weekday: "long" })` returns "Wednesday" and the groups
   * carry "WEDNESDAY", so the comparison never matched and today was never marked — the
   * row simply rendered like every other one. Inherited from ui-001, see ui-001#6.
   */
  const currentDay = DAY_TAGS[new Date().getDay()];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        {grouped.map((g, i) => {
          const isToday = g.days.includes(currentDay);
          const translated = g.days.map(
            (d) => workingHoursTranslation.days[d as Days],
          );
          const dayLabel =
            translated.length === 1
              ? translated[0]
              : `${translated[0]} – ${translated[translated.length - 1]}`;

          return (
            <Box
              key={i}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                color: isToday ? "primary.main" : "inherit",
              }}
            >
              <Typography variant="body2">{dayLabel}</Typography>

              <Typography variant="body2" sx={{ opacity: isToday ? 1 : 0.7 }}>
                {g.open
                  ? `${g.from} – ${g.to}`
                  : workingHoursTranslation.closedLabel}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {workingHours.note && (
        <Typography variant="caption" sx={{ opacity: 0.6, mt: 0.5 }}>
          {workingHoursTranslation.noteLabel}: {workingHours.note}
        </Typography>
      )}
    </Box>
  );
}
