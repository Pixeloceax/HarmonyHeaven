import { expect, test, vi } from "vitest";
import App from "../src/App";
import EventBus from "../src/common/EventBus";

test("componentDidMount adds logout event listener", async () => {
  const app = new App({});
  EventBus.on = vi.fn();

  await app.componentDidMount();

  expect(EventBus.on).toHaveBeenCalledWith("logout", app.logOut);
});

test("componentWillUnmount removes logout event listener", () => {
  const app = new App({});
  EventBus.remove = vi.fn();

  app.componentWillUnmount();

  expect(EventBus.remove).toHaveBeenCalledWith("logout", app.logOut);
});
