import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

var Store = configureStore({
    reducer:{
        auth: authSlice
    }
});
export default Store;