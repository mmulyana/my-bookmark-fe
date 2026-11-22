import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "@/lib/auth-storage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

/** Resolves an API-relative path (e.g. an image `url`) so it works in <img src>. */
export function resolveApiUrl(path: string): string {
  return /^(https?:|blob:|data:)/.test(path) ? path : `${BASE_URL}${path}`;
}

export class ApiError<T = unknown> extends Error {
  status: number;
  data: T | undefined;
  constructor(message: string, status: number, data?: T) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const AUTH_LOGOUT_EVENT = "mybookmark:auth-logout";

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
      .then(async (res) => {
        if (!res.ok) return false;
        const data = (await res.json()) as {
          access_token: string;
          refresh_token: string;
        };
        setTokens(data.access_token, data.refresh_token);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function doFetch(
  endpoint: string,
  options: RequestInit,
): Promise<Response> {
  const accessToken = getAccessToken();
  const headers: Record<string, string> = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  let response = await doFetch(endpoint, options);

  const isAuthEndpoint = endpoint.startsWith("/auth/");
  if (response.status === 401 && !isAuthEndpoint) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      response = await doFetch(endpoint, options);
    } else {
      clearTokens();
      window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
    }
  }

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    let errorData: unknown;
    try {
      errorData = await response.json();
      const message = (errorData as { message?: string } | null)?.message;
      if (message) {
        errorMessage = message;
      }
    } catch {}
    throw new ApiError(errorMessage, response.status, errorData);
  }

  if (
    response.status === 200 &&
    response.headers.get("content-length") === "0"
  ) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
