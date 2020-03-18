I’m working on a data architecture that supports 

1. a “schemaless” object store; 

2) stores can be constrained with validation and storage logic (providing a schema-ish layer that remains tolerant of unexpected columns & types); 

3) stores can be “forked”; 

4) forks can inherit updates from their ancestors but do not commit back to them (so stores appear to form a DAG); 

5) stores are versioned and versions are immutable; 

6) stores change by the application of predefined or user defined "operations"

7) the notebook DAG is actually composed of a tree of "operations", which are parameterized with the version uuids of the stores they consume and after execution emit new store versions

8) ideally this enables both data provenance for a single authors work and also real-time collaboration / remixing / merging with other notebook DAG fragments via an event-sourcing style architecture (this is up in the air right now, I've looked at a bunch of JS packages for CRDTs and ES and other distributed p2p data synchronization and I haven't picked one yet, primarily b/c none (besides isomorphic-git, bleh) natively support 'forking' operations - they all assume - by design - data is intended to converge)

9) i've implemented store+schema experiments in react/redux and react/mobx and remain unsatisfied and unsure about how references to stores, their elements, and "joins" or "references" in one store to another should work


---

10) user story: 

- user drags book_isbns.csv into browser

- notebook assigns putative schema, validation rules, view components, & storage logic by convention based on filetype

- notebook initializes new 'store' from contents of csv

- user creates downstream entry referencing 'isbns' from 'book_isbns' collection

- user adds new columns including 'author', 'description', and 'cover image'

- notebook reacts to new column names, scans prior notebooks & operations looking for textual similarities in definitions of ops inputs and outputs

- notebook suggests 'fetch_metatdata_from_openlibrary.api (isbn: string -> [author, description, cover_img_url])'

- user executes w/ isbns

- book_isbns 'head' now points to new uuid in stores' oplog: 'book_isbns:v2'; store now includes new columns as above

- user creates new entry w/ 'fetch' operation; 
  - ins: book_isbns:v2::cover_img_url
  - outs: files:book_covers:v1 (store with fs metadata columns + blob of image or localurl)

- notebook helps user create operation that joins 'book_isbns:v2' with 'files:book_covers:v1' by 'cover_img_url' or by 'rowid'. 
 - new store is named 'book_inventory'
 - it contains all columns in book_metadata and all columns in files:book_covers
 - but book_covers rows should be inserted by reference not value

so what is the sanest naming scheme for these references... something like '@files:book_covers:v1::row_id:v1' ? doing some experiments to decide; then procrastinating by reading literature instead ;p