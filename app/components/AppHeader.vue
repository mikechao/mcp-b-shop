<template>
  <header
    class="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur"
    style="--app-header-height: 72px"
  >
    <UContainer class="flex h-[56px] items-center gap-4 md:h-[64px] lg:h-[72px]">
      <NuxtLink to="/" class="flex items-center gap-2" aria-label="MCP-B Shop home">
        <img
          alt="MCP-B Shop"
          src="/mcp-b-shop-logo.png"
          class="h-8 w-auto md:h-9 lg:h-10"
          loading="lazy"
        >
      </NuxtLink>

      <form class="flex flex-1 flex-col items-center justify-center" @submit.prevent="onSubmit">
        <div
          class="flex w-full max-w-2xl items-center gap-2 rounded-full border px-3 py-1 transition-all duration-200"
          :class="searchShellClasses"
        >
          <UInput
            ref="searchField"
            v-model="query"
            aria-label="Search products"
            class="flex-1"
            icon="i-heroicons-magnifying-glass-20-solid"
            input-class="rounded-full border-none bg-transparent focus:ring-0"
            :placeholder="searchPlaceholder"
            size="lg"
            @focus="handleSearchFocus"
            @blur="handleSearchBlur"
          />
          <UButton
            type="submit"
            color="primary"
            class="hidden md:inline-flex"
            icon="i-heroicons-magnifying-glass-20-solid"
          >
            Search
          </UButton>
          <UTooltip text="Search products">
            <UButton
              type="submit"
              color="brand"
              variant="solid"
              class="md:hidden"
              square
              icon="i-heroicons-magnifying-glass-20-solid"
              aria-label="Search products"
            />
          </UTooltip>
        </div>
        <p
          v-if="searchInventoryHint"
          class="mt-2 w-full max-w-2xl text-left text-xs font-medium text-slate-500 md:hidden"
        >
          {{ searchInventoryHint }}
        </p>
      </form>

      <UTooltip text="View cart">
        <UButton
          variant="outline"
          color="brand"
          class="relative hidden min-w-max items-center gap-2 md:inline-flex"
          @click="emit('open-cart')"
        >
          <UIcon name="i-heroicons-shopping-cart-20-solid" class="size-5" aria-hidden="true" />
          <span class="hidden text-sm font-medium md:inline">Cart</span>
          <span
            v-if="showCartBadge"
            class="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary-600 px-1 text-xs font-semibold text-white"
            role="status"
            aria-live="polite"
          >
            {{ cartCount }}
          </span>
        </UButton>
      </UTooltip>
      <UTooltip text="View cart" class="md:hidden">
        <UButton
          variant="outline"
          color="brand"
          square
          class="relative md:hidden"
          aria-label="View cart"
          @click="emit('open-cart')"
        >
          <UIcon name="i-heroicons-shopping-cart-20-solid" class="size-5" aria-hidden="true" />
          <span
            v-if="showCartBadge"
            class="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary-600 px-1 text-xs font-semibold text-white"
            role="status"
            aria-live="polite"
          >
            {{ cartCount }}
          </span>
        </UButton>
      </UTooltip>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  cartCount: {
    type: Number,
    default: 0,
  },
  productCount: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'search', value: string): void
  (event: 'open-cart'): void
}>()

const searchField = ref()
const isSearchFocused = ref(false)

const query = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})

const showCartBadge = computed(() => props.cartCount > 0)
const searchShellClasses = computed(() =>
  isSearchFocused.value
    ? 'border-primary-200/80 bg-white shadow-[0_18px_38px_-22px_rgba(79,114,242,0.65)]'
    : 'border-slate-200/60 bg-white/80',
)
const searchPlaceholder = computed(() =>
  query.value
    ? 'Search products'
    : 'Search products (press /)',
)
const searchInventoryHint = computed(() => {
  if (props.productCount > 0) {
    const noun = props.productCount === 1 ? 'product' : 'products'
    const suffix = props.productCount >= 20 ? '+' : ''
    return `Search ${props.productCount}${suffix} ${noun}`
  }

  return 'Search our catalogue'
})

function focusSearch() {
  const input = searchField.value?.inputRef as HTMLInputElement | undefined
  input?.focus()
}

function onSubmit() {
  emit('search', query.value.trim())
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) {
    return
  }

  const target = event.target as HTMLElement | null
  const isTyping = target && ['INPUT', 'TEXTAREA'].includes(target.tagName)

  if (isTyping) {
    return
  }

  event.preventDefault()
  focusSearch()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown, { capture: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown, { capture: true })
})

function handleSearchFocus() {
  isSearchFocused.value = true
}

function handleSearchBlur() {
  isSearchFocused.value = false
}
</script>
