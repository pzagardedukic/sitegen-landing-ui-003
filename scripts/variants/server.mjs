/*
 * A static server for the export, so a variant is checked the way it is served rather than
 * through the dev server. `next start` is not an option: the site is `output: "export"`.
 */
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".pdf": "application/pdf",
};

export function serveExport(root, port) {
  const resolve = (pathname) => {
    const relative = normalize(decodeURIComponent(pathname)).replace(/^[/\\]+/, "");
    const candidates = [
      join(root, relative),
      join(root, relative, "index.html"),
      join(root, `${relative.replace(/[/\\]+$/, "")}.html`),
    ];

    return candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
  };

  const server = createServer((request, response) => {
    const { pathname } = new URL(request.url, "http://localhost");
    const file = resolve(pathname) ?? join(root, "404.html");

    if (!existsSync(file)) {
      response.writeHead(404).end("not found");
      return;
    }

    response.writeHead(200, {
      "content-type": TYPES[extname(file)] ?? "application/octet-stream",
    });
    createReadStream(file).pipe(response);
  });

  return new Promise((resolve_, reject) => {
    server.on("error", reject);
    server.listen(port, "127.0.0.1", () => resolve_(server));
  });
}
