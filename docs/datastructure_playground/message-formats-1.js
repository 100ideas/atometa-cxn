/** exploration of serialization structures for message log & notebook nodes
 *
 *  see `atometa-cxn/docs/2020-jan_atometa-data-model.md` for prior work
 *
 *  2020-03-03: created
 */

let schema_v1 = {
  // execution context / local state
  blockSchema: {
    ins      : {},        // <handle|slot>[]: { EntitySpec, source-uuid, => <frame> }
    frame    : {},        // <frame>: [<event-msgs>|<entity-uuids>]
    outs     : {},        // <handle|slot>[]: [frames]
    defs     : {},                       // <EntitySpec>[]
    ops      : [],                       // DAG of procecures + data deps
    data     : {},                       // causal DAG of msgs ~> [ {uuid: ValueLiteral} ]
    ui       : {},                       // {uuid: SelectionSchema}? Tables, selections,
    narrative: [ 'markdown strings...']
  },
  
  // {spec: uuid, [members: entities]} }
  OpSpec: {
    uuid: '',
  },

  EntitySpec: {
    uuid        : 'entity-13-nh2iyo',
    name        : 'isbn10',
    description : 'book isbns, only isbn10',
    properties  : {
      'def-6-oipkk9' : {
        name           : 'isbn_10',
        type           : 'string',
        description    : 'ISBN-10',
        example        : '0-449-23949-7',
        validation     : ''
      },
      'prop-uuid-2'  : {}
    },
    '_entityGetter(clock = -1)': 'some kind of getter for slice of db msgs??'
  },

  // SelectionSchema? CxnSchema?
  TableSchema: {
    uuid       : 'cxn-4-ay2cie',
    // clock      : '22',                                      //?
    parent     : 'block-or-op-uuid',
    children   : '[uuids]',
    title      : 'isbns collection (block #1)',
    description: 'isbns extracted from csv & user input',
    selection  : '<slectionSchema>'
  },

  SelectionSchema: {
    selection: [
      //entity-spec-uuid , [ <members> ]
      ['entity-13-nh2iyo', ['data:uuid1@t1', 'data:uuid2@t2','data:uuid3@tn']]
    ]
  }
}


// entity uuid derived from msg key <uuid>: "chan:site-cause-uuid-clock"
let msgs_v1 = {

  // key-value literal form
  objform: {
    'data:zxyttu-xvzop8-ay2cie-23': {
      value: {
        'def-6-oipkk9': '000-1111-111Z1',
        '_join': ['data:zxyttu-xvzop8-njkalo-14']
        // sets 'data:zxyttu-xvzop8-ay2cie-23/def-6-oipkk9' to '000-1111-111Z1'
        // and adds link/reference to Entity 'data:zxyttu-xvzop8-njkalo-14'
      }
    }
  },

  // logic form - [subject, predicate, object]
  logicform: {
    'data:zxyttu-xvzop8-ay2cie-23': {
      facts: [
        ['cxn:zxyttu-xvzop8-ay2cie', '_latest', 23], // set latest clock on EntityCxnThing
        ['$BATCH_UPDATE', '@self', [                   // custom directive
          ['def-6-oipkk9', '000-1111-111Z1'],        // "<self-uuid> has-property <val>""
          ['_link', 'cxn:zxyttu-xvzop8-ay2cie']]],
      ]
    }
  },

  // data literal form w/ array paths
  opsform: {
    'data:zxyttu-xvzop8-ay2cie-23': {
      ops: [
        [ '<OP>',  ['path',      , 'path'      , 'path...' ], 'value']
        [ 'SET',   ['entity-uuid', 'spec1-uuid', 'def-uuid'], 'data-literal'],
        [ 'UNSET', ['entity-uuid', 'spec1-uuid', 'def-uuid'], 'data-literal'],
      ]
    }
  },

  // OP[] vals are delta-patches
  redundantform: {
    'data:zxyttu-xvzop8-ay2cie-23': {
      SET: [
        ['def-6-oipkk9', '000-1111-111Z1'],
        ['_join', -1, 'data:zxyttu-xvzop8-njkalo-14']
      ],
      DEL: [],
      // v-< can be derived from message or in reducer
      cause: 'op:xvzop8-yytahg-17',
      clock: 23,
      site: 'site-uuid',
      children: '?',
    }
  }
}