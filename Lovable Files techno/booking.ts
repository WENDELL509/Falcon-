// Tiny global store via simple module state + listeners (no extra deps)
type State = { selectedSurveys: string[] };
let state: State = { selectedSurveys: [] };
const listeners = new Set<() => void>();

export const bookingStore = {
  get: () => state,
  set: (next: Partial<State>) => {
    state = { ...state, ...next };
    listeners.forEach((l) => l());
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

import { useSyncExternalStore } from "react";
export const useBooking = () =>
  useSyncExternalStore(
    (cb) => {
      bookingStore.subscribe(cb);
      return () => { listeners.delete(cb); };
    },
    bookingStore.get,
    bookingStore.get
  );
