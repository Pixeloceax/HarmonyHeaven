import AuthService from "../src/services/auth.service";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { expect, describe, afterEach, it } from "vitest";

const mockAxios = new MockAdapter(axios);

describe("AuthService", () => {
  afterEach(() => {
    mockAxios.reset();
    localStorage.clear();
  });

  it("login should store user data in localStorage", async () => {
    const userData = { token: "mockToken" };
    mockAxios.onPost("https://127.0.0.1:8000/login").reply(200, userData);

    await AuthService.login("test@example.com", "password");

    expect(localStorage.getItem("user")).toEqual(JSON.stringify(userData));
  });

  it("logout should remove user data from localStorage", () => {
    localStorage.setItem("user", JSON.stringify({ token: "mockToken" }));

    AuthService.logout();

    expect(localStorage.getItem("user")).toBeNull();
  });

  it("register should make a POST request to register endpoint", async () => {
    const userData = { username: "test", email: "test@example.com" };
    mockAxios.onPost("https://127.0.0.1:8000/register").reply(200, userData);

    const response = await AuthService.register(
      "test",
      "test@example.com",
      "password"
    );

    expect(response.data).toEqual(userData);
  });

  it("getCurrentUser should return user data", async () => {
    const userData = { username: "test", email: "test@example.com" };
    localStorage.setItem("user", JSON.stringify({ user: "test@example.com" }));
    mockAxios
      .onPost("https://127.0.0.1:8000/get-current-user")
      .reply(200, userData);

    const currentUser = await AuthService.getCurrentUser();

    expect(currentUser).toEqual(userData);
  });

  it("getCurrentUser should reject if user email not found in localStorage", async () => {
    localStorage.removeItem("user");

    await expect(AuthService.getCurrentUser()).rejects.toThrowError(
      "User email not found in local storage"
    );
  });
});
