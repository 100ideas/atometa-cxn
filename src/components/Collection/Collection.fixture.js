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
// import { Debug } from '@/components/Collection/FormDebug'
import { Debug } from './FormDebug'
import './forms.scss'


let v1_specs = observable({
  entities: ['isbn', 'book', 'sale'],
  ents: []
})

const AddEntity = () => v1_specs.entities.length && v1_specs.entities.push(`new-${v1_specs.entities.length}`)


class Entity {
  @observable name

  constructor(name = 'newname', id = false){
    this.name = name
    this.id = id || v1_specs.ents.length
  }

  @action.bound hide(){
    console.log("Entity.hide()")
    this.name = "hidden"
  }
  @action.bound del(){
    console.log("Entity.del()")
    
    // delete v1_specs.ents[this.id] // nope
    
    // this should be collection method?
    // Entity extends Collection and has instance variable 'id'; Collection provides class method 
    // 'del(id)' which instances call with their idvi
    v1_specs.ents = v1_specs.ents.filter( (val,idx) => idx != this.id ) 
    
    console.log("Entity::this:", this)
  }
}
const AddEnt = () => {
  v1_specs.ents && v1_specs.ents.push(new Entity(`new-${v1_specs.ents.length}`))
}

const EntityStyle = {
}
const EntityObj = observer( ({ent}) => {
  return (
    <div style={EntityStyle} className="nice-title">
      {ent.name}
      <PillButton handler={ent.hide}>hide</PillButton>
      <PillButton handler={ent.del}>-</PillButton>
    </div>
  )
})

const ButtonStyle = {
  backgroundColor: 'deeppink',
  border: 'none',
  color: 'black',
  padding: '0.25rem 1rem',
  textAlign: 'center',
  verticalAlign: 'middle',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '4px 2px',
  cursor: 'pointer',
  borderRadius: '8px',
  minWidth: 'fit-content',
  minWidth: '2em'
}
const PillButton = ({handler = false, children = '+'}) => {
  if(!handler || (typeof handler !== 'function')) handler = AddEntity
  return (
    <button
      type="button" style={ButtonStyle}
      onClick={handler}
      // onClick={AddEnt}
    >{children}</button>
  )
}

const EntityListStyle = {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  rowGap: '30px',
  margin: '3.7rem 2rem 2rem 0',
  minWidth: "44ch",
  // flexGrow: '2',
  border: "2px solid var(--blue-600)",
  padding: '2rem',
}
const EntityList = observer( ({entities = ['missing']}) => {
  return ( 
    <div style={EntityListStyle} className="propsbox">
      <p>EntityList</p>
      {entities.map( (ent, idx) => <EntityObj ent={{name: ent}} key={`entity-item-${ent + idx}`} /> )}
      <button
        type="button" className="pill bluebutton"
        onClick={() => entities.length && entities.push(`new-${entities.length}`)}
      >+</button>
      {/* <PillButton /> */}
      {/* <PillButton handler={AddEntity} /> */}
    </div>
  )
})

const EntityObjList = observer( ({entities = {ents: ['missing']}} ) => {
  return ( 
    <div style={EntityListStyle} className="propsbox">
    <p>EntityObjList</p>
      {entities.ents.map( (ent, idx) => ent.name !== 'hidden' && <EntityObj ent={ent} key={`entity-item-${ent + idx}`} /> )}
      <PillButton handler={AddEnt} />
    </div>
  )
})

const flex2col = {
  display: 'flex',
  // border: '2px solid green',
  flexWrap: 'wrap'
  // justifyContent: 'space-between'
}
export default function CausalTreeDemo(props){
  return (
    <>
    {/* <PillButton /> */}
    <div style={flex2col} className="hookform rhf">
      <EntityList entities={v1_specs.entities} />
      <Debug {...{v1_specs}} displayName='Collection.fixture.js "v1_specs"'/>
    </div>
    <hr />
    <div style={flex2col} className="hookform rhf">
      <EntityObjList entities={v1_specs} />
      <Debug {...{v1_specs}} displayName='Collection.fixture.js "v1_specs"'/>
    </div>
    </>
  )
}


let mockCT1 = {
  "blockID_1-aggregateID_1-thingID_1-clock": {
    diff: {
      op: 'set',
      value: {
        isbn: '01234596-21'
      }
    },
    parent: '?',
  },
  "blockID_1-aggregateID_1-thingID_2-clock": {
    diff: {
      op: 'set',
      value: {
        comments: 'could go here'
      }
    },
    parent: '?',
  }
}

let mockCT2 = {
  "siteID1-clock1": {
    op: {
      command: '@api/fetch/json',
      value: {
        url: 'http:/my.endpoint/books/search/?',
        foo: ""
      }
    },
    parent: 'aggregateID_0',
  },
  "blockID_1-aggregateID_1-thingID_2-clock": {
    diff: {
      op: 'set',
      value: {
        comments: 'could go here'
      }
    },
    parent: '?',
  }
}

