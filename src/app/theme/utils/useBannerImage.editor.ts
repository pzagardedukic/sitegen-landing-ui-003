"use client";

import { useEffect, useState } from "react";
import { getBannerFromTheme } from "@/app/theme/utils/getBannerImage";

const STORAGE_KEY = "theme-editor-payload";

export function useBannerImage() {
  const [banner, setBanner] = useState(() => getBannerFromTheme());

  useEffect(() => {
    /*
     * Hydrate from storage without returning early.
     *
     * ui-001 returned here when a banner was already stored, which skipped the
     * addEventListener below — so after the preview reloaded, every further banner
     * update from the editor was ignored while colors and fonts kept updating live.
     * See ui-001#2.
     */
    const saved = sessionStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const payload = JSON.parse(saved);

        if (payload?.banner) {
          setBanner(payload.banner);
        }
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }

    const handleBannerUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<string>;

      setBanner(customEvent.detail || getBannerFromTheme());
    };

    window.addEventListener("theme-editor-banner-update", handleBannerUpdate);

    return () => {
      window.removeEventListener(
        "theme-editor-banner-update",
        handleBannerUpdate,
      );
    };
  }, []);

  return banner;
}
