import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

const container = document.getElementById("root");
if (!container) throw new Error("#root missing");

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The HTML is prerendered at build time, so hydrate when markup exists.
if (container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);
