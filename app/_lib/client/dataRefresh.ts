"use client";

export const DATA_REFRESH_EVENT = "unienf:data-refresh";

export function notifyDataChanged(router?: { refresh: () => void }) {
  router?.refresh();
  window.dispatchEvent(new Event(DATA_REFRESH_EVENT));
}
