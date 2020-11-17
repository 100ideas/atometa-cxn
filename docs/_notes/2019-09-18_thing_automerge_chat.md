# thi.ng discord #umbrella
reverse chronological order

---

from @toxi:

#### 9/24/19

@loganpowell#3701 no prob - think about streams as push-based message queues which can be connected into a graph (not necessarily DAG only, i.e. you *can* have cycles). the most fundamental type here is actually a `Subscription`, upon which essentially everything else is based on. subscriptions are the nodes in the pipeline / graph and each can have any number of subscribers. each node can have an associated transducer which transforms incoming values and only passes the transformed ones to its subscribers.

there are many types of subscriptions to manipulate signal-flow, e.g. toggle or partition it based on some sidechain input, merge and/or synchronize multiple streams into single one or the way round, bisect a single stream into two or more (e.g. `bisect`, `pubsub`). there're subscriptions to submit incoming values to workers, or tunnel them to workers and then wait for worker results (e.g. `tunnel` and `forkJoin`)

there are also different stream creators for different sources to start a dataflow: iterables (async & synchronous), intervals (timers), RAF, atoms, views, workers, promises...

the differentiation between a `Stream` and a `Subscription` is that the former is a subtype of the latter and usually (but not necessarily) takes a function as argument which will be invoked when the first subscriber connects and which is then responsible to generate stream values.

i was hoping the rstream readme file does explain this is all, but please do let me know if it doesn't!

as for feeling overwhelming and lack of opinionated views. am sorry to say, but the latter is was actually the whole point for me personally when i started this project. i don't dare to say "this is how it should be done" because no one really truly knows (incl. me). there're a lot of  different packages / options i explored (and keep exploring) to see what works well. but what these things are, IMHO really depends on the kind of problems you're trying to solve. over the past few years i've been building a ton of micro tools/apps and tried to capture some personal key takeaways in the form of these different packages for future re-use (which has accelerated massively esp. in the past year)

i was also hoping that some of the by now 70+ examples are do provide some guidance/opinion/preference, but again, maybe they don't and i'm wrong...
#### 9/23/19

allforabit: I got the impression that your focus was more on rstream alright. Would you see rstream as a potential replacement for the interceptors approach too? Or are these more complimentary? I.e. interceptors to help overall app structure and rstream to manage different parts of the app?

toxi:
@loganpowell#3701 my main issue with all CSP impls in JS is that they use up quite a bit of CPU cycles once the number of channels grows. that's because of the single threaded nature of JS and using `setImmediate`/`setTimeout` polling to check for queued read/write channel tasks and so emulate the blocking behavior and cooperative multitasking.

i agree, that CSP has a programming model, but I found rstream w/ transducers provides a similar experience and can be equally easily reasoned about, but doesn't involve any such polling, even if streams are idle

@allforabit#1884 as for rstream VS interceptors - I wouldn't see them as exclusive to each other and definitely as complimentary solutions. But, I'd also say it's largely a stylistic preference. whereas the interceptors package is pretty much tied to using an atom as central state container, rstream could be considered either a superset and/or a complete alternative. for simple apps, you could use a number of stream primitives holding all your state directly or source some of it from other state (incl. atoms/views)

tbh my only guidance i can offer thus far is application size. i've only used interceptors for the 2 large apps i've been working on, but even there the atom's state also feeds into a rstream dataflow graph to do the rest. so in other words, i'm only using interceptors to handle some macro tasks to edit the dataflow graph (e.g. add new processing "nodes"), but then everything else is completely rstream based... happy to explain in more detail, if that's not quite clear

@vuhg_3000#1842 re: that benchmark you linked too - it'd be interesting to know if this takes the possibility of virtual scrollers / viewports into account, since in reality you'd never use a table with actual 5000 rows (as in DOM elements), would you? using a virtual scroller approach with hdom, adding new table rows is essentially the cost of appending them to a JS array... there's a demo illustrating this approach here: https://demo.thi.ng/umbrella/hdom-vscroller/


