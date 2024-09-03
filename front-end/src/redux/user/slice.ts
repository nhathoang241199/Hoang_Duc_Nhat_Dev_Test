import { createSlice } from "@reduxjs/toolkit";

export type TTokenBalance = {
  name: string;
  amount: number;
  image: string;
};

const initialState = {
  email: '',
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
  },
});

export const {
  setEmail
} = userSlice.actions;
