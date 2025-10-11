<template>
  <section class='space-y-8'>
    <UBreadcrumb :links='breadcrumbLinks' />

    <header class='space-y-4 text-center'>
      <h1 class='text-3xl font-semibold text-slate-900'>Checkout</h1>
      <p class='mx-auto max-w-2xl text-sm text-slate-600'>
        Thanks for choosing MCP-B Shop. This experience is a demonstration, so we never collect
        personal details such as addresses or payment card information.
      </p>
    </header>

    <div v-if='isEmpty' class='mx-auto max-w-2xl'>
      <UCard class='flex flex-col items-center gap-4 border border-dashed border-slate-200 bg-white/80 py-12 text-center'>
        <UIcon name='i-heroicons-shopping-cart' class='size-12 text-slate-300' aria-hidden='true' />
        <div class='space-y-2'>
          <p class='text-lg font-semibold text-slate-900'>Your cart is empty</p>
          <p class='text-sm text-slate-500'>Add a few items to generate an invoice and complete your demo checkout.</p>
        </div>
        <UButton color='primary' icon='i-heroicons-arrow-uturn-left' to='/'>
          Continue shopping
        </UButton>
      </UCard>
    </div>

    <div v-else class='grid gap-6 lg:grid-cols-[2fr_1fr]'>
      <UCard class='border border-slate-200/80 bg-white/90 shadow-sm'>
        <div class='flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 pb-4'>
          <div>
            <p class='text-xs font-medium uppercase tracking-wide text-slate-500'>Invoice</p>
            <p class='text-base font-semibold text-slate-900'>{{ invoiceNumber }}</p>
          </div>
          <div class='text-right text-xs text-slate-500'>
            <p>Issued {{ issuedDate }}</p>
            <p>Payment due {{ dueDate }}</p>
          </div>
        </div>

        <div class='space-y-6 pt-6'>
          <div class='overflow-hidden rounded-2xl border border-slate-200/70'>
            <table class='min-w-full divide-y divide-slate-200 text-sm text-slate-600'>
              <thead class='bg-slate-50 text-xs uppercase tracking-wide text-slate-500'>
                <tr>
                  <th scope='col' class='px-4 py-3 text-left font-semibold'>Item</th>
                  <th scope='col' class='px-4 py-3 text-center font-semibold'>Quantity</th>
                  <th scope='col' class='px-4 py-3 text-right font-semibold'>Unit price</th>
                  <th scope='col' class='px-4 py-3 text-right font-semibold'>Line total</th>
                </tr>
              </thead>
              <tbody class='divide-y divide-slate-200 bg-white'>
                <tr v-for='item in lineItems' :key='item.id' class='align-top'>
                  <td class='px-4 py-4'>
                    <div class='flex gap-3'>
                      <img :src='item.image' :alt='item.title' class='h-14 w-14 rounded-xl object-cover' loading='lazy'>
                      <div class='space-y-1'>
                        <p class='text-sm font-medium text-slate-900'>{{ item.title }}</p>
                        <p class='text-xs uppercase tracking-wide text-slate-500'>{{ item.categoryLabel }}</p>
                      </div>
                    </div>
                  </td>
                  <td class='px-4 py-4 text-center font-semibold text-slate-900'>{{ item.quantity }}</td>
                  <td class='px-4 py-4 text-right text-slate-700'>{{ item.unitPrice }}</td>
                  <td class='px-4 py-4 text-right font-semibold text-slate-900'>{{ item.lineTotal }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class='space-y-3 rounded-2xl bg-slate-50 px-4 py-4'>
            <div class='flex items-center justify-between text-sm text-slate-600'>
              <span>Subtotal</span>
              <span class='font-medium text-slate-900'>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class='flex items-center justify-between text-sm text-slate-600'>
              <span>Estimated tax ({{ taxRateLabel }})</span>
              <span class='font-medium text-slate-900'>{{ formatPrice(estimatedTax) }}</span>
            </div>
            <div class='flex items-center justify-between text-sm text-slate-600'>
              <span>Shipping</span>
              <span class='font-medium text-primary-600'>Free</span>
            </div>
            <div class='border-t border-slate-200/70 pt-3'>
              <div class='flex items-center justify-between text-base font-semibold text-slate-900'>
                <span>Total due</span>
                <span>{{ formatPrice(totalDue) }}</span>
              </div>
              <p class='mt-1 text-xs text-slate-500'>Includes {{ itemCountLabel }} from your cart.</p>
            </div>
          </div>
        </div>
      </UCard>

      <div class='space-y-6'>
        <UCard class='border border-slate-200/70 bg-white/90 shadow-sm'>
          <div class='space-y-3'>
            <h2 class='text-base font-semibold text-slate-900'>Next steps</h2>
            <ul class='space-y-2 text-sm text-slate-600'>
              <li class='flex items-start gap-2'>
                <UIcon name='i-heroicons-document-text' class='mt-1 size-4 text-primary-500' aria-hidden='true' />
                <span>Save this invoice for your records or share it with teammates evaluating MCP-B Shop.</span>
              </li>
              <li class='flex items-start gap-2'>
                <UIcon name='i-heroicons-cog-6-tooth' class='mt-1 size-4 text-primary-500' aria-hidden='true' />
                <span>Explore order management flows like adjusting quantities or clearing the cart to simulate fulfillment.</span>
              </li>
              <li class='flex items-start gap-2'>
                <UIcon name='i-heroicons-lifebuoy' class='mt-1 size-4 text-primary-500' aria-hidden='true' />
                <span>Reach out if you have feedback on the demo experience — we are eager to improve it.</span>
              </li>
            </ul>
          </div>
        </UCard>

        <UCard class='border border-slate-200/70 bg-white/90 shadow-sm'>
          <div class='space-y-3'>
            <h2 class='text-base font-semibold text-slate-900'>Need a hand?</h2>
            <p class='text-sm text-slate-600'>Our demo support team can help you with API integrations, bulk product imports, or MCP-B documentation.</p>
            <div class='space-y-2 text-sm text-slate-600'>
              <p><span class='font-medium text-slate-900'>Email:</span> <a class='text-primary-600 underline-offset-2 hover:underline' href='mailto:support@mcp-b.shop'>support@mcp-b.shop</a></p>
              <p><span class='font-medium text-slate-900'>Docs:</span> Review the MCP-B Shop README for integration tips and API coverage.</p>
              <p><span class='font-medium text-slate-900'>Hours:</span> Monday–Friday, 9am–5pm PT</p>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <div class='flex justify-center pt-4'>
      <UButton color='primary' icon='i-heroicons-home' to='/'>
        Back to home
      </UButton>
    </div>
  </section>
</template>

<script setup lang='ts'>
import { useCartStore } from '../stores/cart'
import type { CartItem } from '../stores/cart'

const cartStore = useCartStore()

useSeoMeta({
  title: 'Checkout – MCP-B Shop',
  description: 'Review a simulated invoice and next steps for the MCP-B Shop demo checkout experience.',
})

const breadcrumbLinks = [
  { label: 'Home', to: '/' },
  { label: 'Checkout' },
]

const generatedAt = useState('checkout-generated-at', () => new Date().toISOString())
const invoiceNumber = useState('checkout-invoice-number', () => generateInvoiceNumber())

const TAX_RATE = 0.0825

const invoiceItems = ref<CartItem[]>(cartStore.items.map(item => ({ ...item })))

onMounted(() => {
  if (invoiceItems.value.length > 0) {
    cartStore.clear()
  }
})

const isEmpty = computed(() => invoiceItems.value.length === 0)
const subtotal = computed(() =>
  roundCurrency(invoiceItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)),
)
const estimatedTax = computed(() => roundCurrency(subtotal.value * TAX_RATE))
const totalDue = computed(() => roundCurrency(subtotal.value + estimatedTax.value))
const totalQuantity = computed(() => invoiceItems.value.reduce((sum, item) => sum + item.quantity, 0))
const itemCountLabel = computed(() => {
  const noun = totalQuantity.value === 1 ? 'item' : 'items'
  return `${totalQuantity.value} ${noun}`
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' })

const issuedDate = computed(() => formatDate(generatedAt.value))
const dueDate = computed(() => formatDate(addDays(generatedAt.value, 7)))
const taxRateLabel = computed(() => `${(TAX_RATE * 100).toFixed(2)}%`)

const lineItems = computed(() =>
  invoiceItems.value.map((item) => ({
    id: item.id,
    title: item.title,
    image: item.image,
    quantity: item.quantity,
    categoryLabel: formatCategoryLabel(item.category),
    unitPrice: formatPrice(item.price),
    lineTotal: formatPrice(item.price * item.quantity),
  })),
)

function formatPrice(value: number) {
  return currencyFormatter.format(value)
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100
}

function formatCategoryLabel(value: string) {
  return value
    .split(' ')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

function addDays(value: string, days: number) {
  const date = new Date(value)
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

function generateInvoiceNumber() {
  const base = Math.floor(100000 + Math.random() * 900000)
  return `MCP-${base}`
}
</script>
