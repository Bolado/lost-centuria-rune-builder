import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./css/reset.css";
import "./css/index.css";
import App from "./pages/App";
import reportWebVitals from "./reportWebVitals";
import ErrorPage from "./pages/error-page";
import Builder from "./pages/build/builder";
import Callback from "./pages/Callback";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    loader: async () => {
      // redirect to /api/login
      window.location.href = "/api/login";
      return null;
    },
    element: null,
  },
  {
    path: "/build/new",
    element: <Builder />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/build/:id",
    loader: async ({ params }) => {
      const response = await fetch(`/api/build/${params.id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    },
    element: <Builder />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/callback",
    element: <Callback />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
