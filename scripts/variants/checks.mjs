/*
 * What is asked of every route of every variant.
 *
 * The DOM answers most of it. The last check cannot be answered from the DOM at all — see
 * `findInvisibleText` — and reads the pixels instead.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* Everything the browser complains about, collected while the page loads. */
export function collectComplaints(browser) {
  const complaints = [];

  const stop = browser.onEvent((message) => {
    const { method, params } = message;

    if (method === "Runtime.exceptionThrown") {
      complaints.push(`exception: ${params.exceptionDetails.text}`);
    }
    if (method === "Runtime.consoleAPICalled" && params.type === "error") {
      const text = params.args
        .map((argument) => argument.value ?? argument.description ?? "")
        .join(" ");
      complaints.push(`console.error: ${text}`);
    }
    if (method === "Network.loadingFailed") {
      complaints.push(`request failed: ${params.errorText}`);
    }
    if (method === "Network.responseReceived" && params.response.status >= 400) {
      complaints.push(`HTTP ${params.response.status}: ${params.response.url}`);
    }
  });

  return { complaints, stop };
}

const DOM_PROBE = `JSON.stringify((() => {
  const round = (n) => Math.round(n);
  const viewport = document.documentElement.clientWidth;

  const overflow = document.documentElement.scrollWidth - viewport;
  const worstOverflow = overflow <= 1 ? null : [...document.querySelectorAll("body *")]
    .map((el) => ({ el, past: round(el.getBoundingClientRect().right - viewport) }))
    .filter((entry) => entry.past > 1)
    .sort((a, b) => b.past - a.past)
    .map((entry) => entry.el.tagName.toLowerCase() + (entry.el.id ? "#" + entry.el.id : ""))[0];

  const clipped = [...document.querySelectorAll("body *")]
    .filter((el) => {
      const style = getComputedStyle(el);
      if (style.overflowX === "auto" || style.overflowX === "scroll") return false;
      if (el.clientWidth === 0 || el.scrollWidth <= el.clientWidth + 2) return false;
      return [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 2);
    })
    .slice(0, 5)
    .map((el) => el.textContent.trim().slice(0, 40));

  const brokenImages = [...document.images]
    .filter((img) => img.complete && img.naturalWidth === 0)
    .slice(0, 5)
    .map((img) => img.getAttribute("src"));

  return {
    nodes: document.querySelectorAll("*").length,
    title: document.title,
    lang: document.documentElement.lang,
    textLength: document.body.innerText.length,
    headings: [...document.querySelectorAll("h1,h2")].length,
    overflow: Math.max(0, overflow),
    worstOverflow,
    clipped,
    brokenImages,
  };
})())`;

/*
 * Candidates for the pixel check: elements that carry their own words and nothing else.
 * An element with a background image of its own is skipped — a photograph behind the words
 * brings its own variation and the box would always look fine whatever the text colour.
 */
const TEXT_BOX_PROBE = `JSON.stringify((() => {
  const round = (n) => Math.round(n);

  /*
   * Opacity is inherited by effect, not by value: a label sits at opacity 1 inside a card
   * overlay that is at 0 until the pointer arrives. That text is meant to be unseen, and
   * reporting it would drown the real finding in noise — the project cards alone carry six.
   */
  const effectiveOpacity = (el) => {
    let opacity = 1;
    for (let node = el; node && node.nodeType === 1; node = node.parentElement) {
      opacity *= parseFloat(getComputedStyle(node).opacity);
    }
    return opacity;
  };

  return [...document.querySelectorAll("body *")]
    .filter((el) => {
      const style = getComputedStyle(el);
      if (style.visibility === "hidden" || style.display === "none") return false;
      if (style.backgroundImage !== "none") return false;
      if (effectiveOpacity(el) < 0.05) return false;
      if (!el.textContent || el.textContent.trim().length < 3) return false;
      if ([...el.children].some((child) => child.textContent.trim().length > 0)) return false;
      const box = el.getBoundingClientRect();
      return box.width > 24 && box.height > 8 && box.width * box.height < 240000;
    })
    .map((el) => {
      const box = el.getBoundingClientRect();
      return {
        text: el.textContent.trim().slice(0, 40),
        x: round(box.left),
        y: round(box.top + scrollY),
        width: round(box.width),
        height: round(box.height),
      };
    })
    .filter((box) => box.x >= 0 && box.y >= 0)
    .slice(0, 150);
})())`;

export async function inspectRoute(browser, url, { settleMs = 3500, growth = true } = {}) {
  const { complaints, stop } = collectComplaints(browser);

  await browser.send("Page.navigate", { url: "about:blank" });
  await sleep(150);
  await browser.send("Page.navigate", { url });
  await sleep(settleMs);

  /*
   * Wait for the page to stop appearing before judging whether it keeps growing. The whole
   * tree is a client component, so a reading taken too early catches hydration in progress
   * and every page looks like a runaway — the home page reported 46 nodes becoming 652.
   */
  let previous = -1;
  for (let pass = 0; pass < 12; pass += 1) {
    const nodes = await browser.evaluate("document.querySelectorAll('*').length", "settle");
    if (nodes === previous && nodes > 20) break;
    previous = nodes;
    await sleep(600);
  }

  const first = JSON.parse(await browser.evaluate(DOM_PROBE, url));
  if (!growth) {
    stop();
    return { ...first, growing: false, complaints: [...new Set(complaints)] };
  }

  await sleep(3000);
  const second = JSON.parse(await browser.evaluate(DOM_PROBE, url));

  stop();

  return {
    ...second,
    /* A node count that is still climbing seconds after the page settled is a runaway. */
    growing: second.nodes > first.nodes * 1.2 && second.nodes - first.nodes > 40,
    complaints: [...new Set(complaints)],
  };
}

