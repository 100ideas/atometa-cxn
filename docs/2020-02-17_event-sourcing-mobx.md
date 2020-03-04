# 2020-02-17 event sourcing mobx

exploring ways of implementing event-sourcing style state tree for notebook.

Goal is: render how change to the past (an ancestor nodes history) would change the present, and possibly commit/accept the change

things to rememeber:
- docs/2020-02-12_vscode_timeline_and_undo_branches.md
- https://github.com/thi-ng/umbrella/blob/develop/examples/rstream-spreadsheet/src/dsl.ts
- https://uprtcl.github.io/js-uprtcl/modules/_uprtcl_cortex.html

Q. if there are two kinds of messages, COMMANDS and EVENTS, do they both need to be saved for replay?
- do they keep refs to one another? Why?
- do they live spread out in components, or one big log?

if they live in big log, do components present an API like the subset of messages that effect them are local to them? how without duplication?




TODOs:

1. [implement toy] ES-style array reducers with block scope
2. [review code] rstream-spreadsheet
3. [review code] redux-dag-history/src/DagGraph
4. [review code] observable-runtime
5. [review code] vscode TimelineProvider
6. [review code] uprctl/cortex



---
```js
/* makeRangeIterator(), getNextId(), getCurrentId()
** 
** getNextId() returns next integer starting from 0
** configure custom iterator w/ makeRangeIterator(opts)
** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
**  
**    const it = makeRangeIterator(1, 10, 2);
**
**    let result = it.next();
**    while (!result.done) {
**      console.log(result.value); // 1 3 5 7 9
**      result = it.next();
**    }
**    // [5 numbers returned, that took interval in between: 0 to 10]
**    console.log("Iterated over sequence of size: ", result.value);
*/
```