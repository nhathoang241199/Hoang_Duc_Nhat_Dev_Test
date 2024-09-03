import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";

const store = configureStore({
  devTools: true,
  reducer: {
    user: userReducer,

  },
});

export default store;
