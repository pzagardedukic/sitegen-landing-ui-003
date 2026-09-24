"use client";

import { Box } from "@mui/material";
import { useEffect, useLayoutEffect, useState } from "react";
import HeaderLayout from "./HeaderLayout";
import FooterLayout from "./FooterLayout";
import { markContentReady } from "@/core/language-startup";

type PageLayoutProps = {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
};

/*
 * The page scrolls the document, not an inner container.
 *
 * ui-001 put everything inside a `height: 100vh; overflow: hidden` shell with its own
 * scrolling div, a hidden scrollbar and hand-written arrow/page-key handling. On a phone
 * that is the shape that misbehaves: 100vh counts the browser's URL bar, so the bottom of
 * every page sits under it and the bar never collapses. Document scrolling also gives
 * anchors, scroll-margin-top, scroll restoration and keyboard paging back for free — the
 * ~70 lines of key handling were reimplementing the browser.
 */
export default function PageLayout({
  header,
  footer,
  children,
}: PageLayoutProps) {
  /*
   * Tells the SEO snapshot island it can go: the real page is committed.
   *
   * This is the only thing that dispatches `sitegen:content-ready`, and the island removes
   * itself on nothing else — without this call every page would show its content twice, the
   * snapshot underneath and the live app on top. It is a layout effect on purpose, so the
   * swap happens before paint rather than a frame later.
   */
  useLayoutEffect(() => {
    markContentReady();
  }, []);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <HeaderLayout scrolled={scrolled}>{header}</HeaderLayout>

      <Box id="main" component="main" sx={{ flex: 1 }}>
        {children}
      </Box>

      <FooterLayout>{footer}</FooterLayout>
    </Box>
  );
}
