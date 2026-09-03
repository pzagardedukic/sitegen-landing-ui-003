"use client";

import { Box } from "@mui/material";
import ClientLogoSlider from "./ClientLogoSlider";
import { getClients } from "@/core/runtime";

export default function ClientsSection() {
  const clients = getClients();

  return (
    <Box
      sx={{
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        display: "flex",
      }}
    >
      {/* Clients - full screen width */}
      <ClientLogoSlider clients={clients} speed={30} />
    </Box>
  );
}
