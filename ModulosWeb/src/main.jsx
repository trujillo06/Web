import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import { SpeedInsights } from "@vercel/speed-insights/next"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
