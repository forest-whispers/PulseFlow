import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
  reducer: {
    // Slices will be added as features are implemented (e.g., auth)
  },
})