#### 9/22/19

**@100ideas#1982 don’t have much time right now, but would recommend looking at rstream, rstream-graph and rstream-query packages in favour of csp, which i haven’t used lately at all anymore. also new version of atom pkg released yesterday has transaction support. rstream pkg offers ‘fromAtom()’ and ‘fromView()’ stream creators, but you could also think of a stream itself as a state container, with attached transducer subscriptions creating materialized views in a reactive manner

@100ideas#1982 also IIRC you’re in SFO, right? see my earlier msg above re: visit/meet - happy to walk you through it

the next version of rstream will also have better webworker support (fork-join) and a generally overhauled system of common behavior config options for all stream/subscription types.

rstream-query currently supports subset of SPARQL/datalog style queries and is based on my two earlier efforts: thi.ng/fabric and thi.ng/trio.**

---

@loganpowell's tips:
- use csp's (communicating sequential processes) + atom
- you just pull things from the queue, update and push things onto another qeueu
- here's a great video https://www.infoq.com/presentations/clojure-core-async/ (rich hickey inventor of clojure)
- also https://www.getprogrammingwithclojure.com

- https://github.com/thi-ng/umbrella/tree/master/packages/csp
- https://github.com/thi-ng/umbrella/tree/master/packages/rstream-csp
  - "Adapter bridge between async CSP channels and synchronous stream subscriptions/transformations of @thi.ng/rstream."
- https://github.com/thi-ng/umbrella/tree/master/packages/rstream
- https://github.com/thi-ng/umbrella/tree/master/packages/atom



---

messages to @loganpowell:

let me fill you in on what this is for, maybe it will have some bearing on your architecture suggestion:

so what I'm trying to do is create a tool that assists a user in modeling and capturing the results of performing real-world tasks

my insight is that almost all tasks performed in the real world today (in a 'work' context) have an endpoint that is digital, or can be captured digitally (photo + metadata; form input; structured data like csv)

the hard part is that a lot of real-world work processes involve applying a series of operations to a "material" such that it is transformed in some way but not conceptually or semantically a new "thing"

for example, a biologist has a csv file that maps 

resulting in a new digital artifact for each sample_id: cell_strain, concentration, volume, plate_location, @ref_to_additional_reagent


step0
  inputs:
    "file": samples.csv
  op: {desc: "uploaded & extracted csv file, inserted into 'samples' collection"}
  ouputs:
    "samples": sample_id(pk), cell_strain_id, concentration, volume, plate_location, _vers: 1

