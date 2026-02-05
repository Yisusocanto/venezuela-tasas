const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function customFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, ...init } = options;

  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    ...init,
    headers: {
      ...defaultHeaders,
      ...init.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Global error handling (akin to interceptors)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
