import React from 'react';
import { observer } from "mobx-react-lite";


const objectIsEmpty = (obj) => Object.keys(obj).length === 0

const filterUsedProps = (props) => {
  return Object.keys(props).filter( k => {  
    let prop = props[k]
    return typeof prop === 'object'
      ? !objectIsEmpty(prop)        // true if object and not empty 
        ? true : false     
      : typeof prop === 'function'  // false if function; else true
        ? false : prop !== undefined
  }) 
}

const ActiveProp = observer( ({prop, val}) => 
  <div> 
    <code>{prop}:</code><pre style={{display: "inline"}}> {JSON.stringify(val, null, 2)} </pre>
  </div>
)

const PropsboxHeader = ({displayName, srcName}) =>
  <div className="flexbar">
    {displayName 
      ? <h5 className="propsbox-title">{displayName}</h5>
      : null
    }
      
    {srcName 
      ? <h6 className="srcfile">{srcName}</h6> 
      : null
    }
  </div>

export const Debug = ({srcName = false, displayName = false, state,...props}) => {
  return (
    <div className="json-debug">

      <div className="fortychar propsbox-fancy">
        <PropsboxHeader {...{displayName, srcName}} />
        <div className="propsbox">
          {filterUsedProps(props).map( (prop, idx) => <ActiveProp key={prop + '-' + idx} prop={prop} val={props[prop]}/>)}          
          {/* <hr />
          <pre className="textbox" > {JSON.stringify(props, null, 2)} </pre> */}
        </div>
      </div>  
      
    </div>
  )
}