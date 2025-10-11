<template>
  <UCard class="border border-brand-200/60 bg-brand-50/60 shadow-sm shadow-brand-200/50">
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2 text-brand-700">
        <UIcon name="i-heroicons-megaphone" class="size-5" aria-hidden="true" />
        <h2 class="text-sm font-semibold uppercase tracking-wide">
          Demo notice
        </h2>
      </div>
      <div class="space-y-3">
        <p class="text-sm leading-relaxed text-brand-900">
          This shopping site is a demo for
          <NuxtLink
            to="https://mcp-b.ai"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-1 font-semibold text-brand-700 underline decoration-dotted underline-offset-4 hover:text-brand-800"
          >
            mcp-b.ai
            <UIcon name="i-heroicons-arrow-up-right-20-solid" class="size-4" aria-hidden="true" />
          </NuxtLink>
          , which lets you use natural language to interact with a website.
        </p>
        <div class="flex flex-wrap items-center gap-3">
          <p class="text-sm leading-relaxed text-brand-900">
            Get the Chrome extension and type “Search for orange cat in the MCP-B Shop” in the chat.
          </p>
          <UButton
            href="https://chromewebstore.google.com/detail/mcp-b-extension/daohopfhkdelnpemnhlekblhnikhdhfa"
            target="_blank"
            rel="noopener"
            color="primary"
            variant="solid"
            size="md"
            class="rounded-full shadow-[0_10px_20px_-12px_rgba(64,78,237,0.9)]"
            icon="i-heroicons-arrow-top-right-on-square-20-solid"
          >
            Get Extension
          </UButton>
        </div>
      </div>
    </div>
  </UCard>
</template>
