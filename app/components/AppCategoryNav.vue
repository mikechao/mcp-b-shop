<template>
  <nav aria-label="Product categories" class="flex flex-col gap-4">
    <div>
      <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Categories</p>
    </div>
    <UVerticalNavigation :links="navigationLinks" size="lg" class="-mx-2">
      <template #badge="{ link }">
        <span
          v-if="link.count !== undefined"
          class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
        >
          {{ link.count }}
        </span>
      </template>
    </UVerticalNavigation>
  </nav>
</template>

<script setup lang="ts">
type Category = {
  id: string
  label: string
  icon?: string
  count?: number
}

const props = defineProps<{
  modelValue: string
  categories: Category[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const navigationLinks = computed(() =>
  props.categories.map((category) => ({
    id: category.id,
    label: category.label,
    icon: category.icon ?? 'i-heroicons-tag',
    count: category.count,
    active: props.modelValue === category.id,
    click: () => emit('update:modelValue', category.id),
    'aria-current': props.modelValue === category.id ? 'page' : undefined,
  })),
)
</script>