step1:
  inputs:
     "@samples"
  op: {desc: "add dye reagent", op_exec: 'input.samples.map( ({sample_id}) => db.getById(sample_id).merge(@ref_to_dye) )
  note: "op is in physical domain (step captures change in model of real world)"
  outputs: 
      "samples": sample_id(pk), cell_strain_id, concentration, volume, plate_location, @ref_to_dye_entry, _vers: 2

step2:
  inputs:
     <step1> // resolves to "step1.outputs.samples" table 
  op: {desc: "measure sample optical density, op_exec: 'api.call(schedula_spectrophotometer)}
  note: "op is in digital domain (step captures changes in data, not physical)"
  outputs:
     "file: spectrophotometer_results.csv,
     "samples": <input.samples + spectrophotometer.csv joined by sample_id>, _vers: 2

step3
  inputs:
     <step1> // resolves to "step2.outputs.samples"
  op: {desc: "purify bacterial DNA", op_exec: 'run(protocols.dna_extract)'}
  outputs:
     "samples": @samples //_vers: 
     

---

one of the other architecture tricky spots is how to deal with references, as in, a user operation may involve uploading several images or pdf files, adding structured data about each, then referencing or inserting-by-reference both file + metadata into yet another collection (i.e. joining multiple entities together in a row)

uuid1: {type: file, content: blob, mtime: 12344, path: 'papers/a_pdf.pdf', size: 102033}

uuid2: {type: collection, schema: @citation, shortref: "1983auth1", title: "statecharts: a...", notes: "etc", @file_ref: uuid1 }

uuid3: {type: collection, schema: @sequnces/dna/primers, shortref: "COI1_f", seq: "aaagtcttt", sources [@ref: uuid2], notes: "works, orderd on 2020 sep 1"}


---



Goal with this playground was to learn if and how a "descendant" automerge could be "forked" off of a parent, remaining in sync with / "shadowing" the parents' updates, but overriding the inherited values with local changes, if any, but not propagating these back to the parent. So, Forking, Reactive Shadowing, and unidirectional merging parent -> child.

This behaviour is analagous the common github forking + PR workflow, except the goal here is to make the automerge dataflow graph reactive and automatic, manual committing optional. Github analogy:
1. fork remote repository; set as 'upstream' remote 
2. upstream AKA parent's changes can be merged with local AKA descendant's repo, but not vice versa)
3. create branches, make commits, push changes up to origin master
4. repeat steps 2 & 3 until
5. optionally requesting upstream parent repo synchronize with child repo (pull request)

This use case tends to be out of scope of most of the eventually-consistent distributed data frameworks in the js ecosystem that I've checked out. This makes sense considering 1) "eventually consistent" is the general category and 2) the primary design goal to perfectly and automatically synchronize all instances of the distributed store - diverging forks are not seen as useful (yet).

That said, a basic `fork` function has been in `hypermerge repofrontend` since [2019-nov-29 commit b593860](https://github.com/automerge/hypermerge/commit/b593860b806a4db78b630e0d52e50fbd4e6850b9) ([latest version](https://github.com/automerge/hypermerge/blob/master/src/RepoFrontend.ts#L101)). It works like `repo.front.fork = (url: DocUrl): DocUrl => {...}`

Read the chatlog below for a suggestion on a simple & dumb way to set up deterministic forking & shadowing:


## 2019-09-24 automerge slack chat #general

#### @100ideas: 
is it possilbe yet to create a 'fork' for an automerge doc...
  1.  make or merge separate changes into the fork and the master docs,
  2.  compute materialized views for master@head, fork@head so they can be compared, 
  3. and then if desired merge fork into master,  something like `master_merge_fork = Automerge.merge(master, fork)`,

  or perhaps 

```js 
// instead of perfect interleaving of all changes, choose one branch head, 
// then apply other branch changes on top, these changes always win in case of conflict
master_changes = Automerge.getChanges(forkPointSnapshot, master@head);  
fork_changes = Automerge.getChanges(forkPointSnapshot, fork@head);
master_merge_fork = Automerge.applyChanges(fork@head, master@head) // want all conflicts resolved to master's changes
```

related discussion: https://github.com/automerge/automerge/issues/159

I have experimented w/ automerge, can't see how to do it. experiments here: https://repl.it/@100ideas/playing-with-automerge

Is this possible with hypermerge instead? I have reviewed the docs and tests but can't tell. In my application network syncing is less important than forking, comparing, and merging docs at arbitrary snapshots

####  @martinkl:
Hi @100ideas, at the moment branches/forks of documents are not well supported. You can get some of the way by maintaining two separate documents, and applying some of the changes to only one of the documents. But there is no built-in support for diffing two documents constructed this way.

I don't think Hypermerge does this either. We did experiment with branching on the Pixelpusher project (https://medium.com/@pvh/pixelpusher-real-time-peer-to-peer-collaboration-with-react-7c7bc8ecbf74) by maintaining separate docs for each branch as described, but the performance was not great.

Last week when I met with @pvh one of the things we discussed was actually better support for branching/forking. We have ideas on how to do this, but not implemented yet.


#### @100ideas: 
in my experiments I tried a variety of ways of doing that (variations on how to initialize the fork: with ancestors changes; blank from automerge.init(), etc), but I couldn't reliably find a way to ensure one branchs conflicts would always win after merging back.

writing it out now, I realize that I probably needed to go one step further and scan the final merged doc for all conflicts, then "manually" resolve them in favor of the desired branch besed on its docId

####  @martinkl:
Yes, in the current design, if you change a property value on two branches and then merge, you will get a conflict, and the default resolution chosen is indeterminate. There currently isn't a way of saying that all values from one particular branch should win.

Scanning the documents looking for conflicts is probably the best way of dealing with it.


#### @100ideas: 
previously I implemented a unidirectional reactive dataflow between two schemaless tables using mobx. updates to the parent store propogated and reactively updated on the child store, unless the child store had made a change to that particular element. but changes to the child store would not reactively update the parent store.

here is a temporary demo http://4187fae7.ngrok.io

I'm sure it could be cleaned up a lot, but my experience was that it was pretty hairy to create the mobx class / field accessors for the table store due to needing to resolve deep property nesting in certain ways

on the topic of mobx, is it possible attach change handlers that trigger when an automerge doc is changed? I saw some tests for `Automerge.WatchableDoc(doc).registerHandler(callback_func)` but didn't see any docs... is WatchableDoc available in automerge or hypermerge? http://github.com/automerge/automerge/blob/master/test/watchable_doc_test.js (github.com/automerge/automerge/blob/master/test/watchable_doc_test.js)


####  @martinkl:
WatchableDoc is a simple class that ships with Automerge https://github.com/automerge/automerge/blob/master/src/watchable_doc.js

What do you want to do in the change handler? Is it sufficient to get a reference to the new document, or do you need a diff of what has changed compared to the previous version?


#### @100ideas: 
cool. if I end up pursuing this with automerge, I'll probably try the technique described above to force a winner for conflicts & try integrating mobx using WatchableDoc.

just getting the new doc is fine, I can keep track of snapshots separately for computing diffsets

actually on that note, is there a single value or combination of values that can be used to reference an arbitrary version of an AM doc? I know I could keep track of the getHistory() index, but maybe there is a more reliable way w/ `seq` or something?


####  @martinkl:
Hmm, good question. There is, but I don't think it's currently exposed in the API. Let me check…


#### @pvh:
@100ideas we did a lot of experimenting in pixelpusher with this stuff, and i think if someone was working actively on it it might be worth reviving the old thread there about better fork / branch support

but if you grab http://github.com/inkandswitch/pixelpusher (github.com/inkandswitch/pixelpusher) you can play with it. note that it's written against an older automerge.


####  @martinkl:
***a hacky approach is as follows. Import this constant from Automerge's internals:
```const { STATE } = require('automerge/frontend/constants')```

Now if `doc` is an Automerge document, then
```doc[STATE].backendState.getIn(['opSet', 'clock']).toJS()```
returns an object where the keys are actorIds, and the values is the highest change sequence number processed by that actorId (aka a vector clock). Every time you apply any change, the corresponding sequence number will be incremented.

Oh wait, this way is better:
```Automerge.Frontend.getBackendState(doc).getIn(['opSet', 'clock']).toJS()```
(avoids having to import that constant)***


#### @100ideas: 
to be honest I am kind of leaning now towards a different approach... instead of CRDT, thinking of implementing a simple 'event-sourcing' type message store that captures append-only log of delta updates to row objects; msgs are keyed something like entityid-branchid-version; then I can computed materialized views of Sets of rows filtered by branchid. 

The tricky part is I want to branchid_2 aggregate view to always recompute if any branchid_1 msgs are received, i.e. instead of proper forking and merging, I want child 'branches' that stay up to date reactively with parent, then apply any of their changes on top

something like `branch2View =  reactiveComputeAggregate( [...branchid-1-msgs, ...branchid-2-msgs] )`

I think this event log will be more terse & human readable when serializing to flat files 
/ disk.