<script setup>
/**
 * The card's file list: type icon, de-duplicated label, "new" for files that
 * were not there before, and +/− when known (or "binary").
 */
import { computed } from 'vue'
import FileTypeIcon from './FileTypeIcon.vue'
import { labelPaths, splitRows } from '../lib/changeList.js'

const props = defineProps({
  /** @type {import('vue').PropType<import('../lib/changeList.js').ChangedFile[]>} */
  files: { type: Array, required: true },
  /** Rows past this fold into "+N more". */
  max: { type: Number, default: 8 },
  /** Static rows that do not open anything. */
  readonly: { type: Boolean, default: false },
})
const emit = defineEmits(['pick'])

const view = computed(() => {
  const { rows, hidden } = splitRows(props.files, props.max)
  const labels = labelPaths(rows.map((file) => file.path))
  return { hidden, rows: rows.map((file, i) => ({ file, label: labels[i] })) }
})

/** Counts are unknown until a diff read lands; a placeholder row shows only the name. */
const hasCounts = (file) => file.insertions != null
</script>

<template>
  <div class="cs__list" :class="{ 'cs__list--more': view.hidden }">
    <component
      :is="readonly ? 'div' : 'button'"
      v-for="{ file, label } in view.rows"
      :key="file.path"
      :type="readonly ? undefined : 'button'"
      class="cs__row"
      :title="file.path"
      @click="!readonly && emit('pick', file.path)"
    >
      <FileTypeIcon :path="file.path" :submodule="file.submodule" />
      <span class="cs__name">{{ label }}</span>
      <span v-if="file.status === 'A' || file.status === '?'" class="cs__new">new</span>
      <span v-if="file.binary" class="cs__bin">binary</span>
      <template v-else-if="hasCounts(file)">
        <span class="cs-add">+{{ file.insertions }}</span>
        <span class="cs-del">{{ file.deletions ? `−${file.deletions}` : '' }}</span>
      </template>
    </component>
    <p v-if="view.hidden" class="cs__more">+{{ view.hidden }} more</p>
  </div>
</template>
