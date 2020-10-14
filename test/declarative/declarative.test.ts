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

  const expectLines = (lines: string[]) => lines.forEach(line =>
    inside(workflow.markup).expect(line).toOccur(),
  );

  const shouldMatch = expect(workflow.markup).toMatch;

  it('has the workflow tag', () => {
    inside(workflow.markup)
      .expect({ tagNamed: 'workflow' })
      .toComeBefore({ name: 'Audit Workflow with Assigned Editing' })
      .toComeBefore({ label: 'workflow=internal-audit-record-editassign' });
  });

  describe('States', () => {
    it('has the basic state tags', () => {
      inside(workflow.markup)
        .expect({ stateNamed: 'In Progress' })
        .toComeBefore({ stateNamed: 'In Approval' })
        .toComeBefore({ stateNamed: 'Published' });
    });

    it('Assigns the "approved" parameter', () => {
      inside(workflow.markup)
        .expect({ stateNamed: 'In Progress' })
        .toComeBefore({ approved: 'In Approval' });
      inside(workflow.markup)
        .expect({ stateNamed: 'In Approval' })
        .toComeBefore({ approved: 'Published' });
    });

    it('adds simple parameters to the state tag', () => {
      inside(workflow.markup)
        .expect({ stateNamed: 'Published' })
        .toComeBefore({ final: 'true' })
        .toComeBefore({ hideSelection: 'true' });
    });
  });

  describe('Approvals', () => {
    it('Designates who is allowed to assign approvers', () => {
      shouldMatch(/{approval:Audit Editing.+\n.+|allowedassigngroups=Internal Audit Managers/);
      shouldMatch(/{approval:Audit Review.+\n.+|allowedassigngroups=Internal Audit Managers/);
    });

    it('Designates who is allowed to be assigned to approvals', () => {
      shouldMatch(/{approval:Audit Editing.+\n.+|selectedapprovers=Internal Audit Managers,Internal Audit Team/);
      shouldMatch(/{approval:Audit Review.+\n.+|selectedapprovers=SLI Internal/);
    });

    it('Creates the approval tags', () => {
      shouldMatch(/{state:In Progress.+\n.+{approval:Audit Editing/);
      shouldMatch(/{state:In Approval.+\n.+{approval:Audit Review/);
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
