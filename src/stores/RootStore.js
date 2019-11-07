import { generateShortNanoId as nanoId } from '@/util';

export class RootStore {
  rootStore;
  app_uuid

  constructor(rootStore) {
    // console.log("RootStore setting rootstore for...", this)
    this.rootStore = rootStore;
    this.app_uuid = this.generateShortNanoId()
  }

  generateShortNanoId(length = 8){
    return nanoId(length)
  } 

  getRoot() {
    return this.rootStore;
  }
}