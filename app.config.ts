import { defineAppConfig } from 'nuxt/app'

export default defineAppConfig({
  ui: {
    colors: {
      primary: 'brand',
      secondary: 'accent',
      neutral: 'slate',
    },
    button: {
      slots: {
        base: 'rounded-[var(--radius-base)] cursor-pointer',
      },
    },
    input: {
      slots: {
        base: 'rounded-[var(--radius-base)]',
      },
    },
    card: {
      slots: {
        base: 'rounded-[var(--radius-xl)] shadow-[var(--shadow-subtle)]',
      },
    },
  },
})
