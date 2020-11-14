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

workflow.getMarkup()