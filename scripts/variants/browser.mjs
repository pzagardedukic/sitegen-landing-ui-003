/*
 * A thin driver over headless Chrome or Edge, spoken to through the DevTools protocol.
 *
 * The exported HTML is only a shell — the whole tree is a client component, so the section
 * markup exists after hydration. Anything worth checking has to be read out of the live DOM,
 * which is why this is a browser and not a parser.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";

const CANDIDATES = [
  process.env.CHROME_PATH,
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function findBrowser() {
  const found = CANDIDATES.find((candidate) => existsSync(candidate));

  if (!found) {
    throw new Error(
      "No headless browser found. Set CHROME_PATH to a Chrome or Edge binary.",
    );
  }

  return found;
}

export async function launch({ port, profileDir }) {
  mkdirSync(profileDir, { recursive: true });

  const process_ = spawn(findBrowser(), [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "about:blank",
  ]);
  process_.stderr.on("data", () => {});

  const fetchJson = async (path) => {
    for (let attempt = 0; attempt < 60; attempt += 1) {
      try {
        return await (await fetch(`http://127.0.0.1:${port}${path}`)).json();
      } catch {
        await sleep(500);
      }
    }
    throw new Error("The browser never opened its DevTools endpoint.");
  };

  const target = (await fetchJson("/json/list")).find((entry) => entry.type === "page");
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let nextId = 0;
  const pending = new Map();
  const listeners = new Set();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);

    if (message.id !== undefined && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
      return;
    }

    listeners.forEach((listener) => listener(message));
  });

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = (nextId += 1);
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });

  /* Anything can hang; nothing may hang the whole run. */
  const withTimeout = (promise, ms, label) =>
    Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`timed out: ${label}`)), ms),
      ),
    ]);

  return {
    send,
    withTimeout,
    onEvent: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    evaluate: async (expression, label = "evaluate") => {
      const { result } = await withTimeout(
        send("Runtime.evaluate", { expression, returnByValue: true }),
        20000,
        label,
      );
      return result.value;
    },
    close: () => {
      socket.close();
      process_.kill();
    },
  };
}
