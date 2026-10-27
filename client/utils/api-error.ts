export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
  path: string;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
  path: string;
};

export type ApiError = {
  code: string;
  status: number;
  message: string;
  details?: unknown;
};

type FetchErrorLike = {
  status?: number;
  statusCode?: number;
  statusMessage?: string;
  message?: string;
  data?: unknown;
};

const FALLBACK_MESSAGE = "Something went wrong.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  if (!isRecord(data) || data.success !== false || !isRecord(data.error)) {
    return false;
  }

  return (
    typeof data.error.code === "string" &&
    typeof data.error.message === "string"
  );
}

export function isApiError(error: unknown): error is ApiError {
  return (
    isRecord(error) &&
    typeof error.code === "string" &&
    typeof error.status === "number" &&
    typeof error.message === "string"
  );
}

export function normalizeApiError(error: unknown): ApiError {
  if (!isRecord(error)) {
    return { code: "API_ERROR", status: 500, message: FALLBACK_MESSAGE };
  }

  const fetchError: FetchErrorLike = error;
  const status = fetchError.statusCode ?? fetchError.status ?? 500;

  if (isApiErrorResponse(fetchError.data)) {
    const { code, message, details } = fetchError.data.error;

    return { code, status, message, details };
  }

  return {
    code: "API_ERROR",
    status,
    message:
      fetchError.statusMessage ?? fetchError.message ?? FALLBACK_MESSAGE,
    details: fetchError.data,
  };
}

// Thrown values are not guaranteed to be ApiError (e.g. non-request failures)
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }

  return error instanceof Error ? error.message : FALLBACK_MESSAGE;
}
