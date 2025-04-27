import "./App.css";
import Router from "./routes/Router";
import { useRoutes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

function App() {
  const location = useLocation();
  const routing = useRoutes(Router);

  return (
    <AnimatePresence mode="wait">
      {/* AnimatePresence needs a key to detect route change */}
      <div key={location.pathname}>{routing}</div>
    </AnimatePresence>
  );
}

export default App;
