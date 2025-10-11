<template>
  <div class="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm shadow-slate-200/40">
    <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Active filters</span>
    <div class="flex flex-wrap items-center gap-2">
      <span
        v-if="isCategoryFiltered"
        class="inline-flex items-center gap-2 rounded-full border border-primary-200/70 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
      >
        {{ categoryLabel }}
        <button
          type="button"
          class="inline-flex size-5 items-center justify-center rounded-full text-primary-600 transition hover:bg-primary-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-400"
          @click="$emit('clear-category')"
        >
          <UIcon name="i-heroicons-x-mark" class="size-3.5" aria-hidden="true" />
          <span class="sr-only">Clear category filter</span>
        </button>
      </span>
      <span
        v-if="isSearchFiltered"
        class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
      >
        “{{ searchQuery }}”
        <button
          type="button"
          class="inline-flex size-5 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-400"
          @click="$emit('clear-search')"
        >
          <UIcon name="i-heroicons-x-mark" class="size-3.5" aria-hidden="true" />
          <span class="sr-only">Clear search filter</span>
        </button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isCategoryFiltered: {
    type: Boolean,
    default: false,
  },
  categoryLabel: {
    type: String,
    default: '',
  },
  isSearchFiltered: {
    type: Boolean,
    default: false,
  },
  searchQuery: {
    type: String,
    default: '',
  },
})

defineEmits<{
  (event: 'clear-category'): void
  (event: 'clear-search'): void
}>()
</script>
