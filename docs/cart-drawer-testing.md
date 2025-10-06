# Cart Drawer Testing Guide

## Quick Test Steps

### 1. Basic Functionality Test
1. Open http://localhost:3000 in your browser
2. Click "Add to cart" on any product
3. You should see a toast notification confirming the item was added
4. The cart button in the header should show a badge with "1"
5. Click the "Cart" button in the header
6. **Expected**: The cart drawer should slide in from the right side and be fully visible
7. **Expected**: You should see the added product with its image, title, price, and quantity controls

### 2. Cart Interaction Test
1. With the cart drawer open:
   - Click the "+" button to increase quantity
   - Click the "-" button to decrease quantity
   - Click the trash icon to remove the item
   - **Expected**: All actions should work smoothly
2. Close the cart by clicking:
   - The "Continue shopping" button, or
   - The "Proceed to checkout" button, or
   - The overlay background (if overlay is enabled)

### 3. Multiple Items Test
1. Add multiple different products to the cart
2. Open the cart drawer
3. **Expected**: All items should be listed with proper formatting
4. **Expected**: The subtotal should correctly sum all items
5. **Expected**: The item count should be accurate

### 4. Visual Regression Test
1. With the cart drawer open, scroll the page
2. **Expected**: The drawer should stay fixed and visible
3. Resize the browser window
4. **Expected**: The drawer should remain visible and properly positioned
5. Test on mobile viewport (DevTools responsive mode)
6. **Expected**: The cart drawer should work on all screen sizes

### 5. Edge Cases
1. Open the cart when it's empty
2. **Expected**: Should show "Your cart is empty" message with a link to continue shopping
3. Add an item, then decrease its quantity to 0
4. **Expected**: Item should be removed from cart
5. Rapidly click "Add to cart" on the same product
6. **Expected**: Quantity should increment correctly without issues

## Known Issues Resolved

### Issue: Cart drawer not visible
**Status**: ✅ FIXED

**Previous behavior**: Clicking the cart button would toggle the `isOpen` state, but the USlideover component remained invisible or hidden off-screen.

**Root cause**: Stacking context issues with teleported overlays and insufficient z-index compared to the sticky header.

**Fix applied**:
- Added `isolate` class to `UApp` component
- Enhanced CSS to target Reka UI portal containers with proper z-index
- Ensured dialog elements have correct positioning and pointer events
- Cleaned up event listeners

### Issue: Transform animations breaking visibility
**Status**: ✅ FIXED

**Previous behavior**: Overly aggressive CSS overrides prevented the slide-in animation from working or caused the drawer to be positioned incorrectly.

**Fix applied**: Refined CSS to target only portal containers and dialogs without overriding transform properties globally, allowing animations to work naturally.

## Browser Compatibility

Tested and working on:
- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## Performance Notes

- The cart drawer uses Nuxt UI's USlideover component, which leverages Reka UI
- Overlays are teleported to the body for proper z-index stacking
- Animations are hardware-accelerated via CSS transforms
- No performance issues observed with typical cart sizes (< 100 items)

## Debugging Tips

If the cart drawer still doesn't appear:

1. **Check browser console**: Look for any JavaScript errors
2. **Inspect DOM**: Use DevTools to search for `[role="dialog"]` or `[data-state="open"]`
3. **Check z-index**: Look for elements with `z-index` higher than 9999 that might overlap
4. **Verify v-model**: Add a console.log to confirm `isCartDrawerOpen` is being set to `true`
5. **Check CSS**: Ensure `main.css` has the portal/overlay rules and they're not being overridden
6. **Verify UApp**: Confirm `<UApp>` has the `isolate` class applied

## Code References

### Cart State Management
- **Store**: `app/stores/cart.ts` - Pinia store managing cart items
- **Methods**: `addItem`, `increaseQuantity`, `decreaseQuantity`, `removeItem`, `clear`
- **Getters**: `totalQuantity`, `totalPrice`, `isEmpty`

### Cart UI Components
- **Main App**: `app/app.vue` - Handles cart drawer open/close state
- **Header**: `app/components/AppHeader.vue` - Cart button and badge display
- **Drawer**: `app/components/AppCartDrawer.vue` - Cart slideover implementation

### Event Flow
```
User clicks cart button
  ↓
AppHeader emits 'open-cart' event
  ↓
app.vue handles event → handleOpenCart()
  ↓
isCartDrawerOpen.value = true
  ↓
AppCartDrawer v-model updates → opens USlideover
  ↓
USlideover teleports to portal → renders with correct z-index
  ↓
Cart drawer visible and interactive
```

## Future Enhancements

Potential improvements (not currently implemented):
- [ ] Persist cart state to localStorage
- [ ] Add transition for quantity changes
- [ ] Show product variants (size, color) in cart
- [ ] Add mini cart preview on hover
- [ ] Implement cart abandonment tracking
- [ ] Add "Recently added" section
- [ ] Show estimated shipping costs
- [ ] Add promo code input
- [ ] Implement "Save for later" functionality
- [ ] Add cart item recommendations

## Support

If you encounter issues:
1. Review the solution document: `docs/cart-drawer-solution.md`
2. Check the original issue document: `docs/cart-drawer-issue.md`
3. Verify all files have the latest changes
4. Clear browser cache and restart dev server
5. Check that all dependencies are installed: `pnpm install`
