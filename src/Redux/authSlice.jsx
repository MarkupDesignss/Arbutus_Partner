import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  email: null,
  subscription: null,
  status: false,
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.email =
        action.payload.email || action.payload.user?.email || null;
      state.subscription = action.payload.subscription ?? null;
      state.status = action.payload.status ?? true;
      state.message = action.payload.message ?? "";
    },
    
    setEmail: (state, action) => {
      state.email = action.payload;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.email = null;
      state.subscription = null;
      state.status = false;
      state.message = "";
    },
  },
});

export const { setCredentials, setEmail, logout } = authSlice.actions;
export default authSlice.reducer;
