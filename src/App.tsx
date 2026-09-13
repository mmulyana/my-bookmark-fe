import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider, useSetAtom } from "jotai";
import { AppLayout } from "@/components/layout/app-layout";
import { BookmarkListPage } from "@/pages/bookmark-list-page";
import { TagsPage } from "@/pages/tags-page";
import { LoginPage } from "@/pages/login-page";
import { RegisterPage } from "@/pages/register-page";
import { ExtensionConnectPage } from "@/pages/extension-connect-page";
import { RequireAuth } from "@/components/auth/require-auth";
import { isAuthenticatedAtom } from "@/atoms/auth";
import { AUTH_LOGOUT_EVENT } from "@/api/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AuthLogoutListener = () => {
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      setIsAuthenticated(false);
      navigate("/login", { replace: true });
    };
    window.addEventListener(AUTH_LOGOUT_EVENT, handleLogout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleLogout);
  }, [setIsAuthenticated, navigate]);

  return null;
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <BrowserRouter>
          <AuthLogoutListener />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/extension/connect"
              element={
                <RequireAuth>
                  <ExtensionConnectPage />
                </RequireAuth>
              }
            />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <AppLayout />
                </RequireAuth>
              }
            >
              <Route index element={<BookmarkListPage />} />
              <Route path="folder/:folderId" element={<BookmarkListPage />} />
              <Route path="tags" element={<TagsPage />} />
              <Route path="tags/:tagId" element={<BookmarkListPage />} />
              <Route
                path="favorites"
                element={<BookmarkListPage view="favorites" />}
              />
              <Route
                path="unsorted"
                element={<BookmarkListPage view="unsorted" />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </JotaiProvider>
    </QueryClientProvider>
  );
}

export default App;
