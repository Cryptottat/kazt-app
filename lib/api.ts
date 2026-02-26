const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface APIResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  message: string | null;
}

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<APIResponse<T>> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: "Network error" }));
      return {
        success: false,
        data: null,
        error: `HTTP_${res.status}`,
        message: error.message || `HTTP ${res.status}`,
      };
    }

    return await res.json();
  } catch (error) {
    return {
      success: false,
      data: null,
      error: "NETWORK_ERROR",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
