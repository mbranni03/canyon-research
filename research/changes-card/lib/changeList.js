/**
 * What the card's file list reads like. Ported from UnifiedApp
 * `apps/desktop/src/lib/sessionChanges.ts`.
 */
import { baseName } from "./fileIcons.js";

/**
 * @typedef {object} ChangedFile
 * @property {string} path        Repo-relative path.
 * @property {string} status      git's letter: A M D R U, or `?` for untracked.
 * @property {number} insertions
 * @property {number} deletions
 * @property {boolean} [binary]
 * @property {boolean} [submodule]
 */

/**
 * The rows to draw and how many fold into "+N more". Hiding exactly one file
 * is a worse trade than showing it — the "+1 more" row costs the same space.
 */
export function splitRows(files, max) {
  if (files.length <= max + 1) return { rows: [...files], hidden: 0 };
  return { rows: files.slice(0, max), hidden: files.length - max };
}

/**
 * Each row's label: the file name, plus its parent directory only when that
 * name repeats in the list (`index.ts` twice tells you nothing).
 */
export function labelPaths(paths) {
  const seen = new Map();
  for (const path of paths) {
    const name = baseName(path);
    seen.set(name, (seen.get(name) ?? 0) + 1);
  }
  return paths.map((path) => {
    const name = baseName(path);
    if ((seen.get(name) ?? 0) < 2) return name;
    const parent = path.split("/").filter(Boolean).slice(-2, -1)[0];
    return parent ? `${parent}/${name}` : name;
  });
}

/** Header text: "1 File Changed", "3 Files Changed". */
export function changedTitle(count) {
  return `${count} ${count === 1 ? "File" : "Files"} Changed`;
}
