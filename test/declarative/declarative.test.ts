import { workflow as workflowObj } from '../../src/declarative-api/createdWorkflow';
import WorkflowCreator from '../../src/declarative-api/classes/WorkflowCreator';
import RegexChainer from './RegexChainer';

const { inside } = new RegexChainer();

describe('createWorkflow', () => {
  const workflow = WorkflowCreator.create(workflowObj);
  const stateLines: Record<string, string> = {};
  const approvalLines: Record<string, string> = {};

  ['In Progress', 'In Approval', 'Published'].forEach(name => {
    stateLines[name.split(' ').pop().toLowerCase()]
      = workflow.markup.split('\n').find(l => l.includes(`{state:${ name }`));
  });

  ['Audit Review', 'Audit Editing'].forEach(name => {
    approvalLines[name.split(' ').pop().toLowerCase()]
      = workflow.markup.split('\n').find(l => l.includes(`{approval:${ name }`));
  });

  const states = {
    InProgress: { stateNamed: 'In Progress' },
    InApproval: { stateNamed: 'In Approval' },
    Published: { stateNamed: 'Published' },
  };
  const approvals = {
    Editing: { approvalNamed: 'Audit Editing' },
    Review: { approvalNamed: 'Audit Review' },
  };

  const shouldMatch = expect(workflow.markup).toMatch;
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
  });

  describe('Approvals', () => {
    it('Designates who is allowed to assign approvers', () => {
      inWorkflow.expect(approvals.Editing)
        .toHaveParam({ allowedassigngroups: 'Internal Audit Managers' });
      inWorkflow.expect(approvals.Review)
        .toHaveParam({ allowedassigngroups: 'Internal Audit Managers' });
    });

    it('Designates who is allowed to be assigned to approvals', () => {
      inWorkflow.expect(approvals.Editing)
        .toHaveParam({ selectedapprovers: 'Internal Audit Managers,Internal Audit Team' });
      inWorkflow.expect(states.InApproval)
        .toHaveParam({ selectedapprovers: 'SLI Internal' });
    });

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

    describe('Tasks on approvals', () => {
      it('Adds the task in the approval', () => {

        shouldMatch(/{state:approval:Audit Editing.+\n.+{task:name=Assign editors|assignee=@author@/);
        shouldMatch(/{state:approval:Audit Review.+\n.+{task:name=Assign reviewers|assignee=@author@/);
      });
    });
  });
});
