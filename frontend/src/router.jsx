import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
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
  {
    path: "/signup",
    element: <SignupForm />,
  },
  {
    path: "*",
    element: (
      <div className="bg-gray-900 text-white text-4xl min-h-screen flex flex-col items-center justify-center">
        <p>404 Not Found</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 rounded-sm cursor-pointer hover:bg-blue-700"
          onClick={() => (window.location.href = "/")}
        >
          Go Home
        </button>
      </div>
    ),
  },
]);

export default router;
