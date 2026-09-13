import { Navigate, useLocation } from "react-router-dom";
import { useAtomValue } from "jotai";
import { isAuthenticatedAtom } from "@/atoms/auth";

export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
