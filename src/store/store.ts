import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import cartSlice from './slices/cart'
import authSlice from './slices/auth'
import bulkOrderSlice from './slices/bulkOrder'
import wishlistSlice from './slices/wishlist'
import { baseApi } from './api/baseApi'
import { blogApi } from './api/blogApi'
import { orderApi } from './api/orderApi'
import { reviewsApi } from './api/reviewsApi'

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    auth: authSlice,
    bulkOrder: bulkOrderSlice,
    wishlist: wishlistSlice,
    [baseApi.reducerPath]: baseApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(baseApi.middleware, blogApi.middleware, orderApi.middleware, reviewsApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch



