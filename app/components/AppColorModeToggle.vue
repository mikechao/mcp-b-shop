<template>
  <UTooltip :text="tooltipLabel">
    <UButton
      variant="ghost"
      color="neutral"
      class="size-9 items-center justify-center rounded-full"
      :aria-pressed="isDark"
      :icon="iconName"
      @click="toggleMode"
    />
  </UTooltip>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

const iconName = computed(() =>
  isDark.value ? 'i-heroicons-sun-20-solid' : 'i-heroicons-moon-20-solid',
)

const tooltipLabel = computed(() =>
  isDark.value ? 'Switch to light mode' : 'Switch to dark mode',
)

function toggleMode() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<style scoped>
.size-9 {
  width: 2.25rem;
  height: 2.25rem;
}
</style>
