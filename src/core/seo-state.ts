import generatedSeed from "@/data/primary-seo.json";
import type { PrimarySeoSeed } from "./snapshot-model";

/** Read the fresh META seed, not the old seed embedded in the JS bundle. */
export function getInitialSeoSeed(): PrimarySeoSeed {
  if (typeof document !== "undefined") {
    try {
      const source = document.getElementById("sitegen-seo-data")?.textContent;
      if (source) {
        const parsed = JSON.parse(source) as PrimarySeoSeed;
        if (parsed.schema === 1 && parsed.pages?.["/"]) return parsed;
      }
    } catch {
      /* Development / unprocessed export: use the build seed. */
    }
  }
  return generatedSeed as unknown as PrimarySeoSeed;
}
export { safeJson, resolvePageMeta } from "./snapshot-model";
