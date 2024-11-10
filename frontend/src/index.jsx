import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import "./css/reset.css";
import "./css/index.css";
import App from "./pages/App";
import reportWebVitals from "./reportWebVitals";
import ErrorPage from "./pages/error-page";
import Builder from "./pages/build/builder";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/build/new",
    loader: async () => {
      const response = await fetch("/api/build/new", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to create new build");
      }

      const data = await response.json();
      return redirect(`/build/${data.id}`);
    },
    element: null,
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
