# MCP-B Shop Ecommerce Layout Design

## Overview
This document defines the UX and visual design direction for the MCP-B Shop storefront landing experience. The goal is to establish a clear, accessible layout that highlights the product catalogue while supporting quick discovery via search and category browsing.

## Primary Goals
- Surface brand identity immediately through consistent logo placement and supporting color palette.
- Provide rapid product discovery via prominent search, category filtering, and visible cart access.
- Maintain a responsive grid that adapts gracefully from mobile to desktop while preserving hierarchy.
- Meet WCAG 2.1 AA contrast and interaction guidelines across all components.

## Page Structure
1. **Global Header Bar** (sticky)
2. **Content Frame** split into:
   - Left navigation rail containing category list
   - Main product grid area
3. **Supporting Elements** such as breadcrumbs, utility filters, pagination, and empty/loading states as Nuxt UI components.

### Header Composition
- **Container**: Full-width bar with a neutral background (`background-header`) and subtle shadow (`shadow-sm`). Height 72px desktop / 64px tablet / 56px mobile.
- **Logo Block**: Left-aligned slot featuring `/public/mcp-b-shop-logo.png`. Constrain to 40px height desktop, 32px mobile. Provide alt text “MCP-B Shop”. Logo is clickable to home route.
- **Search Group**: Centered flex cluster occupying max 640px width on desktop. Composition:
  - Input field using Nuxt UI `UInput` with rounded sweep (`border-radius: 9999px`). Placeholder “Search products”. Supports keyboard shortcuts (`/` focus) and voice input icon for future enhancement.
  - Search button to the right using `UButton` (filled brand color). Provide accessible label “Search products”. Keyboard trigger: Enter from input.
- **Cart Action**: Right-aligned `UButton` with outline style and cart icon (use `i-heroicons-shopping-cart` from Nuxt UI icon set). Include badge for item count (0 hidden). Provide tooltip “View cart”.
- **Responsiveness**: On screens <768px collapse search button into icon-only button appended within input; cart button becomes icon button.
- **Interaction States**: Focus ring `outline-brand 2px`, hover lighten background via tokens.

### Category Navigation
- **Placement**: Left column anchored below header; width 264px desktop, collapsible drawer on tablet/mobile triggered by “Browse categories” button above grid.
- **Content**:
  - Section title `Categories` (uppercase, small text).
  - List of categories using Nuxt UI `UNavigationMenu` or `UVerticalNavigation`. Items include icon, label, product count (optional). Active category highlights via background token `surface-subtle` and left accent border.
  - Provide “All products” default state pinned to top.
- **Accessibility**: List rendered as `nav` with `aria-label="Product categories"`. Keyboard focus order follows DOM order.

### Product Grid Area
- **Hero Strip (optional)**: Small intro text or breadcrumb subheader for context, e.g., "Featured Products".
- **Grid Layout**: Responsive CSS grid with gap tokens.
  - Desktop ≥1280px: 4 columns, card min width 280px.
  - Medium 960–1279px: 3 columns.
  - Tablet 640–959px: 2 columns.
  - Mobile <640px: 1 column with full bleed padding 16px.
- **Product Card**: Build with Nuxt UI card components.
  - Image ratio 4:5, object-fit: cover, radius 12px.
  - Include product name (two-line clamp), price, rating badge, “Add to cart” button.
  - Hover: elevate shadow, reveal quick actions (e.g., wishlist) via icon buttons.
  - Button uses primary brand color. Include skeleton loading state using `USkeleton`.
- **Empty State**: Display when search returns no results with illustration placeholder and CTA to reset filters.
- **Pagination / Infinite Scroll**: Provide bottom controls using `UPagination` or `ULoadMore` pattern.

## Design Tokens & Visual Language
- **Color Palette** (proposal):
  - `brand-primary`: #3D63DD (logo accent match).
  - `brand-secondary`: #F8B84A for highlights.
  - `surface-base`: #F7F8FC for background.
  - `surface-elevated`: #FFFFFF.
  - `text-primary`: #1B1F24.
  - `text-muted`: #5B6474.
  - `border-default`: #E0E5F2.
- **Typography**: Utilize default Nuxt UI typography with adjustments:
  - Headings use `font-semibold`.
  - Body text 16px base, line-height 1.5.
- **Spacing Scale**: Align with Tailwind 4 spacing. Key values: 8px, 12px, 16px, 24px, 32px.
- **Radius**: General radius 12px; pill actions 9999px.
- **Elevation**: Use Nuxt UI `shadow-sm` for header, `shadow-md` on hover states. Provide tokens for high contrast modes.

## Responsive Behaviour Summary
- Header condenses via stack layout on mobile: logo left, cart right, search triggers a full-width modal overlay when tapped.
- Category rail transitions to collapsible overlay accessible via top-left filter button on ≤ tablet.
- Grid column count adjusts using CSS grid; cards maintain 16px outer padding on mobile.

## Accessibility Considerations
- Search input labelled with `aria-label` and placeholder; maintain 3:1 contrast for placeholder text.
- Cart button includes accessible badge announcement (ARIA live region increments).
- Category navigation uses `aria-current="page"` to denote active filter.
- Ensure focus states highly visible with `outline-offset: 2px`.
- Provide skip link before header for screen reader quick access to main content.

## Interaction & Microcopy
- Zero-state microcopy examples:
  - Search empty: “We couldn’t find results for ‘{query}’. Try adjusting filters or browse categories.”
  - Category empty: “No products yet in this category. Check back soon or explore best sellers.”
- Loading skeletons for header search results and product cards maintain layout stability.
- Cart button uses toast confirmation when item added.

## Implementation Notes
- Create layout shell under `app/app.vue` with new header component (`app/components/AppHeader.vue`).
- Category list and product grid should live in route-level component under `app/routes/index/`.
- Utilize composables for fetching categories/products to keep UI reactive.
- Store design tokens in `app/assets/css/main.css` leveraging Tailwind config overrides.
- Prepare Figma kit mirroring component structure for future iteration.

## Next Steps
1. Translate this spec into Nuxt components, starting with header and navigation scaffolding.
2. Define Tailwind theme extensions aligning with proposed tokens.
3. Implement responsive behaviour and accessibility hooks (skip links, aria attributes).
4. Conduct quick hallway usability test focusing on search prominence and category discoverability.
