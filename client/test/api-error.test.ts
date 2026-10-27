import { describe, it, expect } from "vitest";
import {
  getErrorMessage,
  isApiError,
  normalizeApiError,
} from "../utils/api-error";

const envelope = {
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Validation failed",
    details: [{ field: "name", errors: ["name must be a string"] }],
  },
  timestamp: "2026-01-01T00:00:00.000Z",
  path: "/users",
};

describe("normalizeApiError", () => {
  it("unwraps the backend error envelope", () => {
    expect(normalizeApiError({ statusCode: 400, data: envelope })).toEqual({
      code: "VALIDATION_ERROR",
      status: 400,
      message: "Validation failed",
      details: envelope.error.details,
    });
  });

  it("falls back to the HTTP status message for other failures", () => {
    expect(
      normalizeApiError({ status: 502, statusMessage: "Bad Gateway" }),
    ).toMatchObject({ code: "API_ERROR", status: 502, message: "Bad Gateway" });
  });

  it("does not treat an arbitrary object body as an error envelope", () => {
    expect(
      normalizeApiError({ statusCode: 500, data: { error: "boom" } }),
    ).toMatchObject({ code: "API_ERROR", status: 500 });
  });

  it("handles non-object throwables", () => {
    expect(normalizeApiError("nope")).toEqual({
      code: "API_ERROR",
      status: 500,
      message: "Something went wrong.",
    });
  });
});

describe("isApiError / getErrorMessage", () => {
  it("recognises normalized errors only", () => {
    expect(isApiError(normalizeApiError({}))).toBe(true);
    expect(isApiError({ message: "x" })).toBe(false);
    expect(isApiError(null)).toBe(false);
  });

  it("reads messages from ApiError, Error and unknown values", () => {
    expect(getErrorMessage(normalizeApiError({ statusMessage: "Nope" }))).toBe(
      "Nope",
    );
    expect(getErrorMessage(new Error("kaput"))).toBe("kaput");
    expect(getErrorMessage(42)).toBe("Something went wrong.");
  });
});
