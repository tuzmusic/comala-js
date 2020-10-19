import WorkflowCreator from './classes/WorkflowCreator';
import Tag from '../Tag';
import { StateObject } from './types';

const states = {
  inProcess: 'In Process',
  inReview: 'In Review',
  inApproval: 'In Approval',
  published: 'Published',
};
const approvals = {
  author: 'Author Review',
  peer: 'Peer Review',
};

const director = 'Document Manager';
const processOwner = 'Process Owner';
const managers = () => [director, processOwner /*'author'*/].map(n => `@${ n }@`);
const managersOnly = () => ({ users: managers(), groups: [] });

const firstTwoSteps = (name: string, nextName: string, reviewersCanEdit): StateObject => ({
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
        allowedApprovers: { users: [], groups: ['SLI Internal'] },
        approveLabel: 'Ready',
        rejectLabel: 'Not Ready',
        rememberAssignees: true,
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

const workflow = new WorkflowCreator({
  name: 'DCR Workflow',
  label: 'dcr-test',
  parameters: [
    { name: director, type: 'user', edit: true },
    { name: processOwner, type: 'user', edit: true },
  ],
  states: [
    {
      name: 'Migration',
      onApproved: states.inProcess,
      otherParams: { hidefrompath: true, colour: '#4A6785' },
      approvals: [
        {
          name: 'Assign Roles',
          otherParams: { user: '&@author@' },
          approveLabel: 'Ready',
          rejectLabel: 'Cancel',
        },
      ],
      permissions: {
        viewAndEdit: { users: ['@author@'], groups: [] },
      },
    },
    {
      ...firstTwoSteps(states.inProcess, states.inReview, true),
      otherParams: { requiredparams: [director, processOwner].join() },
    },
    {
      ...firstTwoSteps(states.inReview, states.inApproval, false),
      otherParams: { colour: '#0052CC' },
    },
    {
      name: states.inApproval,
      onApproved: states.published,
      otherParams: { colour: '#6554C0' },
      permissions: {
        viewOnly: managersOnly(),
        viewAndEdit: { users: [], groups: [] },
      },
      approvals: [
        {
          name: 'Manager Approval',
          fastReject: states.inProcess,
          otherParams: { user: '&' + managers()[0] },
        },
        {
          name: 'Approval',
          fastReject: states.inProcess,
          allowedAssigners: managersOnly(),
          allowedApprovers: { users: [], groups: ['SLI Internal'] },
          rememberAssignees: true,
        },
      ],
    },
    {
      name: states.published,
      final: true,
      permissions: {
        viewOnly: { users: [], groups: ['SLI Internal'] },
        viewAndEdit: { users: [], groups: [] },
      },
    },
  ],
});

workflow.states[workflow.states.length - 1].addChild(
  new Tag('state-selection', { states: states.inProcess, user: managers().slice(0, 2) }, true),
);

workflow.getMarkup();
