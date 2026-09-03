"use client";

import { Suspense, useMemo } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { LanguageProvider } from "@/core/runtime";
import { LanguageHtmlSetter } from "@/core/runtime";
import { createPreviewTheme } from "@/app/theme/utils/createPreviewTheme";
import { getThemeSettings } from "@/core/runtime";
import { PreviousLocationProvider } from "@/core/react";

function WebsiteThemeProvider({ children }: { children: React.ReactNode }) {
  // We need to preload fonts else we fallback to theme
  const settings = getThemeSettings();
  const theme = useMemo(() => {
    return createPreviewTheme(settings);
  }, [settings]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <WebsiteThemeProvider>
        <CssBaseline />
        <LanguageHtmlSetter />
        <Suspense fallback={null}>
          <PreviousLocationProvider>{children}</PreviousLocationProvider>
        </Suspense>
      </WebsiteThemeProvider>
    </LanguageProvider>
  );
}
