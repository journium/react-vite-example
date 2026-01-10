import { createRoot } from "react-dom/client";
import { JourniumProvider } from '@journium/react';
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <JourniumProvider
        config={{
            publishableKey: import.meta.env.VITE_JOURNIUM_PUBLISHABLE_KEY!
        }}
    >
        <App />
    </JourniumProvider>
);
