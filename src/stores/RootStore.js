import { generateShortNanoId } from '../util';

export class RootStore {
  rootStore;
  app_uuid

  constructor(rootStore) {
    // console.log("RootStore setting rootstore for...", this)
    this.rootStore = rootStore;
    this.app_uuid = generateShortNanoId()
  }

  generateShortNanoId(length = 8){
    return generateShortNanoId(length)
  } 

  getRoot() {
    return this.rootStore;
  }
}