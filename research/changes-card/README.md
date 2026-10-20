# Changes card kit

The "N Files Changed" card that appears in the thread after an agent finishes a turn. It includes every file-type icon, the shared styling, Vue components, a sample gallery, and a guide to [tracking changes from the Claude CLI](claude-cli-change-tracking.md).

It is ported from UnifiedApp's desktop card: `apps/desktop/src/components/workspaces/{SessionChangesCard,ChangeRows,FileTypeIcon}.vue` and `src/lib/{fileIcons,sessionChanges}.ts`. The visual values are unchanged. The components here take props instead of reading Pinia stores, so they can be dropped into any Vue host.

## Preview

```bash
python3 -m http.server 4317 --directory research/changes-card
```

Open <http://localhost:4317/preview.html>. It has to be served over HTTP, not opened as a file, because the page imports `lib/*.js` as ES modules. The page shows the card in a thread, every state, and the full icon table, with a light/dark toggle.

## Contents

| Path | What it is |
|---|---|
| [`preview.html`](preview.html) | Sample gallery: in-thread card, 9 states, all icons |
| [`styles/changes-card.css`](styles/changes-card.css) | All card, row and icon styles plus light/dark tokens. Unscoped, shared by the preview and the components |
| [`components/ChangesCard.vue`](components/ChangesCard.vue) | The card. Props: `files`, `undone`, `committed`, `busy`, `error`, `max`. Events: `undo`, `restore`, `review(path \| null)` |
| [`components/ChangeRows.vue`](components/ChangeRows.vue) | The file list: icon, label, `new`, `+/−` or `binary`, and `+N more` |
| [`components/FileTypeIcon.vue`](components/FileTypeIcon.vue) | Path → icon (brand `<img>` or a masked single-colour glyph) |
| [`lib/fileIcons.js`](lib/fileIcons.js) | Extension and name → icon table (`iconFor(path)`) |
| [`lib/changeList.js`](lib/changeList.js) | `splitRows`, `labelPaths`, `changedTitle`, and the `ChangedFile` type |
| [`lib/claudeChanges.js`](lib/claudeChanges.js) | Claude CLI stream or hook events → `ChangedFile[]` |
| [`lib/check.js`](lib/check.js) | `node research/changes-card/lib/check.js`. Runs asserts against a real CLI capture |
| [`icons/`](icons/) | `devicon/` (21 brand marks, MIT), `vscode-icons/` (`.gitignore`, MIT), `glyphs/` (folder, package, json, image, file, undo) |

To use it in a Vue app, import the CSS once (or drop its `:root` token block if your theme already defines those tokens), then:

```vue
<ChangesCard :files="files" :undone="undone" @undo="undo" @restore="restore" @review="openDiff" />
```

`files` is `{ path, status, insertions, deletions, binary?, submodule? }[]`. Set `insertions` to `null` to show a placeholder row that has a name but no counts yet.

## Behavior rules (from the source)

- **The card exists only for the tail.** It appears under the latest assistant turn, only after the turn has settled and only if it used tools. The next user message removes it. Nothing is dismissed or persisted.
- **Header:** `1 File Changed` / `N Files Changed`, followed by Undo (icon) and Review (text). After an undo, the title reads `Changes undone` and the arrow mirrors into a restore button.
- **Committed receipt:** shows `… · Committed`, with Review only and no Undo. Each commit gets its own card.
- **Rows** show a 12px type icon, then the name, then `new` (for status `A` or `?`), then `+N` in green and `−N` in red. The `−N` column has a fixed 30px width so the counts line up. Binary files show `binary` instead of counts.
- **Labels** are the file name only. When two rows share a name, they show `parent/name`.
- **Cap:** 8 rows. Extra rows fold into `+N more`, but only when at least 2 would be hidden, because a `+1 more` row is no shorter than the row it replaces.
- **While busy**, Undo and Review are disabled. Clicking a row opens the review for that file.
- **Motion:** a 160ms fade-up on entry, turned off under `prefers-reduced-motion`.

## Icon rules

| Path | Icon |
|---|---|
| Known extension (`.ts .vue .rs .py .go …`, 37 in total) | Devicon brand mark. Markdown and Rust are inverted to `0.88` on dark |
| `Dockerfile`, `.dockerignore` | Docker |
| `.gitignore` | vscode-icons git mark |
| `.json .jsonc .json5` | Orange brace glyph (`#e8a33d`) |
| Images, SVG included | Image glyph |
| Submodule / folder | Package glyph / folder glyph in accent blue |
| Anything else | Plain page glyph in the faint ink colour |

The icon shows what kind of file it is, not what git did to it. The `+/−` counts already show that.

## Differences from UnifiedApp

- **Image glyph:** UnifiedApp uses Font Awesome's `faImage`. This kit uses a stroke glyph drawn for it, in the same 16px style.
- **Glyph colouring:** glyphs are painted with CSS `mask` plus `currentColor` instead of inline `<svg>`, so every icon is a file under `icons/`. The `--fti-src` value must be an **absolute** URL. A relative `url()` inside a custom property resolves against the stylesheet, not the page.

## Known limits (inherited from UnifiedApp)

- `labelPaths` adds only one parent directory, so `a/src/index.ts` and `b/src/index.ts` both read `src/index.ts`.
- Devicon's Bash mark is dark grey and is not inverted on the dark theme, so it has low contrast there. Adding `bash` to `MONO` would fix it.
- A deleted file shows `+0 −N`.
