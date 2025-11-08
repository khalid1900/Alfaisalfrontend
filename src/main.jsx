import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { EventProvider } from "./context/EventContext.jsx";
import ErrorPage from "./Error.jsx";
import "./index.css";

// Pages & Components
import Home from "./pages/Home.jsx";
import EventsList from "./components/EventsList.jsx";
import EventDetail from "./components/EventDetail.jsx";
import EventDetailPage from "./pages/EventDetailPage.jsx";
import LoginPage from "./components/Login.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import ManageAdmins from "./components/ManageAdmins.jsx";
import Layout from "./components/Layout.jsx";

// Router setup
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // ✅ All public routes wrapped in Layout
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/events", element: <EventsList /> },
      { path: "/events/:eventId", element: <EventDetail /> },
      { path: "/event/:eventId", element: <EventDetailPage /> },
    ],
  },

  // Admin routes (no layout)
  {
    path: "/admin",
    element: <LoginPage />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/manageadmin",
    element: <ManageAdmins />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <EventProvider>
        <RouterProvider router={router} />
      </EventProvider>
    </AuthProvider>
  </React.StrictMode>
);
 