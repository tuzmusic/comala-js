import { Event } from './api-constants';
import { WorkflowObject } from './types';

export const workflow: WorkflowObject = {
  name: 'Audit Workflow with Assigned Editing',
  label: 'workflow=internal-audit-record-editassign',
  states: [
    {
      name: 'In Progress',
      onApproved: 'In Approval', // clearer name? since this implies a function
      approvals: [
        {
          name: 'Audit Editing',
          rememberAssignees: true,
          allowedAssigners: {
            groups: ['Internal Audit Managers'],
            users: [] as string[],
          },
          allowedApprovers: {
            groups: ['Internal Audit Managers', 'Internal Audit Team'],
            users: [] as string[],
          },
        },
      ],
      tasks: [
        {
          name: 'Assign editors',
          assignee: '@author@',
          completeOn: Event.reviewersAssigned('Audit Editing'),
        },
      ],
      permissions: {
        viewOnly: {
          groups: ['Internal Audit Managers', 'Internal Audit Team'],
          users: [] as string[],
        },
        viewAndEdit: {
          groups: ['Internal Audit Managers', 'Internal Audit Team'],
          users: [] as string[],
        },
      },
    },
    {
      name: 'In Approval',
      onApproved: 'Published',
      approvals: [
        {
          name: 'Audit Review',
          rememberAssignees: true,
          allowedAssigners: {
            groups: ['Internal Audit Managers'],
            users: [] as string[],
          },
          allowedApprovers: {
            groups: ['SLI Internal'],
            users: ['jt-audit-manager'],
          },
          fastReject: 'In Progress', // name of state to reject to
          reviewersCanEdit: false,
        },
      ],
      tasks: [
        {
          name: 'Assign reviewers',
          assignee: '@author@',
          completeOn: Event.reviewersAssigned('Audit Review'),
        },
      ],
      permissions: {
        viewAndEdit: {
          groups: [] as string[],
          users: [] as string[],
        },
        viewOnly: {
          groups: ['Internal Audit Managers', 'Internal Audit Team'],
          users: [] as string[],
        },
      },
    },
    // Published permissions are the same as In Approval permissions
    // so they don't need to be declared.
    {
      name: 'Published',
      final: true,
      hideSelection: true,
    },
  ],
};
