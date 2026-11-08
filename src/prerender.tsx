import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";

/** Build-time render so content is visible before (and without) JavaScript. */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
