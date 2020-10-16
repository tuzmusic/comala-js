import Tag from '../../Tag';
import { ApprovalObject, PermissionsGroup, permissionsTypes, StateObject, userTypes, WorkflowObject } from '../types';

//endregion

function addParamsFromObjectToTag(camelCaseParams: string[], object: any, tag: Tag) {
  camelCaseParams.forEach(param => {
    const val = object[param];
    if (val)
      tag.addParameter({ [param.toLowerCase()]: val });
  });
}

export default class WorkflowCreator {
  workflow: Tag;
  states: Tag[] = [];
  /* Trigger tags, which are added after state tags.
  *
  * Note that there is no "triggers" property in the WorkflowObject argument to the constructor. Rather,
  * triggers are created based on settings of states, approvals, tasks, etc. Indeed, this is a large
  * reason for creating the API: to abstract the imperative triggers, using object declaration to indicate,
  * in context, what should happen when. */
  triggers: Tag[] = [];
  
  constructor(obj: WorkflowObject) {
    this.workflow = new Tag('workflow', { name: obj.name, label: obj.label });
    const { workflow } = this;
    
    this.states = obj.states.map(this.processState); // populates this.state
    this.states.forEach(workflow.addChild);
    this.triggers.forEach(workflow.addChild);
    
    console.log(workflow.markup);
  };
  
  // must be public so it can be used from the Event functions.
  public findTriggerWithParam = (triggerType: string, paramKey: string, paramValue: string): Tag =>
    this.triggers.find(tag => tag.parameters['_'] === triggerType
      && tag.parameters[paramKey] === paramValue,
    );
  
  findOrCreateTriggerWithParam = (triggerType: string, paramKey: string, paramValue: string): Tag => {
    const existing = this.findTriggerWithParam(triggerType, paramKey, paramValue);
    if (existing) return existing;
    const newTrigger = new Tag('trigger', { _: triggerType, [paramKey]: paramValue });
    this.triggers.push(newTrigger);
    return newTrigger;
  };
  
  private processState = (stateObj: StateObject): Tag => {
    // create the basic state tag
    const stateTag = new Tag('state', { _: stateObj.name });
    
    // some simple parameters
    addParamsFromObjectToTag([
        'final',
        'hideSelection',
        ...Object.keys(stateObj.otherParams ?? {})],
      { ...stateObj, ...stateObj.otherParams ?? {} },
      stateTag);
    
    // add the parameters for (simple) transitions
    const transitions = { 'onApproved': 'approved' };
    Object.entries(transitions).forEach(([key, value]) => {
      const nextState = stateObj[key as keyof StateObject];
      if (nextState)
        stateTag.addParameter({ [value]: nextState as string });
    });
    
    // create the approvals
    stateObj.approvals?.map((approvalObj: ApprovalObject) =>
      this.processApproval(approvalObj, stateObj),
    ).forEach(stateTag.addChild);
    
    // set the state permissions
    this.manageStatePermissions(stateObj);
    
    // handle tasks
    stateObj.tasks?.forEach(task => {
      const { name, assignee, completeOn } = task;
      const taskTag = new Tag('task', { name, assignee }, true);
  
      // completeOn is a function that finds or creates a trigger, adds
      // a complete-task tag to it, and adds the trigger to the WorkflowCreator.
      // It would be nice if it read a bit more semantically here, but it's more
      // desirable to have it read semantically when constructing the WorkflowObject.
      completeOn?.call(this, task);
  
      stateTag.addChild(taskTag);
    }); // for (task of tasks)
    
    return stateTag;
  };
  
  private manageStatePermissions = (stateObj: StateObject) => {
    const { name: stateName, permissions } = stateObj;
    if (!permissions) return;
    
    // prepare the trigger tag
    const triggerTag = new Tag('trigger', { _: 'statechanged', state: stateName });
    // add the set-restrictions tags
    this.addPermissionsToTrigger(permissions, triggerTag);
    // add to workflow
    this.triggers.push(triggerTag);
  };
  
