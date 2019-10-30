import React from "react";
import { autorun, entries } from "mobx"; 
import { RootStore } from './RootStore'
import { CollectionsStore } from './CollectionsStore'


export class Store {
  collectionsStore
  // uiStore;

  constructor() {
    this.name = "Root Store (stores/index.js)"
    this.collectionsStore = new CollectionsStore(this)
    // this.uiStore = new UiStore(this);
  }
}

// const wsStore1 = new WebSocketStore()
const _store = new Store()
// const disposer1 = autorun(() => {
//   let w1 = entries(_store.wsStore)
//   let f1 = entries(_store.fsStore)
//   console.log({"webSocketStore": w1, "fsStore": f1})
// });
// window.wsstore = _store.wsStore
window.collectionsStore = _store.collectionsStore
window.env = process.env


////////////////////// stores/index.js /////////////////////////
export const storeContext = React.createContext(null);

export const StoreProvider = ({children}) => {
  // const [store] = React.useState(new WebSocketStore());
  // const [store] = React.useState(wsStore1);
  const [store] = React.useState(_store);
  // original example code - doesn't work
  // const [store] = React.useState(createStore);
  return (
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
  );
};

export const useStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error("You have forgot to use StoreProvider, shame on you.");
  }
  return store;
};
//####################### stores/index.js #####################//