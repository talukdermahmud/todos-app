"use client";

import { Provider } from "react-redux";
import { store } from "../lib/store";
import { SessionProvider } from "next-auth/react";
import { ToasterProvider } from "./Toaster";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <ToasterProvider>{children}</ToasterProvider>
      </SessionProvider>
    </Provider>
  );
}
