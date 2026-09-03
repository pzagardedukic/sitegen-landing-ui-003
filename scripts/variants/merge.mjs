/*
 * Applying a fixture patch to website.json.
 *
 * A fixture is a patch, not a copy: a copy of the whole file would go stale the moment the
 * schema moves, and it would hide what the variant is actually testing. `null` deletes the
 * key — that is how "the customer uploaded no logo" is expressed. Arrays replace whole,
 * because a half-merged list of services is not a thing anyone means.
 */
export function applyPatch(base, patch) {
  const result = Array.isArray(base) ? [...base] : { ...base };

  for (const [key, value] of Object.entries(patch)) {
    if (value === null) {
      delete result[key];
      continue;
    }

    const isPlainObject = (candidate) =>
      typeof candidate === "object" && candidate !== null && !Array.isArray(candidate);

    if (isPlainObject(value) && isPlainObject(result[key])) {
      result[key] = applyPatch(result[key], value);
      continue;
    }

    result[key] = value;
  }

  return result;
}
