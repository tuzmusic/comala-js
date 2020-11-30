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