import { createSlice } from '@reduxjs/toolkit'

export const userReducer = createSlice({
  name: "User",
  initialState: {
    user: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false; 
      state.user = action.payload;
      state.user.other.verifed = true;
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    logout: (state) => {
      state.user = null;
      // Clear user data from localStorage or sessionStorage
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = userReducer.actions;

export default userReducer.reducer;
