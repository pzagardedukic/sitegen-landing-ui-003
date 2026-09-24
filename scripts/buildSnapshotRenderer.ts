import fs from "node:fs";
import path from "node:path";
import { build } from "esbuild";
import * as sass from "sass";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());
const root = process.cwd();
const define: Record<string, string> = {
  "process.env.NODE_ENV": '"production"',
};
for (const [name, value] of Object.entries(process.env)) {
  if (name.startsWith("NEXT_PUBLIC_") && value !== undefined)
    define[`process.env.${name}`] = JSON.stringify(value);
}
define["process.env.NEXT_PUBLIC_BASE_PATH"] = JSON.stringify(
  process.env.NEXT_PUBLIC_BASE_PATH || "",
);
define["process.env.NEXT_PUBLIC_THEME_EDITOR_ENABLED"] = '"false"';
define["process.env.NEXT_PUBLIC_DEMO_POPUP_ENABLED"] = '"false"';

await build({
  entryPoints: ["scripts/snapshot/refresh.ts"],
  outfile: ".sitegen-meta/refresh.cjs",
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node20",
  jsx: "automatic",
  mainFields: ["module", "main"],
  define,
  // Everything except Node built-ins is bundled. META needs no pnpm/node_modules.
  alias: {
    "@/core/runtime": path.join(root, "scripts/snapshot/runtime.tsx"),
    "next/navigation": path.join(root, "scripts/snapshot/navigation.ts"),
    "next/font/google": path.join(root, "scripts/snapshot/fonts.ts"),
    "framer-motion": path.join(root, "scripts/snapshot/motion.tsx"),
    "react-photoswipe-gallery": path.join(root, "scripts/snapshot/gallery.tsx"),
    // The browser marquee is CJS and renders null before mount.
    // Use real, non-animated content in primary-language HTML instead.
    "react-fast-marquee": path.join(root, "scripts/snapshot/marquee.tsx"),
  },
  loader: {
    ".woff": "empty",
    ".woff2": "empty",
    ".png": "empty",
    ".svg": "empty",
  },
  plugins: [
    {
      name: "snapshot-scss-modules",
      setup(builder) {
        builder.onLoad({ filter: /\.module\.scss$/ }, (args) => ({
          contents: sass.compile(args.path, { style: "compressed" }).css,
          loader: "local-css",
          resolveDir: path.dirname(args.path),
        }));
      },
    },
  ],
  logLevel: "info",
});
if (!fs.existsSync(".sitegen-meta/refresh.css"))
  fs.writeFileSync(".sitegen-meta/refresh.css", "");
console.log(
  "Compiled standalone META renderer. Keep .sitegen-meta outside the public web root.",
);
