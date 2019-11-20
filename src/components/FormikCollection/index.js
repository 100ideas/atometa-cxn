import React, { useState, useCallback } from 'react'
// import { autorun } from "mobx"
import { observer } from "mobx-react-lite";
// import { useStore } from "stores";

import { ItemForm } from './ItemForm'
import { SpecForm } from './SpecForm'

export const CollectionViewer = observer( ({ collection }) => {
  let [viewComponent, setViewComponent] = useState('default')
  let data = collection ? collection : "MOCK_DATA"

  return <div style={{margin: "2em 0", borderBottom: "2px solid black"}}>

    <div style={{display: 'flex'}}>
      {/* <ItemForm /> */}
      <SpecForm />
    </div> 
    
    <div>
      <p style={{marginTop: '1em'}}>received props.collection:</p>
      <pre style={{whiteSpace:"pre-wrap", backgroundColor: 'var(--gray-800)'}}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>

  </div>
})