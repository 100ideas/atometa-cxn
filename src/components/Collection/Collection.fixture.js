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
import './forms.css'


let v1_specs = observable({
  entities: ['isbn', 'book', 'sale']
})


const EntityStyle = {

}
const Entity = observer( ({name}) => {
  return (
    <div style={EntityStyle} className="nicepre">
      {name}
    </div>
  )
})

const EntityListStyle = {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  rowGap: '30px',
  margin: '3.7rem 2rem 2rem 0',
  minWidth: "44ch",
  flexGrow: '2',
  border: "2px solid var(--blue-600)",
  padding: '2rem'
}
const EntityList = observer( ({entities = ['missing']}) => {
  return ( 
    <div style={EntityListStyle} className="propsbox">
      {entities.map(ent => <Entity name={ent} />)}
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
    <div style={flex2col} className="collection-fixture-2col-wrapper">
      <EntityList entities={v1_specs.entities} />
      <Debug {...{v1_specs}} displayName='Collection.fixture.js "v1_specs"'/>
    </div>
  )
}