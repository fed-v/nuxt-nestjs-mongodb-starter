import { normalizeApiError, type ApiSuccessResponse } from "../utils/api-error";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

type ApiRequestBody = BodyInit | Record<string, unknown> | null;

type ApiRequestOptions = {
  body?: ApiRequestBody;
  query?: Record<string, string | number | boolean | null | undefined>;
  headers?: HeadersInit;
  token?: string | null;
  auth?: boolean;
};

export function useApi() {
  const config = useRuntimeConfig();
  const authToken = useCookie<string | null>("auth_token", {
    sameSite: "lax",
  });

  async function request<T>(
    method: HttpMethod,
    endpoint: string,
    options: ApiRequestOptions = {},
  ) {
    const headers = new Headers(options.headers);

    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }

    if (options.body != null && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    // An explicit `token` wins over the cookie; `auth: false` sends neither
    const token = options.token ?? authToken.value;

    if (options.auth !== false && token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    try {
      const response = await $fetch<ApiSuccessResponse<T>>(endpoint, {
        baseURL: config.public.apiBase,
        method,
        body: options.body,
        query: options.query,
        headers,
      });

      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  }

  return {
    get: <T>(endpoint: string, options?: ApiRequestOptions) =>
      request<T>("GET", endpoint, options),
    post: <T>(
      endpoint: string,
      body?: ApiRequestBody,
      options?: ApiRequestOptions,
    ) => request<T>("POST", endpoint, { ...options, body }),
    patch: <T>(
      endpoint: string,
      body?: ApiRequestBody,
      options?: ApiRequestOptions,
    ) => request<T>("PATCH", endpoint, { ...options, body }),
    delete: <T>(endpoint: string, options?: ApiRequestOptions) =>
      request<T>("DELETE", endpoint, options),
  };
}
