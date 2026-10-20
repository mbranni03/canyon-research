/**
 * Which icon a path gets on the changes card.
 *
 * Ported from UnifiedApp `apps/desktop/src/lib/fileIcons.ts`. Devicon has no
 * notion of a file extension, so the extension table is ours and only the
 * artwork is theirs. The mark answers "what kind of file is this", not "what
 * did git do to it" — the row's +/− counts already answer the second.
 *
 * Returns a path relative to `icons/` plus how to draw it:
 *   - `img`:   a brand mark, drawn as-is (`mono` marks are inverted in dark mode)
 *   - `glyph`: a single-colour drawing, painted with `currentColor` via CSS mask
 */

/** Extension → Devicon slug. Lower-cased, no leading dot. */
export const BY_EXT = {
  vue: "vuejs",
  ts: "typescript",
  tsx: "typescript",
  mts: "typescript",
  cts: "typescript",
  js: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  jsx: "javascript",
  rs: "rust",
  css: "css3",
  scss: "sass",
  sass: "sass",
  html: "html5",
  htm: "html5",
  md: "markdown",
  mdx: "markdown",
  py: "python",
  go: "go",
  java: "java",
  php: "php",
  rb: "ruby",
  swift: "swift",
  kt: "kotlin",
  kts: "kotlin",
  c: "c",
  h: "c",
  cc: "cplusplus",
  cpp: "cplusplus",
  cxx: "cplusplus",
  hpp: "cplusplus",
  cs: "csharp",
  sh: "bash",
  bash: "bash",
  zsh: "bash",
  yml: "yaml",
  yaml: "yaml",
};

/** Whole file names that carry their own identity, extension or not. */
export const BY_NAME = {
  dockerfile: "docker",
  ".dockerignore": "docker",
};

/** Pictures, SVG included: what matters is that it IS an image, not its encoder. */
export const IMAGE_EXTS = new Set([
  "svg", "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "ico", "icns", "tif", "tiff", "heic",
]);

/** JSON and its lax spellings — the orange brace glyph, not a brand logo. */
export const JSON_EXTS = new Set(["json", "jsonc", "json5"]);

/** Devicon draws these pure black; they are inverted on the dark theme. */
const MONO = new Set(["markdown", "rust"]);

export function baseName(path) {
  return path.split("/").filter(Boolean).pop() ?? path;
}

/** The extension, lower-cased without its dot, or "" (`.eslintrc` has none). */
function extensionOf(path) {
  const name = baseName(path).toLowerCase();
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1) : "";
}

/**
 * @param {string} path
 * @param {{ folder?: boolean, submodule?: boolean }} [opts]
 * @returns {{ kind: 'img' | 'glyph', file: string, tone: string, mono?: boolean }}
 */
export function iconFor(path, { folder = false, submodule = false } = {}) {
  if (folder) return { kind: "glyph", file: "glyphs/folder.svg", tone: "folder" };
  if (submodule) return { kind: "glyph", file: "glyphs/package.svg", tone: "package" };
  const name = baseName(path).toLowerCase();
  const ext = extensionOf(path);
  if (IMAGE_EXTS.has(ext)) return { kind: "glyph", file: "glyphs/image.svg", tone: "image" };
  if (JSON_EXTS.has(ext)) return { kind: "glyph", file: "glyphs/json.svg", tone: "json" };
  if (name === ".gitignore") return { kind: "img", file: "vscode-icons/file_type_git.svg", tone: "brand" };
  const slug = BY_NAME[name] ?? BY_EXT[ext];
  if (slug) return { kind: "img", file: `devicon/${slug}-original.svg`, tone: "brand", mono: MONO.has(slug) };
  return { kind: "glyph", file: "glyphs/file.svg", tone: "faint" };
}
