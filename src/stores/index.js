import React from "react";
import { autorun, entries } from "mobx"; 
import { generateShortNanoId } from '@/util';
import { RootStore } from './RootStore'
import { CollectionsStore } from './CollectionsStore'


export class Store {
  app_uuid
  collectionsStore
  // uiStore;

  // all of this is passed to rootstore
  constructor() {
    console.log(`[init] creating Stores...`)
    this.name = "Root Store (stores/index.js)"
    this.app_uuid = generateShortNanoId()
    this.collectionsStore = new CollectionsStore(this)

    // this.uiStore = new UiStore(this);
    window.MobxStores = this
  }
}


const _store = new Store()
// const wsStore1 = new WebSocketStore()
// const disposer1 = autorun(() => {
//   let w1 = entries(_store.wsStore)
//   let f1 = entries(_store.fsStore)
//   console.log({"webSocketStore": w1, "fsStore": f1})
// });
// window.wsstore = _store.wsStore
// document.collectionsStore = _store.collectionsStore
// document.env = process.env


////////////////////// stores/index.js /////////////////////////
const storeContext = React.createContext(null);
storeContext.displayName = 'mobxStoreContext'

export const StoreProvider = ({children}) => {
  // const [store] = React.useState(new WebSocketStore());
  // const [store] = React.useState(wsStore1);

  // prevent rerendering tree if _store  changes
  // https://github.com/facebook/react/issues/15156#issuecomment-474590693
  const [store] = React.useState(_store);
  // const [store] = React.useState(new Store())
  console.log(`[init] StoreProvider initialized; app_uuid: ${store.app_uuid}`)
  
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