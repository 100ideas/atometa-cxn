import React from 'react'
import { observer, Observer } from "mobx-react-lite";
import { useStore } from "stores";
import { CollectionViewer } from 'components/FormikCollection'
import { mock_book_and_meta } from '@/util/mocks'

/**
 * TODO
 * 
 * experiment how to make dynamic formik w/ mobx collections
 * 
 * make new component
 * - keep it simple & self contained
 * - local mobx observable for formik state
 * - formik fields driven by mobx state
 * 
 * questions to answer:
 * 
 * - does form update collection only on submit?
 *  - if so, may not need mobx collection integrated into formik directly
 * 
 * - create temporary mobx-formik object to control form?
 *  - init from collection
 *  - updates collectionStore on submit
 */


const mocks = [mock_book_and_meta]

const formikTest = {
  "uuid": "formikTest",
  "name": "formik-test-collection",
  "description": "testing out hooking up formik to mobx cxn",
  
  "form": {
    initialValues: {
      friends: [ "firstArrayVal", "secondFriend" ] 
    }
  },

  "spec": {
    initialValues: {
      friends: [ "firstArrayVal", "secondFriend" ] 
    }
  },
  "rows": {
    'formikTest/01':  {
      "_id": "formikTest/01",
      "title": "first field",
      "friends": [
        "firstArrayVal",
        "secondFriend"
      ]
    }
  }
}

// const StringifiedCollections = observer( ()

// )

export default function CollectionViewerFixture() {
  const { collectionsStore } = useStore();
  if(collectionsStore.size === 0) {
    mocks.map( _m => collectionsStore.create(_m) )
    collectionsStore.create(formikTest)
  }

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

    <hr />
    <h4>CollectionViewer.fixture.js</h4>
    <p>JSON.stringify(collectionsStore.all, null, 2)</p>
    <Observer>{() => 
      <pre style={{backgroundColor: 'var(--gray-800)'}}>
        {JSON.stringify(collectionsStore.all, null, 2)}
      </pre>}
    </Observer>
>    
    <hr />
    
    <p>JSON.stringify(collectionsStore.asJS, null, 2)</p>
    <Observer>{() => 
      <pre style={{backgroundColor: 'var(--gray-800)'}}>
        {JSON.stringify(collectionsStore.asJS, null, 2)}
      </pre>}
    </Observer>

  </div>
 }



 