import { get, writable } from 'svelte/store';

export function storable(key, data) {
  console.debug(`creating new storable with key ${key}`);
  const internalKey = `sv-storable_${key}`;
  const store = writable(data);
  const { subscribe, set, update } = store;
  const isBrowser = typeof window !== 'undefined';

  if (isBrowser && localStorage[internalKey]) {
    console.debug(`reading value from localStorage: ${localStorage[internalKey]}`);
    set(JSON.parse(localStorage[internalKey]));
  }

  return {
    subscribe,
    set: n => {
      console.debug(`called set on storable with new value : ${n}`);
      // when setting a store's value, first, persist it in localStorage.
      isBrowser && (localStorage[internalKey] = JSON.stringify(n));
      // then set as usual
      set(n);
    },
    update: cb => {
      const currentValue = get(store);
      const updatedStoreValue = cb(currentValue);
      console.debug(`called update on storable with current value : ${currentValue} and updatedValue: ${updatedStoreValue}`);
      // when updating a store's value, first, persist it in localstorage
      isBrowser && (localStorage[internalKey] = JSON.stringify(updatedStoreValue));
      // then set as usual
      set(updatedStoreValue);
    }
  };
}