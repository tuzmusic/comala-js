const workflow = {
  name: 'Audit Workflow with Assigned Editing ',
  label: 'workflow=interna-audit-record-editassign',
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
          tasks: [
            {
              name: 'Assign editors',
              assignee: '@author@',
              completeOn: Event.reviewersAssigned('Audit Editing'),
            },
          ],
        },
      ],
      permissions: {
        view: {
          groups: ['Internal Audit Managers', 'Internal Audit Team'],
          users: [] as string[],
        },
        edit: {
          groups: ['Internal Audit Managers', 'Internal Audit Team'],
          users: [] as string[],
        },
        /*reviewers: {
          canView: true,
          canEdit: false,
        },*/
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
            users: [] as string[],
          },
          tasks: [
            {
              name: 'Assign reviewers',
              assignee: '@author@',
              completeOn: Event.reviewersAssigned('Audit Review'),
            },
          ],
        },
      ],
      fastReject: true,
      permissions: {
        edit: {
          groups: [] as string[],
          users: [] as string[],
        }, view: {
          groups: ['Internal Audit Managers', 'Internal Audit Team'],
          users: [] as string[],
        },
        reviewers: {
          canView: true,
          canEdit: false,
        },
      },
    },
    { name: 'Published', final: true },
  ],
};
