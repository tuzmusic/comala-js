import { workflow as workflowObj } from '../src/declarative-api/createdWorkflow';
import WorkflowCreator from '../src/declarative-api/classes/WorkflowCreator';

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

  const expectLines = (lines: string[]) => lines.forEach(expect(workflow.markup).toContain);

  const shouldMatch = expect(workflow.markup).toMatch;

  it('has the workflow tag', () => {
    expectLines(['{workflow:name=Audit Workflow with Assigned Editing|label=workflow=internal-audit-record-editassign}',
      '{workflow}']);
  });
  describe('States', () => {
    it('has the basic state tags', () => {
      expectLines(['{state:In Approval', '{state:In Progress', '{state:Published']);
    });

    it('Assigns the "approved" parameter', () => {
      expect(stateLines.progress).toContain('|approved=In Approval');
      expect(stateLines.approval).toContain('|approved=Published');
    });

    it('adds simple parameters to the state tag', () => {
      expect(stateLines.published).toContain('|final=true');
      expect(stateLines.published).toContain('|hideselection=true');
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
