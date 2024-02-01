type Callback = (e: Event) => void;

const EventBus = {
  events: new Map<Callback, EventListener>(),

  on(event: string, callback: Callback) {
    const boundCallback = (e: Event) => callback(e);
    this.events.set(callback, boundCallback);
    document.addEventListener(event, boundCallback);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch(event: string, data?: any) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },

  remove(event: string, callback: Callback) {
    const boundCallback = this.events.get(callback);
    if (boundCallback) {
      document.removeEventListener(event, boundCallback);
      this.events.delete(callback);
    }
  },
};

export default EventBus;
