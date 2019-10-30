https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations

https://www.quirksmode.org/js/events_order.html#link4

https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture

https://developer.mozilla.org/en-US/docs/Web/API/Event

https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

5.7.5. Drag-and-drop processing model
https://www.w3.org/TR/html51/editing.html#drag-and-drop-processing-model

5.7.5.10
During the drag operation, the element directly indicated by the user as the drop target is called the immediate user selection. (Only elements can be selected by the user; other nodes must not be made available as drop targets.) However, the immediate user selection is not necessarily the current target element, which is the element currently selected for the drop part of the drag-and-drop operation.

The immediate user selection changes as the user selects different elements (either by pointing at them with a pointing device, or by selecting them in some other way). The current target element changes when the immediate user selection changes, based on the results of event listeners in the document, as described below.

5.7.5.3
(Otherwise, the source node is part of another document or application. When this specification requires that an event be dispatched at the source node in this case, the user agent must instead follow the platform-specific conventions relevant to that situation.  ... WTF?!)




5.7.5.9
Fire a DND event named dragstart at the source node.

5.7.5.10.2
every 350ms +/- 200ms: Fire a DND event named drag at the source node. If this event is canceled, the user agent must set the current drag operation to "none" (no drag operation).

5.7.5.10.3.1
If the user is indicating a different immediate user selection than during the last iteration (or if this is the first iteration), and if this immediate user selection is not the same as the current target element, then fire a DND event named dragexit at the current target element,  and then update the current target element as follows:

- Fire a DND event named dragenter at the immediate user selection.

If the immediate user selection is an element that itself has an ancestor element with a dropzone attribute that matches the drag data store
Let new target be the nearest (deepest) such ancestor element.

If the immediate user selection is new target, then leave the current target element unchanged.

Otherwise, fire a DND event named dragenter at new target, with the current current target element as the specific related target. Then, set the current target element to new target, regardless of whether that event was canceled or not.


