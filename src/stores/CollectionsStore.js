import { observable, computed, action, autorun, toJS as _toJS, has, get, set, remove, entries, toJSON } from "mobx";
import { RootStore } from './RootStore'
const _ = require('lodash');

export class Collection {
  uuid
  rootStore
  cxnStore
  @observable name
  @observable rows = new Map()
  @observable spec = new Map()
  
  @observable form

  constructor({uuid, _id, shortName, spec, rows, ...rest}, rootStore){
    this.rootStore = rootStore
    this.cxnStore = rootStore.collectionsStore
    this.uuid = uuid === 'undefined' 
      ? `${this.rootStore.app_uuid}-cxn-${this.generateShortNanoId()}`
      : uuid
    this.name = 'Collection_' + shortName ? shortName : _id ? _id : uuid
    this.rows.merge(rows)
    this.spec.merge(spec)

    if (rest.form) this.form = rest.form
  }

  @computed get asJS() {
    let jsified = {
      uuid: this.uuid,
      name: this.name,
      rows: _toJS(this.rows),
      spec: _toJS(this.spec),
      form: this.form
    }
    return jsified;
  }
  
  @action updateForm(newvals){
    this.form = {...this.form, ...newvals}
  }
}


export class CollectionsStore extends RootStore {
  uuid
  name = 'CollectionsStore'
  @observable.shallow cxns = new Map()

  constructor(_rootStore) {
    super(_rootStore)
    // this.uuid = `${this.app_uuid}-cxnstore-${this.generateShortNanoId()}`
    this.uuid = `collectionsStore`
    console.log("[init] collectionStore store initialized")
  }
  getCollection(uuid){
    return this.cxns.get(uuid)
  }
  getCollectionAsJS(uuid){
    // return this.cxns.get(uuid).asJS
    return _toJS(this.cxns.get(uuid))
  }
  @computed get uuids() {
    return [...this.cxns.keys()]
  }
  @computed get all() {
    return [...this.cxns.values()].map(cxn => cxn.asJS)
  }
  @computed get size() {
    // return this.all.length
    return this.cxns.size
  }

  findBy(path, value){
    // console.log(`findBy(${path}, ${value})`, _.some([this.all], [path, value]), _.get(this.all, path))
    
    // nope!
    // for (let cxn of this.cxns.values()) {
    //   for (let [key, vals] of cxn.meta.entries()) {
    //     console.log('++++++ ', key, vals)
    //     if (_.some(vals, [path, value])) return cxn
    //   }
    // }

    // nope returns array of length === this.size
    // Array.from(this.cxns.values(), cxn => {
    //  if (_.some(cxn.meta.asJS, [path, value])) return cxn
    // }
    let count = 0
    let hit = false
    
    for ( let i=0;i<this.cxns.size;i++ ){ 
      let cxn = this.cxns.get(this.uuids[i])
      // let cxnjs = cxn.asJS
      let cxnjs = _toJS(cxn)
      
      // console.log(count, ' ++++++ ', this.uuid, i, this.uuids[i], cxnjs)
      // console.log(cxnjs.meta)

      // if (_.some(cxn.meta.asJS, [path, value])) hit = cxn; break
      // debugger;
      // if (_.some([cxn], [path, value])) {hit = cxn; return}
      let [match] = _.at(cxnjs, path)
      if ( (!value && match !== undefined) || (match === value) ) {
        hit = cxn; 
        console.log('******** GOT A HIT ********', cxn.name, cxn.uuid)
        return hit.asJS.rows
      }
    }
    // console.log(count, hit)
    return hit
    // return _.some(this.all, path) && _.get(this.all, path)
  }
  
  @action create(serializedCxn = false) {
    let newUuid = `${this.app_uuid}-cxn-${this.generateShortNanoId()}`
    console.log('CollectionStore trying to create new Collection:', newUuid)
    if (!serializedCxn) return this.cxns.set(newUuid, new Collection({uuid: newUuid}, this.rootStore)).get(newUuid)
    if (typeof serializedCxn === 'string') {
      try {
        serializedCxn = JSON.parse(serializedCxn)
      } catch (err) {
        console.error('CollectionStore.create() passed a string but JSON.parse failed', err)
        return
      }
    }
    let originalUuid = _.get(serializedCxn, 'uuid')
    if (this.cxns.has(originalUuid)) {
      console.warn('CollectionStore.create() tried to create collection that already exists; updating instead for ', originalUuid)
      return this.cxns.get(originalUuid).update(serializedCxn).get(originalUuid)
    }
    if (originalUuid === undefined){
      console.log(`CollectionStore created new Collection ${originalUuid ? originalUuid : newUuid}:`, {...serializedCxn})
      return this.cxns.set(newUuid, new Collection({uuid: newUuid, ...serializedCxn}, this.rootStore)).get(newUuid)
    }
    return this.cxns.set(originalUuid, new Collection({...serializedCxn}, this.rootStore)).get(originalUuid)
  }

  @action delete(cxnId) {
    this.cxns.delete(id);
  }
  
  @computed get asJS() {
     return {
      uuid: this.uuid,
      name: this.name,
      collections: _toJS([...this.cxns.keys()])
    }
  }
}