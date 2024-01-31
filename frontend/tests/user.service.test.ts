import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import UserService from "../src/services/user.service";

import { describe, beforeEach, afterEach, it, expect } from "vitest";

describe("UserService", () => {
  let mock = new MockAdapter(axios);

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("should get public content", async () => {
    const data = { content: "public" };
    mock.onGet("https://127.0.0.1:8000/all").reply(200, data);

    const response = await UserService.getPublicContent();

    expect(response.status).toBe(200);
    expect(response.data).toEqual(data);
  });

  it("should get user board", async () => {
    const data = { content: "user" };
    mock.onGet("https://127.0.0.1:8000/user").reply(200, data);

    const response = await UserService.getUserBoard();

    expect(response.status).toBe(200);
    expect(response.data).toEqual(data);
  });
});
