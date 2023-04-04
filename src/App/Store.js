import { configureStore } from "@reduxjs/toolkit";
import { appSliceReducer } from "./AppSlice";
import { dbsliceReducer } from "./DbSlice";

export const store = configureStore({
    reducer: {
        dbslice: dbsliceReducer,
        appslice: appSliceReducer,
    }
})