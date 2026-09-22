import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("Morrow startup error:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="morrow-error-screen">
          <div className="morrow-error-card">
            <div className="morrow-brand">Morrow</div>
            <h1>Something went wrong</h1>
            <p>Morrow couldn't finish loading. Restart the app and try again.</p>
            <button onClick={() => window.location.reload()}>Reload Morrow</button>
            <details>
              <summary>Technical details</summary>
              <pre>{this.state.error.message}</pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function boot() {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    document.body.innerHTML = '<div class="morrow-error-screen"><div class="morrow-error-card"><div class="morrow-brand">Morrow</div><h1>Unable to start</h1><p>The app root is missing.</p></div></div>';
    return;
  }

  createRoot(rootElement).render(
    <React.StrictMode>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </React.StrictMode>
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
