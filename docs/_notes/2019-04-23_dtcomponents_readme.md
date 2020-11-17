
---

## api notes

just try to do validation & schemas in typescript?
- https://areknawo.com/typescript-introduction/
- https://basarat.gitbooks.io/typescript/content/docs/classes.html

### editors
- https://github.com/ifiokjr/remirror
- https://github.com/sparksuite/simplemde-markdown-editor
- https://github.com/luketurner/scripsi/blob/master/src/ui/components/text-editor.tsx
- ghost [editor docs](https://docs.ghost.org/faq/using-the-editor/) & [koenig-editor src](https://github.com/TryGhost/Ghost-Admin/blob/master/lib/koenig-editor/addon/components/koenig-editor.js)
```shell
torchy:/Users/100ideas/dev/js/ghost/ghost-src on master
$ bash
------------------------------------------------------------------00:59:23
100ideas:ghost-src$ yarn run grunt dev
yarn run v1.12.3
$ /Users/100ideas/dev/js/ghost/ghost-src/node_modules/.bin/grunt dev
```

### files

### workflow & validation engines
- [shortbus](https://github.com/coreybutler/shortbus) A lightweight flow control module that works like a mini event bus + serial/parallel processor.
- [provenance-core](https://github.com/VisualStorytelling/provenance-core) "provenance-core is designed to record and replay user interaction in web applications"
- https://github.com/lukepur/data-workflow-engine A configurable data workflow engine. Configure an engine with: config json + yaml computation_context
- https://www.fusioo.com/product/workflows interesting ui w/ `Triggers`, `Conditions` & `Actions`
  - https://www.fusioo.com/guide/workflows
  - 

### taxonomy & schemas
- https://github.com/jquense/yup Yup is a JavaScript object schema validator and object parser
- https://github.com/bigpipe/assume Expect-like assertions that works seamlessly in node and browsers
- https://github.com/moll/js-must An assertion library for JavaScript and Node.js with a friendly BDD syntax (awesome.must.be.true())
- https://ajv.js.org/ json-schema validator w/ support for refs, meta-schema etc 
- frictionless data tableinfer: https://github.com/frictionlessdata/tableschema-js#async-tableinferlimit100
- [metatab tableintuit.py](https://github.com/Metatab/tableintuit/blob/master/tableintuit/cluster.py): Guess the structure of a CSV or spreadsheet table, identifying header rows and data types
- https://gmousse.gitbooks.io/dataframe-js/#dataframe-js

### cool modules
- https://lunrjs.com/ js fulltext search
- https://react-sync-scroll.netlify.com
  - https://hackernoon.com/react-at-60fps-4e36b8189a4c
  - https://dev.to/nishanbajracharya/what-i-learned-from-building-my-own-virtualized-list-library-for-react-45ik
- http://gaearon.github.io/react-hot-loader/
- https://github.com/pirate/ArchiveBox
- react-query-builder https://ukrbublik.github.io/react-awesome-query-builder/
- https://github.com/gajus/table turn structured data into ascii tables

```markdown
╔════╤════╤════╗
║ 0A │ 0B │ 0C ║
╟────┼────┼────╢
║ 1A │ 1B │ 1C ║
╟────┼────┼────╢
║ 2A │ 2B │ 2C ║
╚════╧════╧════╝
```
---

## oplog / actionlog notes

- [@thi.ng/rstream-query](https://github.com/thi-ng/umbrella/tree/master/packages/rstream-query) Dynamic & declarative dataflow graph construction via high-level data specs and/or functions
  - demo: https://github.com/thi-ng/umbrella/blob/master/packages/rstream-query/test/example.ts
- [levelgraph](https://github.com/levelgraph/levelgraph/blob/master/README.md)
- [level-fact-base](https://github.com/smallhelm/level-fact-base)  Store immutable facts and query them with datalog. 
- [datascript-tutorial](https://github.com/kristianmandrup/datascript-tutorial/blob/master/todo_app.md)
- [shallow dive into DataScrip internals](http://tonsky.me/blog/datascript-internals/) (cojure)
- [datascript 101 pt 2](http://udayv.com/clojurescript/clojure/2016/05/06/datascript101-chapter2-uniqueness-and-indexing/) (clojure)



## metatab

excerpted from https://github.com/Metatab/metatab/blob/master/docs/Wrangling%20packages.rst
also see `da-play/1_overmind/dtcomponents/docs/metatab_terms-schemes-namespaces-mapping.md`

Guide to Wrangling Metatab Packages
===================================

Setting the Name
----------------

For any non-trivial use, the `Root.Name` term is critical; most Metatab programs require it to be set. It can be set directly, but it is much more useful to allow `metapack` to set it, by aggregating other terms. The other terms that `metapack` will combine to create a name are:

- Dataset. The base name of the dataset.
- Origin. A part of a domain name ( like 'usgs.gov' or 'census.gov' ) for the source of the data.
- Version. An integer version number
- Space. The name of the region that the data covers. 
- Time. A year, year range, or other time interval for the temporal coverage of the data. 
- Grain. The name of what each row is about, such as a 'school' or a 'county' or a 'person'

The `Space`, `Time` and `Grain` are usually only used to distinguishing this package from other packages. If there is only one package for a particular `Dataset` value, these three terms are rarely used. 

Setting the `Dataset` term triggers rebuilding the `Name` term; if `Dataset` is not set, `metapack` will not update the `Name` term. You can run `metapack -u` to force regenerating the name.

Adding Properties to Sections
-----------------------------

`Root.Section` terms introduce Sections, which both group terms and set the headings for term properties. In the Section row, all of the values in the 3rd and later columns set the property name for child property terms. For instance, the default `Schema` section is:

```markdown
    A       B       C           D       E
    Section	Schema	DataType	AltName	Description
```

The B column is the section name, and the C, D, and E columns cause the parser to interpret values in those columns as being child values of terms on the row, with a term name given by the header in the ``Section`` Line. So, for a row that starts with a `Table.Column` term, the value in the C column is the value for a `Column.DataType` property.

You can re-order these header values, and can create new ones, but in some cases, the `metapack` program will expect some properties to exist. For instance, every `Table.Column` term must have a `Column.DataType` term.

### example

`docs/metatab_terms-schemes-namespaces-mapping.csv` as `.tsv`:
- source: https://docs.google.com/spreadsheets/d/1mO5nHNXpImT2w_M9VlhUJ0OeMp0x2Zq5OwiiTPXJ-M8/edit#gid=2086891330
- docs: https://github.com/Metatab/metatab-declarations/blob/master/specs/Metatab%20Packages.md#metadata-example
- test-data: https://github.com/Metatab/metatab/tree/master/metatab/test/test-data

```tsv
	Realm	Metatab	datapackage	datapackage.csv	POD1.1	DCAT	CKAN	DublinCore	SchemaOrg
1	Dataset	Root.Title	title	Root.Title	title	dct:title	title	title	name
2	Dataset	Root.Summary						abstract	about
3	Dataset	Root.Description	description	Root.Description	description	dct:description	notes	description	description
4	Dataset	Root.Subject			theme	dcat:theme	groups	subject	
5	Dataset	Root.Keyword	keywords	Root.Keywords	keyword	dcat:keyword	tags		keywords
6	Dataset	Root.Image	image	Root.Image					
7	Dataset	Root.Name	name	Root.Name					
8	Dataset	Root.Identifier			identifier	dct:identifier	id	identifier	
```

`docs/metatab_terms-schemes-namespaces-mapping.csv` as `markdown-table`:
  - thanks https://donatstudios.com/CsvToMarkdownTable

| "Section"    | "Schema"  | "datatype" | "valuetype"      | "description"                                                                             | 
|--------------|-----------|------------|------------------|-------------------------------------------------------------------------------------------| 
| "Table"      | "Table1"  |            |                  | "HCI Indicator 653.0: Percent of adults age 18 years and older who are registered voters" | 
| "Column"     | "Column1" | "int"      | "year range"     | "Year or years that indicator was reported"                                               | 
| "Column"     | "Column2" | "str"      | "dimension"      | "Type of record"                                                                          | 
| "Column"     | "Column3" | "str"      | "gvid"           | "GVid version of the geotype and geotypeval"                                              | 
| "Column"     | "Column4" | "str"      | "label for gvid" | "Census name of geographic area"                                                          | 
| "Table"      | "Table1"  |            |                  | "HCI Indicator 653.0: Percent of adults age 18 years and older who are registered voters" | 
| "Column"     | "Column1" | "int"      | "year range"     | "Year or years that indicator was reported"                                               | 
| "Column"     | "Column2" | "str"      | "dimension"      | "Type of record"                                                                          | 
| "Column"     | "Column3" | "str"      | "gvid"           | "GVid version of the geotype and geotypeval"                                              | 
| "Column"     | "Column4" | "str"      | "label for gvid" | "Census name of geographic area"                                                          | 
| "Column.Foo" | "Bingo"   |            |                  |                                                                                           | 
|              |           | "Bingo 1"  | "BIngo 2"        |                                                                                           | 








### levelgraph "triple" example (hexastore)
```js static
var triple = { subject: "a", predicate: "b", object: "c", "someStuff": 42 };
db.put(triple, function() {
  db.get({ subject: "a" }, function(err, list) {
    console.log(list);
  });
});
```

---


```js static
// js-literal style
inputs: [
  $scanFile: {

// property path
// predicate (path or function) 
// result
    { 
      MUST_BE_TRUE: [
      [ 'file/name',    'length > 3',                 true ],
      [ 'file/name',    'length < 255',               true ],
      [ 'file/type',    '['csv', 'tsv', 'xls']',      true ],
      [ 'file/parseWith',  'dataFrame/csv',           true ],
      [ 'data/table/header, '!= null',                true ],
      [ 'data/table/rows, 'true',                     true ],
      [ 'data/table/rows, 'length > 2',               true ],
    ],
    SHOULD_BE_TRUE: [
      [ 'data/table/columns', 'length > 3',            true ],
      [ 
        'data/table/columns', 
        map(col) => col.name in ['ID' or 'id' or 'uuid'],
        true 
      ],
        'data/table/columns/names', `oneOf: ['ID' or 'id' or 'uuid']`
    }
      
    
  ]
]
```

---

```markdown static
// datalogish

<thingid> ref $scanFile
  $scanfile /validation $result
    /rules 
      /MUST_HAVE
        /file/name $name
          /length/greaterThan 3
          /length/lessThan 255
        /file/type 
          'csv' or 'tsv' or 'xls'
        /datatable/header
        /datatable/rows
          /count/greaterThan 2
      /SHOULD_HAVE
        /datatable/columns $columns
          /count/greaterThan 3 
          /includes
            $col1 
              /name: 'ID' or 'id' or 'uuid'
              /datatype: string or int or uuid
            $col2 
              /name
                'scans' or 'barcodes' or 'isbns'
              /rows/greaterThan 0

  $result /validation/success
    /file/save
      /file/storageLocation
        /file/path $local
      /file/name
        $scanFile $name
    /collection/create
      /collection/name $name
      /include/only
        /datatable
```

-----

```markdown noeditor
// (yamlish)

scans.csv
 MUST HAVE:
 - filetype: 
   -  [csv, xls]   // true if filetype in array
SHOULD HAVE:
- columns: 
    - count: > 3  // true if columns.count greater than 3
- col.named: 'ID' // true if any column named 'ID' 
- col.named oneOf ['scans', 'barcodes', 'isbns']
- cols.map (col) => col.name in ['scans', 'barcodes', 'isbns']
- // implicit map form
- columns:
  - name in ['name', 'list']
```