import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface WishlistState {
  items: string[]
}

const stored = localStorage.getItem('wishlist')
const initial: WishlistState = stored ? JSON.parse(stored) : { items: [] }

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: initial,
  reducers: {
    addToWishlist(state, action: PayloadAction<string>) {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload)
        localStorage.setItem('wishlist', JSON.stringify(state))
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter(id => id !== action.payload)
      localStorage.setItem('wishlist', JSON.stringify(state))
    },
    toggleWishlist(state, action: PayloadAction<string>) {
      const idx = state.items.indexOf(action.payload)
      if (idx === -1) {
        state.items.push(action.payload)
      } else {
        state.items.splice(idx, 1)
      }
      localStorage.setItem('wishlist', JSON.stringify(state))
    },
  },
})

export const { addToWishlist, removeFromWishlist, toggleWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
