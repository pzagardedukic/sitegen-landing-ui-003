import { getMap } from "@/core/runtime";
import { useLanguage } from "@/core/runtime";
import { formatGoogleMapsUrl } from "@/core/utils";
import { Box, Fade, Skeleton } from "@mui/material";
import { useMemo, useState, useEffect } from "react";

type CustomMapProps = {
  fadeRight?: boolean;
};

export default function CustomMap({ fadeRight }: CustomMapProps) {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(true);

  const map = getMap();
  const formattedUrl = useMemo(() => formatGoogleMapsUrl(map.url), [map.url]);

  // Re-trigger loading each time the URL changes
  useEffect(() => {
    setLoading(true);
  }, [formattedUrl]);

  return (
    /* Full-bleed band 400 tall, as drawn — it breaks out of the content container the
       same way the marquee bands do. */
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        height: { xs: 280, md: 400 },
      }}
    >
      {/* Skeleton Loader */}
      <Fade in={loading} unmountOnExit>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        />
      </Fade>

      {/* Iframe Map */}
      <iframe
        title="Location Map"
        src={`${formattedUrl}&hl=${lang}`}
        width="100%"
        height="100%"
        style={{ border: 0, display: "block" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoading(false)}
      />

      {/* Right fade gradient */}
      {fadeRight && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "20px",
            height: "100%",
            pointerEvents: "none",
            zIndex: 2,
            background: (theme) =>
              `linear-gradient(to left, ${theme.palette.background.default} 0%, transparent 100%)`,
          }}
        />
      )}
    </Box>
  );
}
