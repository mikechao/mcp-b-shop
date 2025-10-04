<template>
  <nav aria-label="Product categories" class="flex flex-col gap-4">
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
        >
          <span class="flex items-center gap-2">
            <span :class="iconClasses(category.id)">
              <img
                v-if="category.image"
                :src="category.image"
                alt=""
                class="h-full w-full object-cover"
                loading="lazy"
              >
              <UIcon
                v-else
                :name="category.icon ?? 'i-heroicons-tag'"
                class="size-4"
                aria-hidden="true"
              />
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
type Category = {
  id: string
  label: string
  icon?: string
  image?: string
  count?: number
}

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  categories: {
    type: Array as PropType<Category[]>,
    default: () => [],
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const categoryList = computed(() => props.categories)

function isActive(id: string) {
  return props.modelValue === id
}

function handleSelect(id: string) {
  if (!isActive(id)) {
    emit('update:modelValue', id)
  }
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
</script>
