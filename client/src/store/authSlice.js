import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.isInitialized = true
    },
    clearAuth: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isInitialized = true
    },
    setInitialized: (state, action) => {
      state.isInitialized = action.payload
    },
  },
})

export const { setAuth, clearAuth, setInitialized } = authSlice.actions
export default authSlice.reducer
