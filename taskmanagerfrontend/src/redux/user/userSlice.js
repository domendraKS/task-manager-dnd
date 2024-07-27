import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userTask: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.userTask = action.payload;
    },
    signOut: (state) => {
      state.userTask = null;
    },
  },
});

export const { signInSuccess, signOut } = userSlice.actions;

export default userSlice.reducer;
