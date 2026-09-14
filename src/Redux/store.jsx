import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { publicApiSlice } from "./api/publicApiSlice";
import { privateApiSlice } from "./api/privateApiSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  [publicApiSlice.reducerPath]: publicApiSlice.reducer,
  [privateApiSlice.reducerPath]: privateApiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(publicApiSlice.middleware, privateApiSlice.middleware),
});

export const persistor = persistStore(store);

export const purgePersistedState = () => {
  persistor.purge();
};
