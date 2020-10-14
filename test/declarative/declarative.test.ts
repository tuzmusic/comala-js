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

  const expectLines = (lines: string[]) => lines.forEach(line =>
    inside(workflow.markup).expect(line).toOccur(),
  );

  const shouldMatch = expect(workflow.markup).toMatch;
  const inWorkflow = inside(workflow.markup).expect;

  it('has the workflow tag', () => {
    inside(workflow.markup)
      .expect({ tagNamed: 'workflow' })
      .toHaveParam({ name: 'Audit Workflow with Assigned Editing' })
      .toHaveParam({ label: 'workflow=internal-audit-record-editassign' });
  });

  describe('States', () => {
    it('has the basic state tags', () => {
      inside(workflow.markup)
        .expect(states.InProgress)
        .toComeBefore(states.InApproval)
        .toComeBefore(states.Published);
    });

    it('Assigns the "approved" parameter', () => {
      inside(workflow.markup)
        .expect(states.InProgress)
        .toComeBefore({ approved: 'In Approval' })
        .and.expect(states.InApproval)
        .toComeBefore({ approved: 'Published' });
    });

    it('adds simple parameters to the state tag', () => {
      inside(workflow.markup)
        .expect(states.Published)
        .toHaveParam({ final: 'true' })
        .toHaveParam({ hideSelection: 'true' });
    });
  });

  describe('Approvals', () => {
    it('Designates who is allowed to assign approvers', () => {
      inside(workflow.markup).expect(approvals.Editing)
        .toHaveParam({ allowedassigngroups: 'Internal Audit Managers' });
      inside(workflow.markup).expect(approvals.Review)
        .toHaveParam({ allowedassigngroups: 'Internal Audit Managers' });
    });

    it('Designates who is allowed to be assigned to approvals', () => {
      inside(workflow.markup)
        .expect(approvals.Editing)
        .toHaveParam({ selectedapprovers: 'Internal Audit Managers,Internal Audit Team' });
      inside(workflow.markup)
        .expect(states.InApproval)
        .toHaveParam({ selectedapprovers: 'SLI Internal' });
    });

    it('Creates the approval tags', () => {
      inside(workflow.markup)
        .expect(states.InProgress)
        .toHaveChild(approvals.Editing)
        .and.expect(states.InApproval)
        .toHaveChild(approvals.Review);
    });

    it('adds simple parameters to the approval tag', () => {
      expect(approvalLines.editing).toContain('|rememberassignees=true');
      expect(approvalLines.review).toContain('|rememberassignees=true');
    });

    describe('Tasks on approvals', () => {
      it('Adds the task in the approval', () => {
        shouldMatch(/{state:approval:Audit Editing.+\n.+{task:name=Assign editors|assignee=@author@/);
        shouldMatch(/{state:approval:Audit Review.+\n.+{task:name=Assign reviewers|assignee=@author@/);
      });
    });
  });
});
