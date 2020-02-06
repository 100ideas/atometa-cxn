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
// import { Debug } from '../components/Collection/FormDebug'
import { Debug } from '../Collection/FormDebug'
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
      <EntityObjList entities={v1_specs} />
      <Debug {...{v1_specs}} displayName='Collection.fixture.js "v1_specs"'/>
    </div>
    </>
  )
}



/** 
 * 22 Jan 2020 - post holiday restart notes
 * ================================================================================
 * 
 * - itemize tech deliverables for next month
 * 
 * - two main features:
 *   - list view of blocks in notebook
 *   - spreadsheet/table view of data contents of block
 * 
 * - review master plan (non-code work) and schedule time to work on it
 * 
 * 
 * 
 * 
 * deliverables
 * --------------------------------------------------------------------------------
 * - item creation via forms from item spec
 * - item collection list view 
 * - item collection spreadsheet view
 *   - with edit...?
 * - item collection composition (sub-items)
 *   - how to naively implement - graph? universal property key-value store?
 * 
 * 
 * 
 * 
 * 
 * ls all folders in da-play by most recent - what have I been working on? 
 * --------------------------------------------------------------------------------
 *  - try https://dystroy.org/broot/
 *  - nope, but wrote a script `recentwork`
 *    - in `da-play/0_mock/`, worked on:
 *      - boilerplate-mobx-react-hot-loader/
 *      - atometa/
 *      - atometa-cxn/
 *      - see below:
 * ```
 * 4 Sep 22 16:27 ./0_mock/mobx-didact/docs/2019-03-json-schema-blocks.js
 * 8 Sep 22 16:38 ./_notes/img/2019-04-22_dtcomponents-yarn-styles.png
 * 4 Sep 22 16:45 ./_notes/img/2019-03-14_overmind_schema-collections.png
 * 8 Sep 22 20:08 ./0_mock/2019-aug-workspaces/mobx-didact.code-workspace
 * 3 Sep 22 20:09 ./_notes/2019-09-19_automerge_playground.js
 * 8 Sep 23 00:28 ./_notes/2019-04-23_umbrella_rstream-queary.md
 * 6 Sep 24 00:18 ./_notes/img/2019-09-24_github_stencila_schema_issues_102.png
 * 4 Sep 24 01:08 ./_notes/2019-04-19_mobx-didact_autosuggest_exec_notes.md
 * 0 Sep 24 01:15 ./_notes/2018-11-7 story so far.md
 * 9 Sep 24 01:21 ./_notes/img/2019-09-24_boilerplate-mobx-react-hot-loader_droppy.png
 * 6 Sep 24 02:25 ./_notes/2019-04-23_dtcomponents_readme.md
 * 0 Sep 24 02:35 ./0_mock/bookstore-redux/src/styles.css
 * 0 Sep 24 02:43 ./_notes/2019-09-23_list_of_code_experiments.md
 * 7 Sep 24 18:03 ./_notes/img/2019-09-24_archagon.net_images_blog_causal-trees_bitmap.svg
 * 8 Sep 24 18:17 ./_notes/2019-09-24_data-laced-with-history.md
 * ```
 * 
 * Note: This file should export "CausalTreeDemo" but instead it is used in 
 * 'src/components/Collection/Collection.fixture.js' - looks like I mixed the two up.
 */