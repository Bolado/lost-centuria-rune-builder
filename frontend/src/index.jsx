import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import "./css/reset.css";
import "./css/index.css";
import App from "./pages/App";
import reportWebVitals from "./reportWebVitals";
import ErrorPage from "./pages/error-page";
import Builder from "./pages/build/builder";
import Callback from "./pages/Callback";
import GlobalHeader from "./components/global-header";
import { hasTokenCookie } from "./utils/queries";
import Profile from "./pages/profile";

const router = createBrowserRouter([
  {
    element: <GlobalHeader />,
    loader: async () => {
      return hasTokenCookie();
    },
    errorElement: <ErrorPage />,
    children: [
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
        path: "/profile",
        loader: async () => {
          const response = await fetch("/api/saved-builds");
          if (!response.ok) {
            console.error("Unauthorized");
            return redirect("/login");
          }
          const data = await response.json();
          return data;
        },
        element: <Profile />,
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
            console.error("Build not found");
            return redirect("/build/new");
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
    ],
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
