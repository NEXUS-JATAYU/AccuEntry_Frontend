const DEFAULT_LOCAL_BACKEND_URL = "http://127.0.0.1:8000";

export function getBackendApiBaseUrl() {
  const rawUrl =
    import.meta.env.VITE_BACKEND_FASTAPI_URL ||
    import.meta.env.BACKEND_FASTAPI_URL ||
    (import.meta.env.DEV ? DEFAULT_LOCAL_BACKEND_URL : "");

  const baseUrl = String(rawUrl).trim().replace(/\/+$/, "");
  return baseUrl || DEFAULT_LOCAL_BACKEND_URL;
}