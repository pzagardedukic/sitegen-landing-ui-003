/** Server-render-only navigation adapter. Never included in the live browser UI. */
let pathname = "/";
const searchParams = new URLSearchParams();
const router = {
  push() {},
  replace() {},
  refresh() {},
  back() {},
  forward() {},
  prefetch: async () => {},
};
export function setSnapshotPath(path: string) {
  pathname = path;
}
export function usePathname() {
  return pathname;
}
export function useSearchParams() {
  return searchParams;
}
export function useRouter() {
  return router;
}
export function useParams() {
  return {};
}
export function notFound(): never {
  throw new Error("Unexpected notFound in snapshot component");
}
export function redirect(): never {
  throw new Error("Unexpected redirect in snapshot component");
}
