/*
 * Generates the demo photographs described in scripts/demoImagePlan.mjs and writes them into
 * website.json.
 *
 *   node scripts/generateDemoImages.mjs --dry            list the plan, call nothing
 *   node scripts/generateDemoImages.mjs --only gallery   one slot group
 *   node scripts/generateDemoImages.mjs                  everything still missing
 *
 * The key is read from .env.local (which .gitignore already covers) and never printed.
 * Images already present in public/images are skipped, so a interrupted run resumes instead
 * of paying for the same picture twice.
 *
 * Image models return their own aspect ratios, so every result is cropped to the ratio the
 * slot is actually drawn at — see DEMO-SLIKE.md — rather than squeezed into it.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { PLAN, BINDINGS } from "./demoImagePlan.mjs";

const root = process.cwd();
const outDir = path.join(root, "public", "images");

/* --- config -------------------------------------------------------------- */
const envFile = path.join(root, ".env.local");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const KEY =
  process.env.OPENROUTER_API_KEY ||
  process.env.OPENAI_API_KEY ||
  process.env.FAL_KEY;

const PROVIDER = process.env.OPENROUTER_API_KEY
  ? "openrouter"
  : process.env.OPENAI_API_KEY
    ? "openai"
    : process.env.FAL_KEY
      ? "fal"
      : null;

const MODEL =
  process.env.IMAGE_MODEL ||
  (PROVIDER === "openrouter" ? "google/gemini-2.5-flash-image" : "gpt-image-1");

const args = process.argv.slice(2);
const dry = args.includes("--dry");
const onlyIndex = args.indexOf("--only");
const only = onlyIndex >= 0 ? args[onlyIndex + 1] : null;

const todo = PLAN.filter((p) => (only ? p.slot === only : true));

if (dry) {
  console.log(`nacrt: ${todo.length} slik${only ? ` (samo ${only})` : ""}\n`);
  for (const p of todo) {
    const exists = fs.existsSync(path.join(outDir, `${p.name}.webp`));
    console.log(`  ${exists ? "je" : "  "}  ${p.name.padEnd(30)} ${p.slot.padEnd(10)} ${p.target}`);
  }
  process.exit(0);
}

if (!PROVIDER) {
  console.error(
    "Ni kljuca. V .env.local dodaj eno vrstico, npr.:\n" +
      "  OPENROUTER_API_KEY=sk-or-...\n" +
      "Podprti so tudi OPENAI_API_KEY in FAL_KEY.",
  );
  process.exit(1);
}

/* --- providers ----------------------------------------------------------- */
async function callOpenRouter(prompt) {
  // OpenRouter image models take the ratio from the prompt, not a size parameter.
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      modalities: ["image", "text"],
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 300)}`);

  const json = await res.json();
  const images = json.choices?.[0]?.message?.images;
  const url = images?.[0]?.image_url?.url;

  if (!url) throw new Error(`brez slike v odgovoru: ${JSON.stringify(json).slice(0, 300)}`);

  return Buffer.from(url.split(",")[1], "base64");
}

/*
 * Ask for the orientation the slot needs. Cropping a square down to 0.67 throws away a
 * third of the picture and usually takes the subject's head with it.
 */
function sizeFor(ratio) {
  if (ratio < 0.9) return "1024x1536";
  if (ratio > 1.2) return "1536x1024";
  return "1024x1024";
}

async function callOpenAI(prompt, ratio) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      size: sizeFor(ratio),
      quality: process.env.IMAGE_QUALITY || "medium",
      n: 1,
    }),
  });

  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 300)}`);

  const json = await res.json();
  const b64 = json.data?.[0]?.b64_json;

  if (!b64) throw new Error("brez slike v odgovoru");

  return Buffer.from(b64, "base64");
}

const generate = PROVIDER === "openai" ? callOpenAI : callOpenRouter;

/* --- run ----------------------------------------------------------------- */
fs.mkdirSync(outDir, { recursive: true });

const produced = {};
let made = 0;
let skipped = 0;
const failed = [];

for (const item of todo) {
  const out = path.join(outDir, `${item.name}.webp`);
  (produced[item.slot] ??= []).push(`/images/${item.name}.webp`);

  if (fs.existsSync(out)) {
    skipped++;
    continue;
  }

  try {
    const raw = await generate(item.prompt, item.target);
    const meta = await sharp(raw).metadata();

    // Crop to the slot's ratio from the centre, then size to the slot's width.
    const ratio = item.target;
    let cw = meta.width;
    let ch = Math.round(cw / ratio);
    if (ch > meta.height) {
      ch = meta.height;
      cw = Math.round(ch * ratio);
    }

    await sharp(raw)
      .extract({
        left: Math.round((meta.width - cw) / 2),
        top: Math.round((meta.height - ch) / 2),
        width: cw,
        height: ch,
      })
      .resize({ width: item.width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(out);

    const size = fs.statSync(out).size;
    made++;
    console.log(`  ${item.name.padEnd(30)} ${(size / 1024).toFixed(0)} kB`);
  } catch (error) {
    failed.push(`${item.name}: ${error.message}`);
    console.error(`  ${item.name.padEnd(30)} NAPAKA ${error.message.slice(0, 120)}`);
  }
}

console.log(`\nnarejenih ${made}, preskocenih ${skipped}, napak ${failed.length}`);

/* --- bind into website.json ---------------------------------------------- */
const siteFile = path.join(root, "website.json");
const site = JSON.parse(fs.readFileSync(siteFile, "utf8"));

for (const [slot, files] of Object.entries(produced)) {
  const present = files.filter((f) =>
    fs.existsSync(path.join(root, "public", f.replace(/^\//, ""))),
  );
  if (present.length !== files.length) {
    console.log(`  ${slot}: ${present.length}/${files.length} slik, vpis preskocen`);
    continue;
  }
  BINDINGS[slot]?.(site, files);
  console.log(`  ${slot}: vpisano v website.json`);
}

fs.writeFileSync(siteFile, JSON.stringify(site, null, 2) + "\n");

if (failed.length) process.exitCode = 1;
