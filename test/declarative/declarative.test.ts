import { workflow as workflowObj } from '../../src/declarative-api/createdWorkflow';
import WorkflowCreator from '../../src/declarative-api/classes/WorkflowCreator';
import RegexChainer from './RegexChainer';

const { inside } = new RegexChainer();

describe('createWorkflow', () => {
  const { workflow } = new WorkflowCreator(workflowObj);

  const states = {
    InProgress: { stateNamed: 'In Progress' },
    InApproval: { stateNamed: 'In Approval' },
    Published: { stateNamed: 'Published' },
  };
  const approvals = {
    Editing: { approvalNamed: 'Audit Editing' },
    Review: { approvalNamed: 'Audit Review' },
  };

  const inWorkflow = inside(workflow.markup);

  it('has the workflow tag', () => {
    inWorkflow
      .expect({ tagNamed: 'workflow' })
      .toHaveParam({ name: 'Audit Workflow with Assigned Editing' })
      .toHaveParam({ label: 'workflow=internal-audit-record-editassign' });
  });

  describe('States', () => {
    it('has the basic state tags', () => {
      inWorkflow.expect(states.InProgress)
        .toComeBefore(states.InApproval)
        .toComeBefore(states.Published);
    });

    it('Assigns the "approved" parameter', () => {
      inWorkflow.expect(states.InProgress)
        .toComeBefore({ approved: 'In Approval' })
        .and(states.InApproval)
        .toComeBefore({ approved: 'Published' });
    });

    it('adds simple parameters to the state tag', () => {
      inWorkflow.expect(states.Published)
        .toHaveParam({ final: 'true' })
        .toHaveParam({ hideSelection: 'true' });
    });

    describe('Permissions', () => {
      test('Permissions tags are self-closing', () => {
        inWorkflow.expect('{set-restrictions}').not.toOccur();
      });
      describe('In Progress state', () => {
        it('Sets the permissions upon entering the state', () => {
          inWorkflow.expect({ triggerNamed: 'statechanged' })
            .toHaveParam({ state: states.InProgress.stateNamed })
            .toHaveChild({ tagNamed: 'set-restrictions' })
            .withParam({ type: 'view' })
            .andParam({ group: 'Internal Audit Managers,Internal Audit Team' })
            .not.toInclude('|user=');

          inWorkflow.expect({ triggerNamed: 'statechanged' })
            .toHaveParam({ state: states.InProgress.stateNamed })
            .toHaveChild({ tagNamed: 'set-restrictions' })
            .withParam({ type: 'edit' })
            .andParam({ group: 'Internal Audit Managers,Internal Audit Team' });
        });
      });

      describe('In Approval state', () => {
        it('Sets the view permissions upon entering the state', () => {
          inWorkflow.expect({ triggerNamed: 'statechanged' })
            .toHaveParam({ state: states.InApproval.stateNamed })
            .toHaveChild({ tagNamed: 'set-restrictions' })
            .withParam({ type: 'view' })
            .andParam({ group: 'Internal Audit Managers,Internal Audit Team' });
        });

        it('Sets the edit permissions upon entering the state', () => {
          inWorkflow.expect({ triggerNamed: 'statechanged' })
            .toHaveParam({ state: states.InApproval.stateNamed })
            .toHaveChild({ tagNamed: 'set-restrictions' })
            .withParam({ type: 'edit' })
            .andParam({ group: 'empty-group' });
        });
      });
    });
  });

  describe('Approvals', () => {
    it('Creates the approval tags', () => {
      inWorkflow.expect(states.InProgress)
        .toHaveChild(approvals.Editing)
        .and(states.InApproval)
        .toHaveChild(approvals.Review);
    });

    it('adds simple parameters to the approval tag', () => {
      inWorkflow.expect(approvals.Editing).toHaveParam({ rememberAssignees: true })
        .and(approvals.Review).toHaveParam({ rememberAssignees: true });
    });

    it('Designates who is allowed to assign approvers', () => {
      inWorkflow.expect(approvals.Editing)
        .toHaveParam({ allowedassigngroups: 'Internal Audit Managers' })
        .and(approvals.Review)
        .toHaveParam({ allowedassigngroups: 'Internal Audit Managers' });
    });

    it('Leaves out empty array parameters', () => {
      inWorkflow.expect(approvals.Editing).not.toInclude('allowedassignusers');
    });

    it('Designates who is allowed to be assigned to approvals', () => {
      inWorkflow.expect(approvals.Editing)
        .toHaveParam({ selectedapprovers: 'Internal Audit Managers,Internal Audit Team' })
        .and(states.InApproval)
        .toHaveParam({ selectedapprovers: 'SLI Internal,jt-audit-manager' });
    });

    describe('Tasks on approvals', () => {
      it('Adds the task in the approval', () => {
        inWorkflow.expect(approvals.Editing)
          .toHaveChild({ tagNamed: 'task' })
          .withParam({ name: 'Assign editors' })
          .andParam({ assignee: '@author@' })
          .andExpect(approvals.Review)
          .toHaveChild({ tagNamed: 'task' })
          .withParam({ name: 'Assign reviewers' })
          .andParam({ assignee: '@author@' });
      });

      test('Tasks are self-closing', () => {
        inWorkflow.expect('{task}').not.toOccur();
      });

      xit('Completes the task when appropriate', () => {
        // todo
      });
    });
  });
});
