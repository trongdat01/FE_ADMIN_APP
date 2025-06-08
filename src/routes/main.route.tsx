import { Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SystemConnection from "../pages/SystemConnection";
import { AuthProvider } from "../context/AuthContext";
import { AppLayout } from "../layouts/AppLayout";

// Admin user management pages
import AdminUserListPage from "../pages/admin/AdminUserListPage";
import AdminUserCreatePage from "../pages/admin/AdminUserCreatePage";
import AdminUserEditPage from "../pages/admin/AdminUserEditPage";
import AdminUserDetailPage from "../pages/admin/AdminUserDetailPage";

// Define our own route object type if it's not exported from react-router-dom
type RouteConfig = {
  path?: string;
  index?: boolean;
  element?: React.ReactNode;
  children?: RouteConfig[];
};

// Wrapper component with AuthProvider
const AuthProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export const routes: RouteConfig[] = [
  {
    path: "/",
    element: (
      <AuthProviderWrapper>
        <AppLayout />
      </AuthProviderWrapper>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <div>About</div>,
      },
      {
        path: "system/connection",
        element: <SystemConnection />,
      },
      // Admin user management routes
      {
        path: "admin/users",
        element: <AdminUserListPage />,
      },
      {
        path: "admin/users/create",
        element: <AdminUserCreatePage />,
      },
      {
        path: "admin/users/:id",
        element: <AdminUserDetailPage />,
      },
      {
        path: "admin/users/:id/edit",
        element: <AdminUserEditPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <AuthProviderWrapper><LoginPage /></AuthProviderWrapper>,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
