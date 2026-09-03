import { networkInterfaces } from "node:os";
import path from "node:path";
import type { NextConfig } from "next";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/*
 * Hosts allowed to load dev-only resources under /_next/*.
 *
 * Next 16 blocks these cross-origin by default, so opening the dev server from a phone on
 * the same network returns the HTML but no JS or CSS — a blank white page, with the reason
 * only visible in the terminal. Development only; the exported site is unaffected.
 *
 * The addresses are read off the machine's own interfaces rather than written down: a
 * DHCP lease change is enough to turn a hardcoded address into that same blank page.
 * DEV_ORIGINS can add more (comma-separated) when the phone reaches the server by some
 * other name.
 */
const localAddresses = Object.values(networkInterfaces())
  .flatMap((interfaces) => interfaces ?? [])
  .filter((iface) => iface.family === "IPv4" && !iface.internal)
  .map((iface) => iface.address);

const DEV_ORIGINS = [
  ...localAddresses,
  ...(process.env.DEV_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: BASE_PATH,
  allowedDevOrigins: DEV_ORIGINS,
  images: {
    unoptimized: true,
  },
  turbopack: {
    /*
     * Pin the workspace root to this repository. Without it Next walks up looking for a
     * lockfile, and on a machine with a stray lockfile in the home directory it picks
     * that instead — file tracing then covers everything under the user's profile.
     */
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
