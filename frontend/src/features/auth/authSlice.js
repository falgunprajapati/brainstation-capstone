import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit"
import authService from "./authService"

import { extractErrorMessage } from "../../utils"

// Get user from localstorage
const user = JSON.parse(localStorage.getItem("user"))

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
}

// Register new user
export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    console.log(user)
    try {
      return await authService.register(user)
    } catch (error) {
      const message =
        (error.responce &&
          error.responce.data &&
          error.responce.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Login user
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  console.log(user)
  try {
    return await authService.login(user)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

// Logout user

export const logout = createAction("auth/logout", () => {
  authService.logout()

  return {}
})

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ""
    },
    logout: (state) => {
      state.user = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
  },
})

export const { reset } = authSlice.actions

export default authSlice.reducer
