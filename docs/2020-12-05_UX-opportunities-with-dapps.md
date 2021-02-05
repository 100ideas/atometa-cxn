# UX implications of fully-decentralized local-first collaborative data

Direct access to source code, enabled by the "archaic" architecture of software development + collaborative revisioning systems + modern web 2.0 social networks has amplified the growth of the the programming profession and consequent innovation value of the entire profession in ways that may be intuitive to professional developers but few others, if any. The specialness of these particularities can be difficult to appreciate by those who are deeply immersed in them, and nigh invisible to those farther afield.

I am fascintated by the the code-as-file pattern. At first glance softare is a comprised at the source by a directory of fragments of source code serialized into simple plain-text files, often with a bit of metadata, which sophisititcated build and collaboration tools operate on to both produce the executable code and the collaborative revisioning systems that are actually the fullest representation of the codebase, fully encompassing all historical file-and-author changes to the codebase.

Code is a file of text. Code is an AST produced from that text. Code is the directed graph over time and people of implementation ideas... any given source code "file" is merely the current tip of the code-history-tree-iceberg sliced at a certain point of time.

The  graph is the fundamental thing. But we have intuitions, expecations, tools, and affordances that generally expect code to be static files.

It has upsides!

- browsing, versioning, searching, remixing, code-as-files is easy and well-understood. The data is well-suited to democratic use.

- jupyter in particular serializes the notebooks program (with optional narrative) to an array of cells as json, which also contain residual snapshots of the last execution result of the cell... all in an ascii file. This in my opinion has been the primary thing that caused jupuyter to explode in use and win the computational notebook war

So I think I should be designing and building a system that maximizes viral growth and ultimate social value and reach by providing for a "fundamentally a txt file of source code and data" UX and serialization format like juputer pioneered.

The question is how to also best take advantage of dweb tech.

Notebook cells specify Frames and Binding for data + computations. Result of Executions, which are application of data inputs to a Frame, ephemeral computation, and strongly logged results, can be stored in distributed data structures, even dags of dags, etc via dweb. 

But user just wants to see table show up below their computational cell. If we have committement to ascii-file src code for a notebook and notebook cell, do we just inject a snapshot of the result as structured data into the ascii doc near the cell? seems like rather it should be stored in dweb individually and separately, and then linked or materialized or both into the src code output section. Implementation vs Execution can and should be abstracted and separated. 

The UX I want is content and program represented via familiar files - md, json, csv, excel, txt, js, in fact, just one file for notebook, with data inputs and outputs to dag seen as pure snapshots serialized conincidentally as the files one would expect... but changes to these IO files reactively cause the dweb DAG to recompute as necessary, capturing new versions of data deps along way. 

----

Does canonical src live in dweb merkle tree, with "files" really just projections from that ultimate source? But I want edits to these tips of the tree to reactively cause updates, while also remaining suffient without the dweb tree to rehydrate the working app (just no history)...

maybe notebook shouldn't respect any external edits to its data deps as files, at least not automatically - instead insisting user reconcile changes with what is in dweb tree, which then edits external files.

Markdown is a nice format. It would be nice if there was a singular large markdown or mdx file that could store an entire notebook's textual & narrative content, in a way consistent with markdown editors - so md or mdx, rather than md-in-json-array like iplynb. 

----

Use case: send, email, discover, fork, cut-n-paste etc src from notebook file / note files into editor or new src file for editor and the result both works and somehow tracks its prior ancestry and deps. 

Maybe flip the narrative-vs-program primacy - markdown notes are serialized out of the more canonical notebook file, which is the tip of the dweb db materialized to disk and contains all content and metadata tha would be considered the traditional "program" of the notebook, maybe also execution residuals. NB has special watchers that pick up on edits to individual md file projections and reincorporate them into master file (which is also projection, but just one file, and structured data w/ markdown strings, instead of asciish markdown w/ yaml/json blocks).


I guess the main question is: what users and use cases in particular are going to benefit / want / be amazed by "src code as ascii files" access to their notebook, and in particular, the data attached to notes / output from notes? Is it really important to edit the notes as MD first and have data flow second?

Current UX for notebooks besides computation NB is MD files for each entry. But then there are 100000x more consumer/b2b cloud apps that do similar things but never provide "file src" affordances for the state of the users content. 

Its tough, because a snapshot of work, which the narrative md wants to include and is trying to describe, is not going to need access to databases per se - just strong links. The tables and data and blob files produced from seom workflow should be considered immutable and static for that particular user-code-inputs-time-place. SO it makes sense to serialize ouputs directly into NB file or proximal directory, and assume they will not change.