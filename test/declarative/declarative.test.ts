import { workflow as workflowObj } from '../../src/declarative-api/createdWorkflow';
import WorkflowCreator from '../../src/declarative-api/classes/WorkflowCreator';
import RegexChainer from './RegexChainer';
import * as fs from 'fs';
import path from 'path';
import { WorkflowObject } from '../../src/declarative-api/types';

const { inside } = new RegexChainer();

describe('createWorkflow', () => {
  const { workflow } = new WorkflowCreator(workflowObj as WorkflowObject);
  
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
        it('Sets the permissions upon entering the state (on page creation)', () => {
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
          it('Resets permissions with current approvers when an approver is removed', () => {
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
    
    describe('Rejections', () => {
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
      
      it('Completes the task when appropriate', () => {
        inWorkflow.expect('{trigger:pageapprovalassigned|approval=Audit Review}')
          .toHaveChild('{complete-task:task=Assign reviewers}');
        inWorkflow.expect('{trigger:pageapprovalassigned|approval=Audit Editing}')
          .toHaveChild('{complete-task:task=Assign editors}');
        inWorkflow.expect('{complete-task}').not.toOccur();
      });
    });
  });
});

describe('Full markup', () => {
  const { workflow } = new WorkflowCreator(workflowObj as WorkflowObject);
  
  const filePath = path.join(__dirname, '../../src/declarative-api/markup.txt');
  const file = fs.readFileSync(filePath, 'utf8');
  const markupLines = file.split('\n');
  
  markupLines.forEach(line => {
    console.log(line);
    expect(workflow.markup).toMatch(line.trim());
  });
});

describe('New Features', () => {
  it('Allows approve/reject labels', () => {
    const workflow = new WorkflowCreator({
      name: 'whatever', label: 'whatever',
      states: [{
        name: 'some state',
        approvals: [{ name: 'some approval', approveLabel: 'Yes!', rejectLabel: 'No!' }],
      }],
    }).workflow;
  
    expect(workflow.markup).toMatch(/{approval:some approval\|approvelabel=Yes!\|rejectlabel=No!}/);
  });
  
  it('Allows fast-track approvals', () => {
    const workflow = new WorkflowCreator({
      name: 'whatever', label: 'whatever',
      states: [
        { name: 'first state' },
        {
          name: 'second state',
          approvals: [
            { name: 'first approval' },
            { name: 'second approval', fastApprove: 'first state' },
          ],
        }],
    }).workflow;
    
    inside(workflow.markup)
      .expect({ triggerNamed: 'pageapproved' })
      .toHaveParam({ approval: 'second approval' })
      .andHaveChild({ tagNamed: 'set-state' })
      .withParam('first state');
  });
  
  it('Supports otherParams in states', () => {
    const workflow = new WorkflowCreator(({
      name: 'whatever', label: 'whatever',
      states: [{
        name: 'first state',
        otherParams: { colour: '#4A6785' }
      }]
    })).workflow;
  
    inside(workflow.markup).expect({ colour: '#4A6785' }).toOccur();
  });
  
  it('Supports otherParams in approvals', () => {
    const workflow = new WorkflowCreator(({
      name: 'whatever', label: 'whatever',
      states: [{
        name: 'first state',
        otherParams: { colour: '#4A6785' },
        approvals: [
          { name: 'first approval', otherParams: { user: '&@author' } }
        ]
      }]
    })).workflow;
    
    inside(workflow.markup).expect({ user: '&@author' }).toOccur();
  });
  
  // TODO: It doesn't seem urgent to distinguish these.
  // selectedapprover: must select ONE from these (users/groups)
  // selectedapprovers: must select ONE OR MORE from these (users/groups)
  // user/group: approvers MAY include these
  it.todo('Supports the user param in Approvals (not just selecteduser)');
  
  // TODO: this isn't so urgent given that we can use otherParams
  //  It's annoying because it may require rejiggering the type
  //  of allowedApprovers. Not worth the trouble.
  it.todo('Supports auto-assigned approvers');
  
  it('Supports workflow parameters', () => {
    const workflow = new WorkflowCreator(({
      name: 'whatever', label: 'whatever',
      parameters: {
        name: 'Director of Quality/Quality Designee',
        type: 'user',
        edit: true
      },
      states: [{
        name: 'first state',
        otherParams: { colour: '#4A6785' },
        approvals: [
          { name: 'first approval', otherParams: { user: '&@author' } }
        ]
      }]
    })).workflow;
    
    inside(workflow.markup)
      .expect({ tagNamed: 'workflowparameter' })
      .withParam({ type: 'user' })
      .andParam({ edit: true });
    
    expect(workflow.markup).toMatch('{workflowparameter:Director of Quality/Quality Designee|type=user|edit=true}');
    expect(workflow.markup).toMatch('{workflowparameter}');
  });
});