  private addPermissionsToTrigger = (permissions: PermissionsGroup, triggerTag: Tag) => {
    permissionsTypes.forEach(type => {
      if (permissions[type]) {
        const tag = new Tag('set-restrictions', { type }, true);
  
        // add empty-group, or add groups/users
        if (userTypes.every(key => !permissions[type][key].length)) {
          tag.addParameter({ group: 'empty-group' });
        } else {
          userTypes
            .filter(key => permissions[type][key].length)
            .forEach(key =>
              tag.addParameter({ [key.slice(0, -1)]: permissions[type][key].join() }));
        }
        triggerTag.addChild(tag);
      }
    });
  };
  
  private manageReviewerPermissions = (approvalObj: ApprovalObject, stateObj: StateObject) => {
    const { name: approvalName, reviewersCan } = approvalObj;
    if (!reviewersCan) return;
    
    // make a copy of the state's permissions
    const statePermissions = { ...stateObj.permissions };
    
    // add reviewers to the state's permissions
    permissionsTypes.forEach(key => {
      if (reviewersCan[key]) {
        statePermissions[key].users.push('@approvalassignees@');
      }
    });
    
    ['pageapprovalassigned', 'approvalunassigned']
      .forEach(name => {
          const trigger = new Tag('trigger', { _: name, approval: approvalName });
          this.addPermissionsToTrigger(statePermissions, trigger);
          this.triggers.push(trigger);
        },
      );
  };
  
  private processApproval = (approvalObj: ApprovalObject, stateObj: StateObject): Tag => {
    // create the basic approval tag
    const approvalTag = new Tag('approval', { _: approvalObj.name }, true);
  
    // some simple parameters
    addParamsFromObjectToTag([
        'rememberAssignees',
        'approveLabel',
        'rejectLabel',
        ...Object.keys(approvalObj.otherParams ?? {})],
      { ...approvalObj, ...approvalObj.otherParams },
      approvalTag);
  
    const { allowedAssigners, allowedApprovers, fastReject, fastApprove } = approvalObj;
  
    // set who can assign
    if (allowedAssigners) {
      if (allowedAssigners.groups?.length)
        approvalTag.addParameter({ allowedassigngroups: allowedAssigners.groups.join(',') });
      if (allowedAssigners.users?.length)
        approvalTag.addParameter({ allowedassignusers: allowedAssigners.users.join(',') });
    }
    
    // set who can be assigned
    if (allowedApprovers) {
      const approvers: string[] = allowedApprovers.groups.concat(allowedApprovers.users);
      if (approvers.length)
        approvalTag.addParameter({ selectedapprovers: approvers.join(',') });
    }
    
    // handle fast-track rejection
    if (fastReject) {
      const trigger = new Tag('trigger', {
        _: 'pagerejected',
        approval: approvalObj.name,
        partial: 'true',
      });
      trigger.addChild(new Tag('set-state', { _: fastReject }, true));
  
      // find the set-state trigger for the state the fastReject moves to
      const statePermissionTrigger = this.findTriggerWithParam('statechanged', 'state', fastReject);
  
      // that trigger sets the permissions. grab the set-restrictions tags.
      const permissions = statePermissionTrigger.children.filter(
        tag => tag.tagName === 'set-restrictions',
      );
  
      // copy those tags to our current trigger.
      permissions.forEach(trigger.addChild);
      this.triggers.push(trigger);
    }
    
    if (fastApprove) {
      const trigger = this.findOrCreateTriggerWithParam('pageapproved', 'approval', approvalObj.name);
      trigger.addChild(
        new Tag('set-state', { _: fastApprove }, true),
      );
      // TODO: setting the state this way (PROBABLY???) won't trigger
      //  statechanged so we need to do that too.
      //  Right?
    }
    
    this.manageReviewerPermissions(approvalObj, stateObj);
    return approvalTag;
  };
}

