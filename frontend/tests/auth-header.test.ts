import authHeader from "../src/services/auth-header";
import { expect, describe, afterEach, it } from "vitest";

describe("authHeader", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("should return Authorization header with token if user is logged in", () => {
    const mockUser = { token: "mockToken" };
    localStorage.setItem("user", JSON.stringify(mockUser));

    const headers = authHeader();

    expect(headers).toEqual({ Authorization: "Bearer " + mockUser.token });
  });

  it("should return Authorization header without token if user is not logged in", () => {
    const headers = authHeader();

    expect(headers).toEqual({ Authorization: "" });
  });

  it("should return Authorization header without token if user does not have a token", () => {
    const mockUser = { username: "test" };
    localStorage.setItem("user", JSON.stringify(mockUser));

    const headers = authHeader();

    expect(headers).toEqual({ Authorization: "" });
  });
});
