# Comala JS

## Instructions
1. Write your workflow as a single `workflow` object. 
2. On your workflow object, run `getMarkup()` 
    ```
   workflow.getMarkup() 
    ```
   This will copy the markup to your clipboard, ready to be pasted in to the Comala markup editor.
   
## API (basic)
The basic object is the `Tag` object. Its API is:
```typescript
type ParamValueType = string | string[] | number | boolean;

type ParamType = { childTags?: Tag[] } & Record<string, ParamValueType | Tag[]>

// not actually an Interface, since the constructor takes args not an object  
interface TagParams {
 tagName: string
 parameters?: ParamType 
 selfClosing?: boolean
}

Tag(tagName, parameters = {}, selfClosing = false)
```
For unnamed parameters, use an underscore as the key: `{ _: 'In Progress' }`

Tags that are not `selfClosing` can take take a `childTags` param in the `parameters` object. Note that this is not currently enforced by the code. But if you do it wrong (e.g., `new Tag('state', { _: 'Published' }, true)` or `new Tag('remove-restrictions. { type: 'view', childTags: [/* some Tag(s) */] }, false)`), the workflow will obviously not work in Comala (and Comala probably won't even let you save it).

Most tags that have been implemented also have more convenient creator functions, exported as the `Creators` object from `src/UtilityTags.ts` (TODO: How is this imported when this is a package?). These have sensible first string argument, take a varargs of child tags as their final argument, and have `selfClosing` set for you.
 
Here is a full example, with the creator convenience functions:

```typescript
import Tag from './Tag';
import { Creators } from './UtilityTags';

const { State, Approval, Task, Trigger, AddRestriction, CompleteTask } = Creators;

const workflow = new Tag('workflow', {
  name: 'My Workflow',
  childTags: [
    State('In Progress', { final: false }, // state name, params
      Approval('Progress Approval', { users: ['Some User', 'Another User'] }), // approval name, params
      Task('This is the task', 'Some User') // task name, assignee
    ),
    Trigger('pageapproved', { approval: 'Progress Approval' }, // trigger type, params
      AddRestriction('view', { group: 'Some Other Users' }), // restrictions type, params
      CompleteTask('This is the Task') // task name
    )
  ]
});

workflow.getMarkup();
```

## About
### Comala Document Management
Comala Document Management (hereafter referred to simply as Comala) allows for document control workflows to be applied to Confluence pages. 
In its simplest form, a page can begin in a draft state ("In Progress"), and then be approved by users, and then move into a published state ("Approved", or "Published", or whatever you'd like to call it). For revisions, the cycle can continue: an edit to a page in the "Published" state might transition the page back into the "In Progress" state. Viewers can then switch their view between the "Published" and "In Progress" versions of the page.

### Page restrictions
Confluence is intended to be used as a wiki, where anybody can edit. But in more tightly controlled use cases, such as a Quality Management system, permissions for viewing and editing should be restricted. For instance, a document in a "Published" state, or under revision, should be editable only by certain users (the Quality Management team, the Process Owner, etc.); and if clients are users of the Confluence space or instance, they probably shouldn't be able to view QMS documents at all.

Comala enables the switching of permissions, but it doesn't make it easy. And it can't be done from Comala's workflow builder, which is their UI for designing a workflow without using any code. 

One might imagine that you could configure the "In Progress" state to always allow certain users to edit, with something conceptually like this:
```
inProgress.viewPermissions = someUsers;
inProgress.editPermissions = otherUsers;
```
And then Comala would take care of setting the permissions whenever that state is entered. This would happen behind the scenes, so that to the user it appears that, simply by configuring the state as above, the following statement is true: *"Whenever the page is In Progress, someUsers can view and otherUsers can edit."* It would then follow that whatever permissions were configured for the "Published" state would be in effect whenever the page is in that state.

In other words, you might expect Comala to work this way behind the scenes:
```
page.onStateChange = (state: State) => {
    setPageViewPermissions(state.viewPermissions);
    setPageEditPermissions(state.EditPermissions);    
}
```

### The Problem
This is not how Comala works. The hope expressed above is misplaced from the very start: there is no way to associate permissions with a state, and say "permissions for XYZ state are ABC". Comala does, however, allow you to hook into events (such as state changes, reviewer assignments, and more) and fire actions, including adding, removing, or setting restrictions. Since these are event-based actions, and not state-associated settings, we must configure series of actions. 

For example, if we want "In Progress" to be visible to User Group A, and "In Review" to be visible to Group B, and "Published" to be visible to Groups A,B,C, we'd have to configure the following sequence of events:
```
onStateChanged('In Progress').addRestriction('view', 'Group A')
onStateChanged('In Review').removeRestriction('view', 'Group A')
onStateChanged('In Review').addRestriction('view', 'Group B')
onStateChanged('In Published').addRestriction('view', 'Group A', 'Group B', 'Group C')
```

Or something like that. To make it slightly easier, you could do something like `onStateChanged('In Review).setRestriction('view', 'Group B')` which would remove and add in one fell swoop. But it's not always that simple (if that could still be called simple). If we wanted, say, to allow reviewers from outside Group B, those reviewers would need to have view permissions added when they were assigned, and revoked if/when they were unassigned.

So it's a lot of work and a lot of thought has to go into it.

### The *Real* Problem
All of that is hard enough. But I haven't been completely honest here. My pseudocode examples (which maybe aren't very "pseudo") make it appear as if Comala can be configured using Javascript, or some other common programming language.

In fact, Comala uses its own markup language. The workflow we've described, including the permissions for reviewers, would look like this:
```
{workflow:name=Sample Workflow}
    {state:In Progress|approved=In Review}
        {approval:Progress Review}
    {state}
    {state:In Review|approved=Published}
        {approval:Peer Review}
    {state}
    {state:Published|final=true}
    {state}
    {trigger:statechanged|state=In Progress}
        {add-restriction:type=view|group=Group A}
        {add-restriction:type=edit|group=Group A}
    {trigger}
    {trigger:statechanged|state=In Review}
        {set-restrictions:type=view|group=Group B}
        {set-restrictions:type=edit|group=Group B}
    {trigger}
    {trigger:pageapprovalassigned|approval=Peer Review}
        {add-restriction:type=view|user=@assignee@}
    {trigger}
    {trigger:approvalunassigned|approval=Peer Review}
        {remove-restriction:type=view|user=@assignee@}
    {trigger}
    {trigger:statechanged|state=Published}
        {set-restrictions:type=view|group=Group A,Group B,Group C}
        {set-restrictions:type=edit|group=empty-group}
    {trigger}
{workflow}
```

I suppose this isn't all that bad. I suppose it's just another markup language to learn, and it's honestly not all that bad once you learn it. `{macro-name:param1=value1|param2=value2}`, or if the first parameter is unnamed – as indicated in Comala's quite good documentation – `{macro-name:value1|param2=value2}`.

But, you're a modern coder. This is 2020. You don't want to write code in a Wild West of Comala's simple text editing interface, where you have to type every single character and hope you haven't made any errors and trust your puny human fingers and brain that everything has been done correctly! 

You want to use a fancy modern IDE that automatically closes your parens and brackets. You want code completion. You want linting or type-checking of some kind. You want to use variables for oft-used values.

Really, what you want is to program in a programming language. Javascript, let's say.

## The Solution: Comala JS
Here's our workflow in Comala JS. (written in Typescript, compiled and run with `node dist/sampleWorkflow.js`)
```js
import Tag from '../Tag';
import { Creators } from '../UtilityTags';

const { State, AddRestriction, Approval, RemoveRestriction, SetRestrictions, Trigger } = Creators;

const workflow = new Tag('workflow', {
  name: 'Sample Workflow', childTags: [
    State('In Progress', { approved: 'In Review' },
      Approval('Progress Reivew', {})
    ),
    State('In Review', { approved: 'Published' },
      Approval('Peer Review', {})
    ),
    State('Published', { final: true }),
    Trigger('statechanged', { state: 'In Progress' },
      AddRestriction('view', { group: 'Group A' }),
      AddRestriction('edit', { group: 'Group A' })
    ),
    Trigger('statechanged', { state: 'In Review' },
      SetRestrictions('view', { group: 'Group B' }),
      SetRestrictions('edit', { group: 'Group B' })
    ),
    Trigger('pageapprovalassigned', { approval: 'Peer Review' },
      AddRestriction('view', { user: '@assignee@' })
    ),
    Trigger('approvalunassigned', { approval: 'Peer Review' },
      RemoveRestriction('view', { user: '@assignee@' })
    ),
    Trigger('statechanged', { state: 'Published' },
      SetRestrictions('view', { group: 'Group A,Group B,Group C' }),
      SetRestrictions('edit', { group: 'empty-group' }),
    ),
  ]
})

// prints the workflow markup to the console, 
// and copies the markup to your clipboard, 
// ready to paste right into the Comala editor.
workflow.getMarkup() 
``` 

Okay, so it's actually more lines of code in this case. But it's a hell of a lot easier to *write*.

## TODO: 
- [X] TLDR
- [X] Explain the problem and solution
- [X] How-to guide
- [ ] Future plans
    - [ ] Improve internal testing (the regex testing classes)
    - [ ] Add Workflow Tester module, for testing the actual workflow in the wild
    - [ ] Additional specific Creator functions
    - [ ] Typings for Creator functions
    - [ ] Advanced smart workflow creator. This might be too big an undertaking. 
        - See existing `WorkflowCreator` implementation. It's pretty great in theory. But it doesn't completely implement even our own workflow correctly, and it certainly would be phenomenally involved to account for the infinite number of things you might want to do in a workflow. 