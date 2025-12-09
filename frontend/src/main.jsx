import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./router.jsx";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { RatingProvider } from "./context/RatingProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RatingProvider>
        <RouterProvider router={router} />
      </RatingProvider>
    </AuthProvider>
  </StrictMode>
);
