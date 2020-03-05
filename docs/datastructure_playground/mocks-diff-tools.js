/** quokka.js repl to play w/ structured diffs
 * 
 *  2020-03-03: created
 */

// console.log(__dirname)
import odiff from 'odiff'
import * as jsondiffpatch from 'jsondiffpatch'
import { diffObject } from '@thi.ng/diff'

let b2 = {
      id         : 'isbns',
      name        : 'isbns',
      description : "book's isbn_10 formatted string",
      tags        : [ 'isbn', 'isbn_10', 'isbn10', 'isbn-10' ],
      spec        : {
        $id         : 'isbns',
        title        : 'book isbns',
        description : 'letbook isbns, only isbn10',
        entities: {
          isbn_10 : {
            type        : 'string',
            description : 'ISBN-10',
            displayName: 'isbn',
            example     : '0-449-23949-7',
            validation  : ''
          }
        }
      }
    }

let b3 = {
  "_id": "block_1/uid2/v1",
    "name": "books - block1 output",
    "description": "initial draft of book inventory table",
    "defs": [ {_self: "delete_me"}],
    "rows": {
      'block_1/uid2/v1-books/uid3/001':  {
        "_id": "block_1/uid2/v1-books/uid3/001",
        "isbn": "000-1111-111Z12"
      }
    }
  }

let b4 = {
  "_id": "block_1/uid2/v2",
    "name": "books - block1 output",
    "description": "initial draft of book inventory table",
    "defs": [],
    "rows": {
      'block_1/uid2/v1-books/uid3/001':  {
        "_id": "block_1/uid2/v1-books/uid3/001",
        "title": "mr murray goes to washington",
        "author": "bill furry",
        "isbn": "000-1111-111Z1",
        "cover": "@files/uid1/v1"
      }
    }
  }

let log = x => console.log(JSON.stringify(x, null, 2))

console.log("\n\n---------- @thi.ng/diff: -----------")
log(diffObject(b3, b4))

console.log("\n\n---------- odiff: -----------")
console.log(odiff(b3, b4))

// see https://github.com/benjamine/jsondiffpatch/blob/master/docs/deltas.md
console.log("\n\n---------- jsondiffpatch: -----------")
console.log(JSON.stringify(jsondiffpatch.diff(b3, b4), null, 2))