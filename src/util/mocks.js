/////////////////// mock jsonish ////////////////////////////

export const mock_files = {
  "core/files": {
    "_id": "core/files",
    "name": "clientside notebook filestore",
    "description": "atometa built-in clientside file db",
    "defs": [],
    "rows": [
      {  
        "@id": "files/uid1/v1",
        "@type": "core/file",
        "name": "MOCK_fillmurray100.png",
        "size": '11111',
        "mtime": '',
        "blob": ''
      }
    ]
  }
}

export const mock_books_by_id = {
  "block_1/uid2/v1": {
    "_id": "block_1/uid2/v1",
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
}

// kvArray for easy Map() creation
export const mockDefinitions = [
  [ 'isbns',     
    {
      id         : 'isbns',
      name        : 'isbns',
      description : "book's isbn_10 formatted string",
      tags        : [ 'isbn', 'isbn_10', 'isbn10', 'isbn-10' ],
      spec        : {
        $id         : 'isbns',
        title        : 'book isbns',
        description : 'book isbns, only isbn10',
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
  ],[ 'book_meta',
    {
      id         : 'book_meta',
      name       : "Books",
      description: "book_inventory",
      tags       : [ 'book' ],

      // schema data
      spec     : {
        $id         : '#book_meta',
        title        : 'book metadata',
        description : 'schema of book metadata from openlibrary API',
        entities  : {
          isbn_10         : {
            description : 'ISBN-10',
            type        : 'string',
            displayName: 'cover',
            description: '',
            example: '',
            validation: '',
          },
          title           : {
            description : 'title of work',
            type        : 'string'
          },
          worksUrl        : {
            description : 'openlibrary.org URI',
            type        : 'string'
          },
          publisher       : {
            description : 'publisher',
            type        : 'string'
          },
          author          : {
            description : 'author',
            type        : 'string'
          },
          number_of_pages : {
            description : 'number of pages',
            type        : 'int'
          },
          publish_date    : {
            description : 'publication date',
            type        : 'string'
          },
          isbn_13         : {
            description : 'ISBN-13',
            type        : 'string'
          },
          thumbnail_url   : {
            description : 'thumbnail url',
            type        : 'string'
          }
        }
      }
    }
  ]
]

// rules      : [
//   ['#', 'collection-level'],
//   ['#/isbn_10', x => typeof x === 'string' && x.length === 10],
// ],
// example    : {
//   isbn_13         : 9780449239490,
//   isbn_10         : '0449239497',
//   title           : 'I, Robot',
//   author          : 'Isaac Asimov',
//   description     : 'The three laws of Robotics:\r\n\r\n 1. A robot may not injure a human being or...',
//   publisher       : 'Fawcett Crest',
//   number_of_pages : 192,
//   publish_date    : '1977',
//   worksUrl        : 'https://openlibrary.org/works/OL46404W.json',
//   thumbnail_url   : 'https://covers.openlibrary.org/b/id/6517773.jpg'
// },

export const mock_book_and_meta = {...mock_books_by_id['block_1/uid2/v1'], shortName: 'book_inventory', meta: {...mockDefinitions[1][1]}}