let ffmpegMissingReported = false;

/*
 * Text nobody can see.
 *
 * This is the one thing the DOM cannot answer. A heading can be in the right place, in the
 * right font, at the right size, and still be white on white — as the site name in the
 * header was for every customer without a logo. The colour that betrays it is not on the
 * element and not on its parent: the white came from a decorative shape painted underneath
 * by a different branch of the tree.
 *
 * So the page is photographed and each box of words is read back. Visible words vary across
 * their own box — strokes against their background. A box with no variation has no visible
 * words in it.
 */
export function findInvisibleText(pngPath, imageWidth, textBoxes, workDir) {
  const rawPath = join(workDir, "frame.raw");

  try {
    mkdirSync(workDir, { recursive: true });
    execFileSync(
      "ffmpeg",
      ["-y", "-loglevel", "error", "-i", pngPath, "-f", "rawvideo", "-pix_fmt", "rgb24", rawPath],
      { stdio: "pipe" },
    );
  } catch {
    if (!ffmpegMissingReported) {
      console.log("  (ffmpeg not available — skipping the invisible-text check)");
      ffmpegMissingReported = true;
    }
    return null;
  }

  const pixels = readFileSync(rawPath);
  const height = Math.floor(pixels.length / (imageWidth * 3));
  const luminance = (x, y) => {
    const index = (y * imageWidth + x) * 3;
    return 0.299 * pixels[index] + 0.587 * pixels[index + 1] + 0.114 * pixels[index + 2];
  };

  const invisible = [];

  for (const box of textBoxes) {
    const x0 = box.x;
    const y0 = box.y;
    const x1 = box.x + box.width;
    const y1 = box.y + box.height;

    /*
     * Only boxes wholly inside the photograph. A box clipped by the edge would be sampled
     * against whatever happens to be there, and a sliver of one colour reads as invisible
     * text — a false alarm is worse than a missed one in a check meant to be trusted.
     */
    if (x0 < 0 || y0 < 0 || x1 > imageWidth - 1 || y1 > height - 1) continue;
    if (x1 - x0 < 8 || y1 - y0 < 6) continue;

    let min = 255;
    let max = 0;
    for (let y = y0; y <= y1; y += 1) {
      for (let x = x0; x <= x1; x += 1) {
        const value = luminance(x, y);
        if (value < min) min = value;
        if (value > max) max = value;
      }
    }

    if (max - min < 12) {
      invisible.push({ text: box.text, spread: Math.round(max - min) });
    }
  }

  try {
    unlinkSync(rawPath);
  } catch {
    /* the temp frame is disposable */
  }

  return invisible;
}

/*
 * A photograph of the whole page, and the boxes of words measured in the same layout that
 * was photographed.
 *
 * Both halves matter. `captureBeyondViewport` quietly stretches the viewport to the height
 * of the document before it shoots, and the hero is `height: 100dvh` — so in the photograph
 * the hero is as tall as the whole page and everything below it has moved down. Boxes read
 * before the shot then point at the wrong pixels, and the check calls text invisible all
 * over a page where nothing is wrong. That is exactly what the first run reported.
 *
 * So the viewport is grown first, deliberately, and the boxes are read after it. What is
 * measured is then what was photographed.
 */
export async function capturePageWithBoxes(browser, file, width) {
  const setViewport = (height) =>
    browser.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 600,
    });

  /*
   * Growing the viewport grows the page: the hero is `100dvh`, so it takes the new height
   * and pushes everything below it further down. One pass therefore leaves the bottom of
   * the page outside the shot, and boxes down there get sampled against nothing — which is
   * how three buttons were reported as invisible when they were plainly there. Settle it.
   */
  let pageHeight = 0;
  for (let pass = 0; pass < 4; pass += 1) {
    const measured = Math.min(
      16000,
      Math.ceil(await browser.evaluate("document.body.scrollHeight", "page height")),
    );
    if (measured === pageHeight) break;
    pageHeight = measured;
    await setViewport(pageHeight);
    await sleep(500);
  }

  await sleep(700);

  const boxes = JSON.parse(await browser.evaluate(TEXT_BOX_PROBE, "text boxes"));

  const shot = await browser.withTimeout(
    browser.send("Page.captureScreenshot", { format: "png", optimizeForSpeed: true }),
    120000,
    `capture ${file}`,
  );
  writeFileSync(file, Buffer.from(shot.data, "base64"));

  await setViewport(900);

  return { file, boxes };
}
