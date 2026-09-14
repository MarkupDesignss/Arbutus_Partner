import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { HelmetProvider } from "react-helmet-async";

import "./index.css";
import App from "./App.jsx";
import { store, persistor } from "./Redux/store.jsx";

const isSnap = 
  typeof navigator !== "undefined" && 
  (navigator.userAgent === "ReactSnap" || 
   navigator.userAgent.includes("ReactSnap") ||
   process.env.NODE_ENV === "production");

if (typeof window !== "undefined") {
  window.snapSaveState = () => {
    return document.readyState === "complete";
  };
}

const rootElement = document.getElementById("root");

createRoot(rootElement).render(
  <HelmetProvider>
    <Provider store={store}>
      {isSnap ? (
        <App />
      ) : (
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      )}
    </Provider>
  </HelmetProvider>
);