import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const visualRoots = ["src/app", "src/components", "src/page-content"];
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);
const forbidden = [
  "website.json",
  "@/data/",
  "@ptlabTadej/sitegen-v2-shared-types",
  "@ptlabTadej/sitegen-landing-core",
];

const violations = [];

function visit(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath);

  for (const entry of fs.readdirSync(absolutePath, { withFileTypes: true })) {
    const childRelativePath = path.join(relativePath, entry.name);
    const childAbsolutePath = path.join(projectRoot, childRelativePath);

    if (entry.isDirectory()) {
      visit(childRelativePath);
      continue;
    }

    if (!sourceExtensions.has(path.extname(entry.name))) continue;

    const lines = fs.readFileSync(childAbsolutePath, "utf8").split(/\r?\n/);

    lines.forEach((line, index) => {
      forbidden.forEach((token) => {
        if (line.includes(token)) {
          violations.push({
            file: childRelativePath,
            line: index + 1,
            token,
          });
        }
      });
    });
  }
}

visualRoots.forEach(visit);

if (violations.length > 0) {
  console.error("Core/UI boundary violations found:\n");

  violations.forEach(({ file, line, token }) => {
    console.error(`- ${file}:${line} imports or references ${token}`);
  });

  process.exit(1);
}

console.log("Core/UI boundary verified.");
