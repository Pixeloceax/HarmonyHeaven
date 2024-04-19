import { suite } from "vitest";
import authHeader from "../../src/services/AuthHeader";

suite("authHeader function", (test) => {
  test("should return an empty Authorization header if no user is stored in localStorage", () => {
    localStorage.clear();

    const result = authHeader();

    return result.Authorization === "";
  });

  test("should return Authorization header with Bearer token if user is stored in localStorage", () => {
    const user = { user: "some_token_value" };
    localStorage.setItem("user", JSON.stringify(user));

    const result = authHeader();

    return result.Authorization === "Bearer some_token_value";
  });
});
