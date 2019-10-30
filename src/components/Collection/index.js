import React, { useState, useCallback } from 'react'
// import { autorun } from "mobx"
import { observer } from "mobx-react-lite";
// import { useStore } from "../stores";

export const CollectionViewer = observer( ({ collection }) => {
  let [viewComponent, setViewComponent] = useState('default')
  let data = collection ? collection : "MOCK_DATA"

  return <div style={{margin: "3em", borderBottom: "2px solid black"}}>
    <pre style={{whiteSpace:"pre-wrap"}}>
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
})