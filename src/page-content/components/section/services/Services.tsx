"use client";

import { Box } from "@mui/material";
import { useLanguage } from "@/core/runtime";
import { getServiceItems } from "@/core/runtime";
import ServiceCard from "./ServiceCard";

type ServicesProps = {
  maxCnt?: number;
};

/* Three cards across a 1200 grid with a 40px gutter, one per row on a phone. */
export default function Services({ maxCnt }: ServicesProps) {
  const { lang } = useLanguage();
  const serviceItems = getServiceItems(lang).slice(0, maxCnt || undefined);

  if (serviceItems.length === 0) return null;

  return (
    <Box
      sx={{
        display: "grid",
        gap: "40px",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
      }}
    >
      {serviceItems.map((service, index) => (
        <ServiceCard key={index} {...service} />
      ))}
    </Box>
  );
}
