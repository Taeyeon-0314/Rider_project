import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import React, { Suspense } from "react";
import GlobalLoading from "./components/GlobalLoading.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Suspense fallback={<GlobalLoading />}>
      <App />
    </Suspense>
    <ReactQueryDevtools />
  </QueryClientProvider>
);
