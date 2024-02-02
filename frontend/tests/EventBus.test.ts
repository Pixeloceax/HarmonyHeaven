import EventBus from "../src/common/EventBus";
import { describe, it, expect, vi } from "vitest";

describe("EventBus", () => {
  it("should be able to subscribe to an event", () => {
    const callback = vi.fn();
    EventBus.on("testEvent", callback);

    EventBus.dispatch("testEvent");

    expect(callback).toHaveBeenCalled();
  });

  it("should be able to unsubscribe from an event", () => {
    const callback = vi.fn();
    EventBus.on("testEvent", callback);
    EventBus.remove("testEvent", callback);

    EventBus.dispatch("testEvent");

    expect(callback).not.toHaveBeenCalled();
  });

  it("should not call the callback if the event is not published", () => {
    const callback = vi.fn();
    EventBus.on("testEvent", callback);

    EventBus.dispatch("anotherEvent");

    expect(callback).not.toHaveBeenCalled();
  });
});
