import axios from "axios";

// Prefer proxying through Next.js at /api to avoid CORS and browser blocks.
// If NEXT_PUBLIC_API_BASE is set, it will override the proxy (e.g., for production).
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

// Note: Do not set Content-Type for FormData; the browser will add the boundary automatically.
export const api = axios.create({
  baseURL: API_BASE,
});

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as any;
    // FastAPI default { detail: string }
    if (data?.detail) return String(data.detail);
    if (data?.error) return String(data.error);
    return err.message || "Request failed";
  }
  return "Something went wrong";
}
