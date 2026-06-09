type Listener = (data: any) => void;

const listeners: Record<string, Listener[]> = {};

export const AppEvents = {
  emit(event: string, data?: any) {
    listeners[event]?.forEach(fn => fn(data));
  },
  on(event: string, fn: Listener) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
    return () => {
      listeners[event] = listeners[event].filter(l => l !== fn);
    };
  },
};