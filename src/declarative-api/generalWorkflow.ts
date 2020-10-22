import WorkflowCreator from './classes/WorkflowCreator';
import Tag from '../Tag';
import { StateObject } from './types';

export const states = {
  migration: 'Migration',
  inProcess: 'In Process',
  inReview: 'In Review',
  inApproval: 'In Approval',
  published: 'Published',
};
export const approvals = {
  assign: 'Assign Roles',
  author: 'Author Review',
  peer: 'Peer Review',
  manager: 'Manager Approval',
  approval: 'Approval',
};

const director = 'Higher Authority';
const docAuthor = 'Document Author';
const managers = () => [director, docAuthor, 'author'].map(n => `@${ n }@`);
const managersOnly = () => ({ users: managers(), groups: [] });

const sliGroup = 'SLI Internal';
const firstTwoMainStates = (name: string, nextName: string, reviewersCanEdit): StateObject => {
  const state: StateObject = ({
      name: name,
      // even though we don't want the reviewers' approval to advance the state,
      // the state isn't considered approved until all reviews are done, which means
      // not until the managers have all approved. Since a manager approval advances
      // the state on its own, there's no harm in setting onApproved.
      // If we don't set onApproved, then the diagram in the workflow builder is
      // misleading (not to mention really weird).
      onApproved: nextName,
      permissions: {
        viewAndEdit: managersOnly(),
      },
      approvals: [
        {
          name: approvals.peer,
          reviewersCanEdit,
          allowedAssigners: managersOnly(),
          allowedApprovers: { users: [], groups: [sliGroup] },
          approveLabel: 'Ready',
          rejectLabel: 'Not Ready',
          // rememberAssignees: true,
          otherParams: { assignable: true },
        },
        {
          name: approvals.author,
          fastApprove: nextName,
          otherParams: { user: '&' + managers() },
        },
      ],
    }
  );

  // not the most elegant way to do this but whatever.
  if (name === states.inReview)
    state.approvals.find(({ name }) => name === approvals.author)
      .fastReject = states.inProcess;

  return state;
};

const workflow = new WorkflowCreator({
  name: 'DCR Workflow',
  label: 'dcr-test',
  parameters: [
    { name: director, type: 'user', edit: true },
    { name: docAuthor, type: 'user', edit: true },
  ],
  states: [
    {
      name: states.migration,
      onApproved: states.inProcess,
      otherParams: { hidefrompath: true, colour: '#4A6785' },
      approvals: [
        {
          name: approvals.assign,
          otherParams: { user: '&@author@' },
          approveLabel: 'Ready',
          rejectLabel: 'Cancel',
          reviewersCanEdit: true,
        },
      ],
      permissions: {
        viewAndEdit: { users: ['@author@'], groups: [] },
      },
    },
    {
      ...firstTwoMainStates(states.inProcess, states.inReview, true),
      // migrator must assign higher authorities
      otherParams: { requiredparams: [director, docAuthor].join() },
    },
    {
      ...firstTwoMainStates(states.inReview, states.inApproval, false),
      otherParams: {
        colour: '#0052CC',
        // for diagram. doesn't really do anything and is safe to have anyway.
        rejected: states.inProcess,
      },
      // author review fast-rejects to in process
      // approvals:
    },
    {
      name: states.inApproval,
      onApproved: states.published,
      otherParams: {
        colour: '#6554C0',
        // for diagram. doesn't really do anything and is safe to have anyway.
        rejected: states.inReview,
      },
      permissions: {
        viewOnly: managersOnly(),
        viewAndEdit: { users: [], groups: [] },
      },
      approvals: [
        {
          name: approvals.manager,
          fastReject: states.inReview,
          otherParams: { user: '&' + managers()[0] },
        },
        {
          name: approvals.approval,
          fastReject: states.inReview,
          allowedAssigners: managersOnly(),
          allowedApprovers: { users: [], groups: [sliGroup] },
          // rememberAssignees: true,
        },
      ],
    },
    {
      name: states.published,
      final: true,
      permissions: {
        viewOnly: { users: [], groups: [sliGroup] },
        viewAndEdit: { users: [], groups: [] },
      },
    },
  ],
});

// enable selection from published to in process
workflow.states[workflow.states.length - 1].addChild(
  new Tag('state-selection', { states: states.inProcess, user: managers().slice(0, 2) }, true),
);

//

workflow.getMarkup();
