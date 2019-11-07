import React from 'react'
import { observer } from "mobx-react-lite";
import { CollectionViewer } from 'components/Collection'
import { useStore } from "stores";
import { mock_book_and_meta } from './mocks'

const mocks = [mock_book_and_meta]

export default function CollectionViewerFixture() {
  const { collectionsStore } = useStore();
  if(collectionsStore.size === 0) mocks.map( _m => collectionsStore.create(_m) )

  return <div>
    <p>CollectionViewer</p>
    <hr />
    <CollectionViewer collection={
      { 
        "_note": { 
          "source": '<CollectionViewer.fixture.js> passed to <CollectionViewer>',
          "mobx-selector": "meta.description",
          "mobx-collection": "collectionStore"
        }, 
        ...collectionsStore.findBy(['meta.description']) }
    }/>
    
    <p>JSON.stringify(collectionsStore.all, null, 2)</p>
    <pre style={{backgroundColor: 'var(--gray-800)'}}>
      {JSON.stringify(collectionsStore.all, null, 2)}
    </pre>
    
    <hr />
    
    <p>JSON.stringify(collectionsStore.asJS, null, 2)</p>
    <pre style={{backgroundColor: 'var(--gray-800)'}}>
      {JSON.stringify(collectionsStore.asJS, null, 2)}
    </pre>
  </div>
 }



 