import { create } from 'zustand';

const resetters = [];

export const createStore = (f) => {
  if (f === undefined) return createStore;
  const store = create(f);
  const initialState = store.getState();
  resetters.push(() => {
    store.setState(initialState, true);
  });
  return store;
};

export const resetAllStores = () => {
  for (const resetter of resetters) {
    console.log('resetter: ', resetter);
    resetter();
  }
};
