import React, { useEffect } from "react";
// import { useStore } from "stores";
import useForm from "react-hook-form";
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
import { Debug } from '@/components/Collection/FormDebug'
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

  @action.bound del(){
    console.log("\n\nEntity.del()?\n")
    this.name = "deleted"
    // delete v1_specs.ents[this.id] // nope
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
      <PillButton handler={ent.del} />
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
  width: '2em'
}
const PillButton = ({handler = false, ...rest}) => {
  if(!handler || (typeof handler !== 'function')) handler = AddEntity
  return (
    <button
      type="button" style={ButtonStyle}
      onClick={handler}
      // onClick={AddEnt}
    >+</button>
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

const EntityObjList = observer( ({entities = ['missing']}) => {

  return ( 
    <div style={EntityListStyle} className="propsbox">
    <p>EntityObjList</p>
      {entities.map( (ent, idx) => ent.name !== 'deleted' && <EntityObj ent={ent} key={`entity-item-${ent + idx}`} /> )}
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
export default function MockForm(props){
  return (
    <>
    {/* <PillButton /> */}
    <div style={flex2col} className="hookform rhf">
      <EntityList entities={v1_specs.entities} />
      <Debug {...{v1_specs}} displayName='Collection.fixture.js "v1_specs"'/>
    </div>
    <hr />
    <div style={flex2col} className="hookform rhf">
      <EntityObjList entities={v1_specs.ents} />
      <Debug {...{v1_specs}} displayName='Collection.fixture.js "v1_specs"'/>
    </div>
    </>
  )
}