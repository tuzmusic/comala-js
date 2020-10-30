import Tag from '../Tag';
import WorkflowCreator from './classes/WorkflowCreator';
import { TaskObject } from './types';

export const Event: Record<string, (args: any) => Function> = {
  reviewersAssigned(approvalName: string): Function {
    // BIND WHEN CALLED
    return function (this: WorkflowCreator, task: TaskObject) {
      // find the right trigger
      const existingTrigger = this.findTriggerWithParam('pageapprovalassigned', { approval: approvalName });
      // if we don't have one yet, create it
      const trigger = existingTrigger ??
        new Tag('trigger', { _: 'pageapprovalassigned', approval: approvalName });

      // add the complete-task tag to the trigger.
      trigger.addChild(
        new Tag('complete-task', { task: task.name }, true),
      );

      if (!existingTrigger) this.triggers.push(trigger);
    };

  },
};

export const UserVariables = {
  creator: '@creator@',
  approvalAssignees: '@approvalassignees@',
  assignee: '@assignee@',
  assigneesFromReview: (approvalName: string) => `@${ approvalName } > approvalassignees@`,
};
