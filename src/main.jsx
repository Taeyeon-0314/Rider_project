// main.jsx or index.jsx
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const loadKakaoMapScript = () => {
  const script = document.createElement("script");
  script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_KEY}&libraries=services,clusterer`;
  script.async = true;
  document.head.appendChild(script);
};

const AppWithKakaoMap = () => {
  useEffect(() => {
    loadKakaoMapScript();
  }, []);

  return <App />;
};

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AppWithKakaoMap />
  </QueryClientProvider>
);
