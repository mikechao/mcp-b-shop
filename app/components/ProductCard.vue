<template>
  <article
    :class="cardClasses"
    :data-category="product.category"
  >
    <div class="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
      <img
        :src="product.image"
        :alt="product.title"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        loading="lazy"
      >
      <span class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
        {{ product.categoryLabel }}
      </span>
    </div>
    <div class="flex flex-1 flex-col gap-4 p-4">
      <div class="flex items-baseline justify-between gap-3">
        <span class="text-base font-semibold text-slate-900">{{ product.priceFormatted }}</span>
        <span
          v-if="product.ratingValue"
          class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
        >
          <UIcon name="i-heroicons-star-20-solid" class="size-4" aria-hidden="true" />
          {{ product.ratingValue }}
          <span
            v-if="product.ratingCount"
            class="text-[11px] font-medium text-amber-600/80"
          >
            ({{ product.ratingCount }})
          </span>
        </span>
      </div>
      <h2 class="line-clamp-2 text-sm font-medium text-slate-900">
        {{ product.title }}
      </h2>
      <p class="line-clamp-2 text-sm text-slate-500">
        {{ product.description }}
      </p>
      <div class="mt-auto flex flex-col gap-3">
        <UButton
          color="neutral"
          variant="soft"
          class="w-full justify-center rounded-full transition-transform duration-150 ease-out focus-visible:ring-2 focus-visible:ring-primary-200 active:scale-95"
          icon="i-heroicons-information-circle"
          :to="`/products/${product.id}`"
        >
          View details
        </UButton>
        <UButton
          color="primary"
          :loading="isAdding"
          :disabled="isAdding"
          class="w-full justify-center rounded-full transition-transform duration-150 ease-out focus-visible:ring-2 focus-visible:ring-primary-200 active:scale-95"
          icon="i-heroicons-shopping-cart-20-solid"
          @click="handleAddToCart"
        >
          Add to cart
        </UButton>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { DisplayProduct } from '~/types/display-product'

const props = defineProps({
  product: {
    type: Object as PropType<DisplayProduct>,
    required: true,
  },
  isPreviewTarget: {
    type: Boolean,
    default: false,
  },
  isPreviewMuted: {
    type: Boolean,
    default: false,
  },
  isAdding: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (event: 'add-to-cart', product: DisplayProduct): void
}>()

const cardClasses = computed(() => {
  const classes = [
    'group flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition duration-200 ease-out transition-transform transition-shadow focus-within:ring-2 focus-within:ring-primary-200 motion-safe:hover:-translate-y-1 hover:border-slate-300 motion-safe:hover:shadow-lg motion-safe:active:shadow-sm',
  ]

  if (props.isPreviewTarget) {
    classes.push('border-primary-200/80 shadow-[0_18px_45px_-26px_rgba(79,114,242,0.65)]')
  } else if (props.isPreviewMuted) {
    classes.push('opacity-60 saturate-[0.85]')
  }

  return classes
})

function handleAddToCart() {
  if (props.isAdding) {
    return
  }

  emit('add-to-cart', props.product)
}
</script>
