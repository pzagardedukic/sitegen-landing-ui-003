"use client";

import { useEffect, useState } from "react";

/**
 * An intentionally opaque, disposable HTML island, separate from the live app.
 * The post-export renderer owns its inner markup; React must not hydrate it.
 * Only this island suppresses its expected innerHTML difference after META.
 */
export default function PrimarySnapshot() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const finish = () => setReady(true);
    window.addEventListener("sitegen:content-ready", finish);
    if (document.documentElement.dataset.sitegenReady === "true") finish();
    return () => window.removeEventListener("sitegen:content-ready", finish);
  }, []);

  if (ready) return null;
  return (
    <>
      <div
        id="sitegen-primary-snapshot"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html:
            "<!--sitegen-primary-html:start--><!--sitegen-primary-html:end-->",
        }}
      />
      <div
        id="sitegen-language-recovery"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: "" }}
      />
    </>
  );
}
