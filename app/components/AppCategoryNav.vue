<template>
  <nav
    aria-label="Product categories"
    class="flex flex-col gap-4"
    @mouseleave="handlePreview(null)"
  >
    <div>
      <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Categories</p>
    </div>
    <ul role="list" class="flex flex-col gap-1">
      <li v-for="category in categoryList" :key="category.id">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          :class="buttonClasses(category.id)"
          :aria-current="isActive(category.id) ? 'page' : undefined"
          @click="handleSelect(category.id)"
          @mouseenter="handlePreview(category.id)"
          @mouseleave="handlePreview(null)"
          @focus="handlePreview(category.id)"
          @blur="handlePreview(null)"
        >
          <span class="flex items-center gap-2">
            <span :class="iconClasses(category.id)">
              <component :is="category.icon" />
            </span>
            <span class="truncate">{{ category.label }}</span>
          </span>
          <span
            v-if="category.count !== undefined"
            class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
          >
            {{ category.count }}
          </span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import type { ProductCategory } from '~/types/category';

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  categories: {
    type: Array as PropType<ProductCategory[]>,
    default: () => [],
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'preview', value: string | null): void
  (event: 'selected', value: string): void
}>()

const categoryList = computed(() => props.categories)

function isActive(id: string) {
  return props.modelValue === id
}

function handleSelect(id: string) {
  if (!isActive(id)) {
    emit('update:modelValue', id)
  }

  emit('selected', id)
}

function buttonClasses(id: string) {
  return isActive(id)
    ? 'bg-primary-50 text-primary-600 ring-1 ring-primary-100'
    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
}

function iconClasses(id: string) {
  return [
    'inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg text-slate-500 transition',
    isActive(id)
      ? 'bg-primary-100 text-primary-600'
      : 'bg-slate-100',
  ]
}

function handlePreview(id: string | null) {
  emit('preview', id)
}
</script>
