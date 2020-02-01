playing around with mocks for block oplog structure

```json
/****************************************************************
 *  entity -> CT addressing scheme                              *
 *                                                              *
 *          |--------------------------site uuid shortcut       *
 *          |   -----------------------namespace                *
 *          |   |     |----------------parent uuid              *
 *          |   |     |    |-----------parent change index      *
 *          |   |     |    |   |-------entity uuid              *
 *          |   |     |    |   |    |--global lamport timestamp *
 *          v   v     v    v   v    v                    *******/
{ "outs": ["@/files/xvzop8-3-ay2cie-1"] }
```

```json
// oplog "in" block
[
  { // 1st draft
     "op":    "@/file/upload",
    "ins":   ["@/uilog/xvzop8/2/qly6no/2"],
   "uuid":    "@/oplog/xvzop8-3-n51qmi-7",
   "outs":   ["@/files/xvzop8-4-ay2cie-3"],
   "desc":    "user uploaded 'isbns.csv' into Block 1",
  "block":    "@/block/0/xvzop8-1"       // redundant? in uuid...
    //           ^     ^    ^   ^
    //          ns/lamport/uuid-local_update_index
  },
  { // 2nd draft
     "op":    "@/file/upload",  //    or maybe  "@/storage/upload"  
    "ins":   ["U-2-qly6no"],    // U: uilog
   "uuid":    "O-3-n51qmi",     // O: oplog
   "outs":   ["S-4-ay2cie"],    // S: storage
   "desc":    "user uploaded 'ay2cie#isbns.csv' into Block 1",,
  "block":    "B-xvzop8-1",     // B: block
    //      v--^   |    ^----|
    //     ns     uuid?    lamport 
  },
  {
     "op":    "@/file/parse/csv",
    "ins":   ["S-4-ay2cie"],   // S: storage
   "uuid":    "O-5-irc9xu",
   "outs":   ["V-6-oipkk9"],   // V: values  (or maybe D: for data?)
   "desc":    "parsed 'isbns.csv/oipkk9' into KV store",,
  "block":    "xvzop8-1",      // ??? always points to containing block or frame?
  },
  {
     "op":    "@/frame/create",
    "ins":   ["V-6-oipkk9"],   // V: values; // value sets referenced in array will be logically `joined` by new frame
   "uuid":    "O-7-sga1ia",
   "outs":   ["F-8-jclmax"],   // F: frame
   "desc":    "[auto] 'created frame 'isbns' from values 'V-6-oipkk9' ",
  "block":    "xvzop8-1",      // ??? always points to containing block or frame?
  },
  {
     "op":    "@/data/remove",
    "ins":  [["V-6-oipkk9", ["prop1", "prop2", "prop3"]]],
   "uuid":    "O-9-u1vaw7",
   "outs":    "V-10-oipkk9",
   "desc":    "deleted cols 'scan', 'date', 'format' from 'isbns.csv/oipkk9'",
  "block":    "xvzop8.1",
  },
  {
     "op":    "@/spec/create",
    "ins":   ["U-11-3u8dm7"],   //  points to POJO of spec literal from UI store; looks like
   "uuid":    "O-12-44zv3z",    //    ``` {"framespec": { "defs": [], "rules":[] }} ```
   "outs":    "S-13-nh2iyo",    // S: spec
   "desc":    "created spec definition for frame 'isbns' (jclmax)",
  "block":    "xvzop8.1",
  }
  {
     "op":    "@/block/create",
    "ins":   ["U-14-dk6dqz"],   //  points to POJO of spec literal from UI store; looks like
   "uuid":    "O-15-d5i7cp",    //    ``` {"framespec": { "defs": [], "rules":[] }} ```
   "outs":    "B-16-nh2iyo",    // S: spec
   "desc":    "created block#2",
 "parent":    "xvzop8.1",
  }
]
```



```js
// get fresh nano-UUIDs
// https://runkit.com/embed/72dtht8e3htk

const generate = require('nanoid/generate')
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'
let hashes = []
[1,2,3,4,5,6].map( i => hashes.push(generate(alphabet, 6)) )
console.log(hashes)

// "", ""
```

| " `@` / `files` / `xvzop8` - `ay2cie` - `1` - `3` " |   |           |   |             |   |             |   |         |   |                   |
|:---------------------------------------------------:|:-:|:---------:|:-:|:-----------:|:-:|:-----------:|:-:|:-------:|:-:|:-----------------:|
|                          @                          | / |   files   | / |   xvzop8    | - |   ay2cie    | - |    1    | - |         3         |
|                 local uuid shortcut                 | / | namespace | / | parent uuid | - | entity uuid | - | version | - | lamport timestamp |