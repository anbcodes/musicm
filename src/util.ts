import { EffectCallback, Inputs, useEffect } from "preact/hooks";

export function generateId(len = 14) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = new Uint8Array(len);
  window.crypto.getRandomValues(randomValues);
  let result = '';
  for (let i = 0; i < len; i++) {
    const randomIndex = randomValues[i] % characters.length;
    result += characters[randomIndex];
  }
  return result;
}

export function useAsyncEffect(effectFn: (setFn: (fn: ReturnType<EffectCallback>) => void) => Promise<void>, deps: Inputs) {
  useEffect(() => {
    let cleanupFn: ReturnType<EffectCallback>;
    effectFn(fn => (cleanupFn = fn));
    return () => cleanupFn && cleanupFn();
  }, deps);
}

export async function persistStorage() {
  if (navigator.storage && navigator.storage.persist) {
    let persistent = await navigator.storage.persist();
    if (persistent) {
      console.log("Storage will not be cleared except by explicit user action");
    } else {
      console.log("Storage may be cleared by the UA under storage pressure.");
    }
    return persistent;
  }
  return false;
}
