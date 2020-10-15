import { workflow as workflowObj } from '../../src/declarative-api/createdWorkflow';
import WorkflowCreator, { WorkflowObject } from '../../src/declarative-api/classes/WorkflowCreator';
import RegexChainer from './RegexChainer';
import * as fs from 'fs';
import path from 'path';

const { inside } = new RegexChainer();
const { workflow } = new WorkflowCreator(workflowObj as WorkflowObject);

describe('createWorkflow', () => {
  
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
  
  it('Doesn\'t have any empty parameters', () => {
    expect(workflow.markup).not.toMatch(/=[|}]/);
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
            .andParam({ group: 'Internal Audit Managers,Internal Audit Team' });
  
          inWorkflow.expect({ triggerNamed: 'statechanged' })
            .toHaveParam({ state: states.InProgress.stateNamed })
            .toHaveChild({ tagNamed: 'set-restrictions' })
            .withParam({ type: 'edit' })
            .andParam({ group: 'Internal Audit Managers,Internal Audit Team' });
        });
        /*
        * 
        {trigger:pagerejected|approval=Audit Review|partial=true}
          {set-state:In Progress}
          {set-restrictions:type=view|group=Internal Audit Managers,Internal Audit Team}
          {set-restrictions:type=edit|group=Internal Audit Managers,Internal Audit Team}
        {trigger}
    * */
        xit('Sets the permissions when we re-enter the state from a rejection.', () => {
          // NOTE: We do need to do this because the 'statechanged' trigger
          // is not activated by the fast-reject trigger (because statechanged
          // doesn't fire in response to triggers).
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
        
        it('Sets the edit permissions (no one!) upon entering the state', () => {
          inWorkflow.expect({ triggerNamed: 'statechanged' })
            .toHaveParam({ state: states.InApproval.stateNamed })
            .toHaveChild({ tagNamed: 'set-restrictions' })
            .withParam({ type: 'edit' })
            .andParam({ group: 'empty-group' });
        });
        
        describe('Reviewer permissions', () => {
          it('Gives a reviewer view permissions when they are added', () => {
            inWorkflow.expect({ triggerNamed: 'pageapprovalassigned' })
              .toHaveParam({ approval: approvals.Review.approvalNamed })
              .toHaveChild({ tagNamed: 'set-restrictions' })
              .withParam({ type: 'edit' })
              .andParam({ group: 'empty-group' });
            inWorkflow.expect({ triggerNamed: 'pageapprovalassigned' })
              .toHaveParam({ approval: approvals.Review.approvalNamed })
              .toHaveChild({ tagNamed: 'set-restrictions' })
              .withParam({ type: 'view' })
              .andParam({ group: 'Internal Audit Managers,Internal Audit Team' })
              .andParam({ user: '@approvalassignees@' });
          });
          it('Revokes a reviewer\'s view permissions when they are removed', () => {
            inWorkflow.expect({ triggerNamed: 'approvalunassigned' })
              .toHaveParam({ approval: approvals.Review.approvalNamed })
              .toHaveChild({ tagNamed: 'set-restrictions' })
              .withParam({ type: 'edit' })
              .andParam({ group: 'empty-group' });
            inWorkflow.expect({ triggerNamed: 'approvalunassigned' })
              .toHaveParam({ approval: approvals.Review.approvalNamed })
              .toHaveChild({ tagNamed: 'set-restrictions' })
              .withParam({ type: 'view' })
              .andParam({ group: 'Internal Audit Managers,Internal Audit Team' })
              .andParam({ user: '@approvalassignees@' });
          });
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
  
    test('Approvals are self-closing', () => {
      inWorkflow.expect('{approval}').not.toOccur();
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
    
    it('Defines fast-track rejections', () => {
      inWorkflow.expect({ triggerNamed: 'pagerejected' })
        .toHaveParam({ approval: approvals.Review.approvalNamed })
        .andParam({ partial: 'true' })
        .toInclude('{set-state:In Progress}');
    });
    
    it('Restores permissions on fast-tracked rejections', () => {
      inWorkflow.expect({ triggerNamed: 'pagerejected' })
        .toHaveParam({ approval: approvals.Review.approvalNamed })
        .toHaveChild({ tagNamed: 'set-restrictions' })
        .withParam({ type: 'edit' })
        .andParam({ group: 'Internal Audit Managers,Internal Audit Team' });
      inWorkflow.expect({ triggerNamed: 'pagerejected' })
        .toHaveParam({ approval: approvals.Review.approvalNamed })
        .toHaveChild({ tagNamed: 'set-restrictions' })
        .withParam({ type: 'view' })
        .andParam({ group: 'Internal Audit Managers,Internal Audit Team' });
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

describe('Full markup', () => {
  const workflowLines = workflow.markup.split('\n');
  const filePath = path.join(__dirname, '../../src/declarative-api/markup.txt');
  const file = fs.readFileSync(filePath, 'utf8');
  const markupLines = file.split('\n');
  
  markupLines.forEach(line => {
    console.log(line);
    expect(workflow.markup).toMatch(line.trim());
  });
});