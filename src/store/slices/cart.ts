// import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { cartApi } from '../api/cartApi'

// export interface CartItem {
//   id: string // Logical ID: variant_id || product_id
//   recordId?: number // Database ID from cart table
//   productId?: string // Optional for backward compatibility with components that don't have it
//   variantId?: string | undefined
//   name: string
//   price: number
//   originalPrice?: number // ✅ Added original price
//   image: string
//   quantity: number
//   variant?: string | undefined // e.g., "Red - L"
//   description?: string
//   packingStandard?: string // ✅ Added packing standard
// }

// interface CartState {
//   items: CartItem[]
//   total: number
//   itemCount: number
//   isOpen: boolean
// }

// const initialState: CartState = {
//   items: [],
//   total: 0,
//   itemCount: 0,
//   isOpen: false
// }

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState,
//   reducers: {
//     addItem: (state, action: PayloadAction<CartItem>) => {
//       const existingItem = state.items.find(item => item.id === action.payload.id.toString())
//       if (existingItem) {
//         existingItem.quantity += action.payload.quantity
//       } else {
//         state.items.push({ ...action.payload, id: action.payload.id.toString() })
//       }
//       cartSlice.caseReducers.calculateTotals(state)
//     },
//     setItem: (state, action: PayloadAction<CartItem>) => {
//       const existingItem = state.items.find(item => item.id === action.payload.id.toString())
//       if (existingItem) {
//         existingItem.quantity = action.payload.quantity
//       } else {
//         state.items.push({ ...action.payload, id: action.payload.id.toString() })
//       }
//       cartSlice.caseReducers.calculateTotals(state)
//     },
//     removeItem: (state, action: PayloadAction<string>) => {
//       state.items = state.items.filter(item => item.id !== action.payload)
//       cartSlice.caseReducers.calculateTotals(state)
//     },
//     updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
//       const item = state.items.find(item => item.id === action.payload.id)
//       if (item) {
//         if (action.payload.quantity <= 0) {
//           state.items = state.items.filter(item => item.id !== action.payload.id)
//         } else {
//           item.quantity = action.payload.quantity
//         }
//       }
//       cartSlice.caseReducers.calculateTotals(state)
//     },
//     // ✅ NEW: Clear all items from cart
//     clearCart: (state) => {
//       state.items = []
//       state.itemCount = 0
//       state.total = 0
//     },
//     toggleCart: (state) => {
//       state.isOpen = !state.isOpen
//     },
//     calculateTotals: (state) => {
//       state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
//       state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
//     },
//     syncCart: (state, action: PayloadAction<CartItem[]>) => {
//       state.items = action.payload
//       cartSlice.caseReducers.calculateTotals(state)
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addMatcher(
//       cartApi.endpoints.getCart.matchFulfilled,
//       (state, { payload }) => {
//         if (payload.success && payload.data) {
//           console.log('📥 Cart data from API:', payload.data);
//           state.items = payload.data.map((item: any) => {
//             let images = []
//             try {
//               images = typeof item.product_images === 'string' ? JSON.parse(item.product_images) : item.product_images
//             } catch (e) {
//               images = []
//             }
//             let variants: any[] = []
//             try {
//               variants = typeof item.variants === 'string' ? JSON.parse(item.variants) : (item.variants || [])
//             } catch (e) {
//               console.warn('Failed to parse variants for item:', item.id, e)
//               variants = []
//             }

//             const currentVariant = Array.isArray(variants)
//               ? variants.find((v: any) => (v.variantId || v.id) === item.variant_id)
//               : null;

//             const variantLabel = currentVariant
//               ? `${currentVariant.color?.name || currentVariant.color || ''} - ${currentVariant.size || ''}`
//               : (item.variant_id && item.variant_id !== 'default' ? item.variant_id : undefined);

//             const mapped = {
//               id: (item.variant_id && item.variant_id !== 'default' ? item.variant_id : item.product_id.toString()).toString(),
//               recordId: item.id,
//               productId: item.product_id.toString(),
//               variantId: item.variant_id && item.variant_id !== 'default' ? item.variant_id : undefined,
//               name: item.name,
//               price: item.discount_price || item.price,
//               originalPrice: item.price || undefined, // ✅ Added original price
//               image: Array.isArray(images) ? images[0] || '' : '',
//               quantity: item.quantity,
//               variant: variantLabel,
//               packingStandard: item.packing_standard || undefined, // ✅ Added packing standard
//             };
//             return mapped;
//           })
//           cartSlice.caseReducers.calculateTotals(state)
//         }
//       }
//     )
//   },
// })

// export const { addItem, setItem, removeItem, updateQuantity, toggleCart, syncCart, clearCart } = cartSlice.actions
// export default cartSlice.reducer


import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { cartApi } from '../api/cartApi'

export interface CartItem {
  id: string // Logical ID: variant_id || product_id
  recordId?: number // Database ID from cart table
  productId?: string // Optional for backward compatibility with components that don't have it
  variantId?: string | undefined
  name: string
  price: number
  originalPrice?: number // ✅ Added original price
  image: string
  quantity: number
  variant?: string | undefined // e.g., "Red - L"
  description?: string
  packingStandard?: string // ✅ Added packing standard
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  isOpen: boolean
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id.toString())
      if (existingItem) {
        // Item already in cart: bump quantity AND move it to the front,
        // since it was just interacted with again.
        existingItem.quantity += action.payload.quantity
        state.items = [
          existingItem,
          ...state.items.filter(item => item.id !== existingItem.id),
        ]
      } else {
        // ✅ FIX (Issue 1): newest item goes to the FRONT of the array,
        // not the end. Previously this was state.items.push(...).
        state.items.unshift({ ...action.payload, id: action.payload.id.toString() })
      }
      cartSlice.caseReducers.calculateTotals(state)
    },
    setItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id.toString())
      if (existingItem) {
        existingItem.quantity = action.payload.quantity
      } else {
        // Keep same "newest first" behavior for consistency.
        state.items.unshift({ ...action.payload, id: action.payload.id.toString() })
      }
      cartSlice.caseReducers.calculateTotals(state)
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      cartSlice.caseReducers.calculateTotals(state)
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id)
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(item => item.id !== action.payload.id)
        } else {
          item.quantity = action.payload.quantity
        }
      }
      cartSlice.caseReducers.calculateTotals(state)
    },
    // ✅ Clear all items from cart
    clearCart: (state) => {
      state.items = []
      state.itemCount = 0
      state.total = 0
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },
    calculateTotals: (state) => {
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    syncCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
      cartSlice.caseReducers.calculateTotals(state)
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      cartApi.endpoints.getCart.matchFulfilled,
      (state, { payload }) => {
        if (payload.success && payload.data) {
          console.log('📥 Cart data from API:', payload.data);
          state.items = payload.data.map((item: any) => {
            let images = []
            try {
              images = typeof item.product_images === 'string' ? JSON.parse(item.product_images) : item.product_images
            } catch (e) {
              images = []
            }
            let variants: any[] = []
            try {
              variants = typeof item.variants === 'string' ? JSON.parse(item.variants) : (item.variants || [])
            } catch (e) {
              console.warn('Failed to parse variants for item:', item.id, e)
              variants = []
            }

            const currentVariant = Array.isArray(variants)
              ? variants.find((v: any) => (v.variantId || v.id) === item.variant_id)
              : null;

            const variantLabel = currentVariant
              ? `${currentVariant.color?.name || currentVariant.color || ''} - ${currentVariant.size || ''}`
              : (item.variant_id && item.variant_id !== 'default' ? item.variant_id : undefined);

            const mapped = {
              id: (item.variant_id && item.variant_id !== 'default' ? item.variant_id : item.product_id.toString()).toString(),
              recordId: item.id,
              productId: item.product_id.toString(),
              variantId: item.variant_id && item.variant_id !== 'default' ? item.variant_id : undefined,
              name: item.name,
              price: item.discount_price || item.price,
              originalPrice: item.price || undefined, // ✅ Added original price
              image: Array.isArray(images) ? images[0] || '' : '',
              quantity: item.quantity,
              variant: variantLabel,
              packingStandard: item.packing_standard || undefined, // ✅ Added packing standard
            };
            return mapped;
          })
          // ✅ FIX (Issue 1, server-sync path): sort newest-first using the
          // DB primary key (item.id from the cart table = recordId here).
          // Higher recordId == inserted later == should appear first.
          // This makes ordering correct even if the backend query itself
          // returns rows in ascending/insertion order.
          state.items.sort((a, b) => (b.recordId ?? 0) - (a.recordId ?? 0))
          cartSlice.caseReducers.calculateTotals(state)
        }
      }
    )
  },
})

export const { addItem, setItem, removeItem, updateQuantity, toggleCart, syncCart, clearCart } = cartSlice.actions
export default cartSlice.reducer