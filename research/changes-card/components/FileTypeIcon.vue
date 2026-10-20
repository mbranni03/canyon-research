<script setup>
/**
 * A path's file-type mark. `lib/fileIcons.js` decides which icon; this file
 * only turns it into a bundled URL (Vite resolves the `new URL` pattern at
 * build time, so a packaged app needs no network).
 */
import { computed } from 'vue'
import { iconFor } from '../lib/fileIcons.js'

const props = defineProps({
  path: { type: String, required: true },
  size: { type: Number, default: 12 },
  folder: { type: Boolean, default: false },
  submodule: { type: Boolean, default: false },
})

const icon = computed(() => iconFor(props.path, { folder: props.folder, submodule: props.submodule }))
const src = computed(() => new URL(`../icons/${icon.value.file}`, import.meta.url).href)
</script>

<template>
  <img
    v-if="icon.kind === 'img'"
    class="fti"
    :class="{ 'is-mono': icon.mono }"
    :src="src"
    :width="size"
    :height="size"
    alt=""
    aria-hidden="true"
  />
  <span
    v-else
    class="fti fti--glyph"
    :class="`fti--${icon.tone}`"
    :style="{ width: `${size}px`, height: `${size}px`, '--fti-src': `url(${src})` }"
    aria-hidden="true"
  />
</template>
