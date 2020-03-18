import React, { useEffect } from "react";
// import { useStore } from "stores";
import { useForm } from 'react-hook-form';
import {
  observable,
  computed,
  action,
  autorun,
  has,
  get,
  set,
  remove,
  entries,
  toJS,
  toJSON
} from "mobx";
import { observer, Observer } from "mobx-react-lite";
import * as yup from 'yup'
import { Debug } from '../components/Collection/FormDebug'
// import "react-hook-form.css";

const MockMsgStore = [
  {
    uuid: "site1-event-block0-5",
    type: "BlockCreated",
    parent: "site1-block0-1",
    lamport: 5,
    data: {
      uuid: "site1-block1-5",
      title: "get isbns"
    }
  }, {
    uuid: "site1-event-block0-6",
    type: "BlockCreated",
    parent: "site1-block0-1",
    lamport: 6,
    data: {
      uuid: "site1-block2-6",
      title: "fetch book_meta from isbn"
    }
  }, {
    uuid: "site1-event-block0-7",
    type: "UpdatedBlocksSignature",
    parent: "site1-block0-1",
    lamport: 7,
    op: "set",
    data: {
      produces: [
        {
          type: "cxn",
          name: "book_records", 
          defs: ["isbn", "book_meta", "cover_image"],
          ents: []
        }
      ]
    }
  },
]

const styles = {
  rootBlock: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    rowGap: '30px',
    margin: '3.7rem 2rem 2rem 0',
    minWidth: "44ch",
    // flexGrow: '2',
    border: "2px solid var(--blue-600)",
    padding: '2rem',
  },
  block: {
    border: "2px solid var(--blue-800)",
    padding: '2rem',
  }
}


// Mobx Models ///////////////////

// where are ents, defs, frames, stored?

class NotebookEngine {
  @observable blocks = []
  @observable msgStore = []
  constructor({ site = 'site1', uuid = "rand01921", msgStore }){
    this.site = site 
    this.uuid = uuid
    this.msgStore = msgStore
    if (this.msgStore.length > 0) msgStore.map(this.dispatch)
  }
  @action.bound dispatch(evt) {
    if(!evt.type) console.error("ERROR: notebookengine cant dispatch evt missing 'type'", evt)
    if(evt.type === 'BlockCreated') this.createBlock(evt)
  }
  @action.bound createBlock(event){
    this.blocks.push(new BlockModel({...event.data, msgStore: this.msgStore}))
  }
}

class BlockModel {
  uuid
  site
  lamport
  parent
  @observable signature = {consumes: [], produces: []}
  @observable title
  @observable note = ''
  @observable msgStore = []
  constructor({ uuid = null, site = null, lamport, parent, title = 'untitled', note = 'nostalgia...', msgStore, ...rest }){
    console.log('BlockModel Constructor got:', { uuid, site, lamport, parent, msgStore })
    this.uuid = uuid
    this.site = site
    this.lamport = lamport
    this.parent = parent ? parent : 'MISSINGPARENT' 
    this.msgStore = msgStore
    this.title = title
    this.note = note

    // console.log('msgStore')
    // msgStore.map( m => console.log("\t", toJS(m)))
    console.log(`\n\n$$$$$$$$#\n ${JSON.stringify(rest)}`)
  }

  @computed get events(){
    return this.msgStore.filter(evt => evt.parent === this.uuid)
  }

  @action dispatch(msg) {
    if(!msg.type) console.error("ERROR: notebookengine cant dispatch msg missing 'type'", msg)
    if(msg.type === 'UpdatedBlocksSignature') this.signature = {...this.signature, ...msg.data}
  }

  // createBlock(event){
  //   this.blocks.push(new Block(event, this.msgStore))
  // }
}

const Engine = new NotebookEngine({msgStore: MockMsgStore})
// console.log('toJS(Engine)', toJS(Engine), 'blocks:')
// Engine.blocks.map(console.log)

// components /////

const Block = ({uuid = "missing", title = "missing", ...rest}) => 
  <div style={styles.block}>
    <h1>{`${uuid}: ${title}`}</h1>
    <p>val@now: '[cuuid1: col1: a]'</p>
    {/* {toJS(rest)} */}
    {console.log(`\n### Block component\n\ttitle: ${title}\n\t${toJS(rest)}\n\n.`)}
  </div>

const RootBlock = observer( 
  ({notebookEngine, ...props}) => 
    <div style={styles.rootBlock}>
      <h1>RootBlock</h1>
      {/* <p>val@now: '[cuid1: col1: a]'</p> */}
      <hr/>
      <h3>Engine.blocks.length: {notebookEngine.blocks.length}</h3>
      
      {notebookEngine.blocks.map( blk =>
        <Block key={blk.uuid} {...blk}>
          <p>hey a block! {`block: ${blk.uuid}`}</p>
        </Block>
      )}
      
      {/* {console.log("RootBlock props:", toJS(props))} */}
    </div>
)



let cxn = observable({  
})

let formCxn = observable({
  newfields: [],
  lastname: 'default',
  age: 0,
  submitted: 0,
  temp: {},
  newform: {}
})


// TODO
// write reducer for store (array) of action & event log
// pass array of events to reducer
// reducer passes "materialized" value to Nodebox

const Nodebox = () => <div>
  <h1>Nodebox</h1>
  <p>val@now: '[cuid1: col1: a]'</p>
</div>


export default function MockForm(props){
  return <RootBlock notebookEngine={Engine} />
}


