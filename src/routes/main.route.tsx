import { Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import { AuthProvider } from "../context/AuthContext";
import { AppLayout } from "../layouts/AppLayout";

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
