<script setup>
/**
 * "N Files Changed" under the latest finished turn.
 *
 * Render it only under the thread's tail, and only when that turn has settled
 * and used tools; the next user message removes it with no dismiss state.
 * Data in, events out — the host owns undo, review and file reads.
 */
import { computed } from 'vue'
import ChangeRows from './ChangeRows.vue'
import { changedTitle } from '../lib/changeList.js'

const props = defineProps({
  /** @type {import('vue').PropType<import('../lib/changeList.js').ChangedFile[]>} */
  files: { type: Array, default: () => [] },
  /** The turn's changes were undone; the undo button becomes restore. */
  undone: { type: Boolean, default: false },
  /** Short sha when this card is a committed receipt (no undo). */
  committed: { type: String, default: '' },
  busy: { type: Boolean, default: false },
  error: { type: String, default: '' },
  max: { type: Number, default: 8 },
})
defineEmits(['undo', 'restore', 'review'])

const title = computed(() => {
  if (!props.files.length) return 'Changes undone'
  return props.committed ? `${changedTitle(props.files.length)} · Committed` : changedTitle(props.files.length)
})
</script>

<template>
  <section v-if="files.length || undone" class="scc" aria-label="Files changed by this response">
    <header class="scc__head">
      <span class="scc__title">{{ title }}</span>
      <span class="scc__grow" />
      <button
        v-if="!committed"
        type="button"
        class="scc__undo"
        :class="{ 'is-redo': undone }"
        :disabled="busy"
        :title="undone ? 'Restore the undone changes' : 'Undo these changes'"
        :aria-label="undone ? 'Restore the undone changes' : 'Undo these changes'"
        @click="$emit(undone ? 'restore' : 'undo')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M9 14 4 9l5-5" />
          <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
        </svg>
      </button>
      <button
        v-if="files.length"
        type="button"
        class="scc__action"
        :disabled="busy"
        title="Review these changes"
        @click="$emit('review', null)"
      >
        Review
      </button>
    </header>
    <ChangeRows v-if="files.length" :files="files" :max="max" @pick="$emit('review', $event)" />
    <p v-if="error" class="scc__err" role="status">{{ error }}</p>
  </section>
</template>
