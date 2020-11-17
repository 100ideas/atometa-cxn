23 Mar 2020 Notes 

`parent`, `lamport`, fields should be in `data` section of `msg`? or not? createBlock(msg) is not getting needed params currently

where do entities live?

where did I see src code example of setting up redux-style dispatch/reducer api on top of mobx store?



---

notebook
- root block
  - children: 
    - b1
    - b2
    - b3
  - produces: {
      uuid: "site1-def4-11",
      name: "book_records",
      defs: [
        "isbn", "book_meta", "cover_image"
      ]
    }

event sourcing / diy redux dag thing: 

1. start with array of events

2. store: reduces events -> instantiates objects into notebook dag (mobx observables)

3. frontend: notebook dag -> react tree

4. react tree emits `cmds` (or just events for now) `msgStore` store

5. dag is updated

goal: 
 - root block "outputs" footer frame/table shows empty table w/ headers
 - as matching block data accumulates, root table reactively selects and joins ents


events:
    event: uid, type, cause, lamport, data 
```js
[
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
```




```js 
const mockDefs = [
  {
    id: 'id/001',
    displayName: 'isbn',
    datatype: 'string',
    description: 'isbn_10 number',
    example: "000-1111-111Z1",
    rules: []
  },
  {
    id: 'id/002',
    displayName: '',
    datatype: '',
    description: '',
    example: '',
    rules: []
  },
  {
    id: 'id/003',
    displayName: '',
    datatype: '',
    description: '',
    example: '',
    rules: []
  }
]
```