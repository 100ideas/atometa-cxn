
https://github.com/thi-ng/umbrella/blob/master/packages/rstream-query/src/convert.ts
https://runkit.com/5cb8399063dce600123cc95b/5cb83990da37ad00132261c8

https://github.com/datodev/dato/blob/master/src/shared/dato/db/utils.cljc

https://github.com/typeetfunc/rx-datascript/blob/master/test/index.spec.js

https://github.com/smallhelm/level-fact-base
https://github.com/levelgraph/levelgraph
https://github.com/trivialsoftware/trivialdb

```js static
const { TripleStore, asTriples } = require("@thi.ng/rstream-query");
const { trace } = require("@thi.ng/rstream");

const rawDb = {
    file: {
        type: "schema",
        hasAttrib: ["filename", "filext", "path", "blob"]
    },
    apiConfig: {
        type: "schema",
        hasAttrib: ["url", "format"]
    },
    url: {
        type: "schema",
        hasAttrib: ["url"]
    },    
    isbn: {
        type: "schema",
        hasAttrib: ["isbn"]
    },    
    block1: {
        type: "block",
        op: "file.parseCSV",
        outputs: {
            parsedCsv: {
                schema: "isbn",
                values: [
                  "xyzz-1111",
                  "00z-1111",
                  "z-10239-011"
                ]
            }
        }
    },
    block2: {
        type: "block",
        op: "computeCol",
        inputs: "isbn",
        outputs: {
            isbns: {
                schema: ["isbn", "url"],
                values: [
                  "xyzz-1111, http://aaa.com",
                  "00z-1111, http://bbb.com",
                  "z-10239-011, http://zzz.com"
                ]
            }
        }
    },    
    block3: {
        type: "block",
        inputs: ["url", "isbn"],
        op: "http.fetch",
        outputs: {
            bookMeta: {
                schema: ["isbntitle.author"],
                values: [
                  "xyzz-1111 aaaa first title auth name",
                ]
            }
        }
    }
}

const store = new TripleStore(asTriples(rawDb));

// console.log([...asTriples(rawDb)])

// store.addJoin(
//     // store.addParamQuery(["block3", "inputs", "?ins"]),
//     store.addQueryFromSpec({
//         q: [
//             { where:[
//                 ["block3", "inputs", "?ins"]
//             ]}
//         ]
//     }),
    
//     store.addPathQuery(["?block", ["outputs", "?_", "schema"], "isbn" ])
// )

store.addPathQuery(["?block", ["outputs", "?_", "schema"], "isbn" ])

// store.addQueryFromSpec({
//     q: [{
//         path: ["block3", ["inputs"], "?inSchema" ],
//         // where: [
//         //     ["block3", "inputs", "?ins"],
//         // ],
//         // path: ["?block", ["outputs", "bookMeta", "values"], "?values" ],
//         path: ["?schema", ["hasAttrib"], "?inschema" ],
//     }]
// })

store.addQueryFromSpec({
    q: [
        {
            // all "where" subqueries are joined (logical AND)
            where: [
                ["block3", "inputs", "?ins"]
            ],
            where: [
                ["block3", "inputs", "?ins"],
                ["?schema", "type", "schema"],
                ["?block", "outputs", "?outputs"],
                ["?outputs", "?outName", "?outName"],
                ["?outName", null, "?outSchema"],
                ["?schema", "hasAttrib", "?outSchema"],
            ]

        }
    ],
    bind: {
        // answer: (res) => JSON.stringify(res)
        answer: (res) => [res.block + "::" + res.outSchema, "-->", "block3::" + res.ins ]
    },
    // // another post-processing step, only keeps "answer" var in results
    select: ["answer"]
})
.subscribe(trace("results"))
```