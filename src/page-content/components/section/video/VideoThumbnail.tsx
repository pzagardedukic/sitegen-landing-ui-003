"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { extractYouTubeId, getVideoThumbnail } from "@/core/utils";

/*
 * A YouTube still is a pure function of the video id, so it can be known during the first
 * render — and the first render is what the exported HTML keeps. Without it a reader who
 * has no JavaScript yet, a search engine or a link preview, gets the video page with no
 * pictures at all, because the effect below never runs for them.
 *
 * Vimeo needs a request, so it stays in the effect and replaces this when it arrives; for
 * a YouTube URL the effect resolves to this same address, so nothing moves.
 */
function youTubeStill(url: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

/*
 * A video tile from the Figma frame (580x326): the still under a black overlay with a round
 * play button, 74px across, in the middle.
 */
export default function VideoThumbnail({ videoUrl }: { videoUrl: string }) {
  const [thumb, setThumb] = useState<string | null>(() => youTubeStill(videoUrl));

  useEffect(() => {
    let mounted = true;

    (async () => {
      const thumbnail = await getVideoThumbnail(videoUrl);
      if (mounted) setThumb(thumbnail);
    })();

    return () => {
      mounted = false;
    };
  }, [videoUrl]);

  return (
    <Box
      component="a"
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      sx={(theme) => ({
        position: "relative",
        display: "block",
        height: { xs: 220, sm: 280, md: 326 },
        borderRadius: "25px",
        overflow: "hidden",
        backgroundColor: theme.palette.surfaces.placeholder,
        "&:hover .play": { transform: "translate(-50%, -50%) scale(1.08)" },
        "&:hover img": { transform: "scale(1.04)" },
      })}
    >
      {thumb && (
        <Box
          component="img"
          src={thumb}
          alt=""
          loading="lazy"
          sx={(theme) => ({
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: theme.transitions.create("transform"),
          })}
        />
      )}

      <Box
        aria-hidden
        sx={(theme) => ({
          position: "absolute",
          inset: 0,
          backgroundColor: theme.palette.surfaces.scrim,
        })}
      />

      <Box
        className="play"
        sx={(theme) => ({
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 74,
          height: 74,
          borderRadius: "50%",
          backgroundImage: theme.palette.brandGradient,
          color: theme.palette.primary.contrastText,
          display: "grid",
          placeItems: "center",
          transition: theme.transitions.create("transform"),
        })}
      >
        <PlayArrowIcon sx={{ fontSize: 34 }} />
      </Box>
    </Box>
  );
}
