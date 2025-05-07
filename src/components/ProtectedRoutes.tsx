// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAppStore } from "../store/app.store";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = useAppStore((state) => state.user);
  const location = useLocation();
  return user ? children : <Navigate to="/login" replace state={{ from: location }}  />;
};

export default ProtectedRoute;