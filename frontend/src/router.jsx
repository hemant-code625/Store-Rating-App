import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import LoginForm from "./components/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute element={<App />} />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
]);

export default router;
