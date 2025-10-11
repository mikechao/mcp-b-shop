<template>
  <header
    class="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 shadow-sm backdrop-blur transition-colors duration-300 supports-[backdrop-filter]:backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/90 dark:shadow-md dark:shadow-slate-900/30"
    style="--app-header-height: 72px"
  >
    <UContainer class="flex h-[56px] items-center gap-4 text-slate-900 transition-colors duration-300 md:h-[64px] lg:h-[72px] dark:text-slate-100">
      <NuxtLink to="/" class="flex items-center gap-2" aria-label="MCP-B Shop home">
        <img
          alt="MCP-B Shop"
          src="/mcp-b-shop-logo.png"
          class="h-8 w-auto md:h-9 lg:h-10"
          loading="lazy"
        >
      </NuxtLink>

      <div class="flex flex-1 justify-center md:hidden">
        <UTooltip text="Search products">
          <UButton
            color="brand"
            variant="solid"
            class="w-full max-w-[220px] justify-center rounded-full"
            icon="i-heroicons-magnifying-glass-20-solid"
            aria-label="Search products"
            @click="openMobileSearch"
          >
            Search
          </UButton>
        </UTooltip>
      </div>

      <form class="hidden flex-1 flex-col items-center justify-center md:flex" @submit.prevent="onSubmit">
        <div
          class="relative w-full max-w-2xl rounded-full px-3 py-1 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary-400 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-slate-900"
          :class="[searchShellClasses]"
        >
          <UInput
            ref="desktopSearchField"
            v-model="query"
            aria-label="Search products"
            class="w-full"
            icon="i-heroicons-magnifying-glass-20-solid"
            input-class="rounded-full border-none bg-transparent pr-32 focus:ring-0"
            :placeholder="searchPlaceholder"
            size="lg"
            @focus="handleSearchFocus"
            @blur="handleSearchBlur"
          />
          <UButton
            type="submit"
            color="primary"
            class="absolute inset-y-1 right-1 hidden items-center justify-center gap-1 rounded-full px-5 text-sm font-semibold md:inline-flex"
            icon="i-heroicons-magnifying-glass-20-solid"
          >
            Search
          </UButton>
        </div>
        <p
          v-if="searchInventoryHint"
          class="mt-2 w-full max-w-2xl text-left text-xs font-medium text-slate-500 dark:text-slate-400 md:hidden"
        >
          {{ searchInventoryHint }}
        </p>
      </form>

      <div class="flex items-center gap-2 md:gap-3">
        <UTooltip text="View cart">
          <UButton
            variant="outline"
            color="brand"
            class="relative hidden min-w-max items-center gap-2 md:inline-flex"
            @click="emitOpenCart"
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
            @click="emitOpenCart"
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
      </div>
    </UContainer>

    <USlideover v-model:open="isSearchDialogOpen" side="top" class="md:hidden">
      <template #title>
        Search products
      </template>
      <template #body>
        <form class="space-y-4" @submit.prevent="handleMobileSubmit">
          <div
            class="relative w-full rounded-full px-3 py-1 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary-400 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-slate-900"
            :class="[searchShellClasses]"
          >
            <UInput
              ref="overlaySearchField"
              v-model="query"
              aria-label="Search products"
              class="w-full"
              icon="i-heroicons-magnifying-glass-20-solid"
              input-class="rounded-full border-none bg-transparent pr-24 focus:ring-0"
              :placeholder="searchPlaceholder"
              size="lg"
              @focus="handleSearchFocus"
              @blur="handleSearchBlur"
            />
            <UButton
              type="submit"
              color="primary"
              icon="i-heroicons-magnifying-glass-20-solid"
              class="absolute inset-y-1 right-1 flex items-center justify-center gap-1 rounded-full px-4 text-sm font-semibold"
            >
              Search
            </UButton>
          </div>
          <p v-if="searchInventoryHint" class="text-xs font-medium text-slate-500 dark:text-slate-400">
            {{ searchInventoryHint }}
          </p>
        </form>
      </template>
    </USlideover>
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

const desktopSearchField = ref()
const overlaySearchField = ref()
const isSearchFocused = ref(false)
const isSearchDialogOpen = ref(false)

const query = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})

const showCartBadge = computed(() => props.cartCount > 0)
const searchShellClasses = computed(() =>
  isSearchFocused.value
    ? 'bg-white shadow-[0_18px_38px_-22px_rgba(79,114,242,0.65)] dark:bg-slate-900/80 dark:shadow-[0_18px_38px_-22px_rgba(79,114,242,0.45)]'
    : 'bg-white/80 dark:bg-slate-900/60',
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
  const desktopInput = desktopSearchField.value?.inputRef as HTMLInputElement | undefined

  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    isSearchDialogOpen.value = true
    nextTick(() => {
      const input = overlaySearchField.value?.inputRef as HTMLInputElement | undefined
      input?.focus()
    })
    return
  }

  desktopInput?.focus()
}

function openMobileSearch() {
  isSearchDialogOpen.value = true
}

function onSubmit() {
  emit('search', query.value.trim())
}

function handleMobileSubmit() {
  onSubmit()
  isSearchDialogOpen.value = false
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

function emitOpenCart() {
  emit('open-cart')
}

watch(isSearchDialogOpen, (open) => {
  if (!open) {
    return
  }

  nextTick(() => {
    const input = overlaySearchField.value?.inputRef as HTMLInputElement | undefined
    input?.focus()
  })
})
</script>
