import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { UpProvider } from "./context/UpProvider.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <UpProvider>
    <BrowserRouter>
      <App />
      <Toaster position="top-center" />
    </BrowserRouter>
  </UpProvider>
);
