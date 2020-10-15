import Tag from '../../Tag';

//region Types
const permissionsTypes = ['view', 'edit'];
const userTypes = ['groups', 'users'];
type UserType = typeof userTypes[number]
type PermissionsType = typeof permissionsTypes[number]
type PermissionsObject = Record<UserType, string[]>

export type TaskObject = {
  name: string;
  assignee: string;
  // the values of Event return functions, yes.
  // but when constructing a workflow, the function (that is a
  // value of Event) is CALLED, so completeOn is simply a function.
  completeOn: Function;
};

type ApprovalObject = {
  /* Name of the approval. */
  name: string;
  /* Should prior assignees be reassinged next time we enter this state?
  *
  * NB: I think I still haven't confirmed that assignees are not remembered
  * between the same review on different pages, which the docs might imply. */
  rememberAssignees?: true;
  /* Groups/Users who are allowed to assign approvers for this review. */
  allowedAssigners: PermissionsObject;
  /* Groups/Users who are available to be assigned as approvers for this review. */
  allowedApprovers: PermissionsObject;
  // todo: this api might as well use onRejected, in combination with a fastReject boolean

  /* If a single rejection should reject this review, this value is the name of the
  * state to transition to on rejection. Its truthiness serves to "activate" fastReject. */
  fastReject?: string;
  /* Permissions for reviewers.
  * Note that these permissions aren't "connected" to the approval or reviewers by Comala,
  * but rather our markup explicitly sets permissions when approvers are assigned and unassigned,
  * and when the review starts and ends. */
  reviewersCan?: Record<PermissionsType, boolean>;
}

type PermissionsGroup = Record<PermissionsType, PermissionsObject>;

type StateObject = {
  /* Name of the state */
  name: string;
  /* Approvals included in this state.
  *
  *  Note that approvals don't do anything without 'onApproved' or 'onRejected'. */
  approvals?: ApprovalObject[];
  /* Tasks that are assigned when the state is entered. */
  tasks?: TaskObject[];
  /* Edit and view permissions for this state.
  *
  * Note that these permissions aren't "connected" to the state by Comala,
  * but rather our markup explicitly sets permissions on relevant actions. */
  permissions?: PermissionsGroup;
  /* The state to transition to when all approvals pass. */
  onApproved?: string;
  /* Whether the state is the final state in the workflow. */
  final?: true;
  /* If `true`, users cannot select another state from this state. */
  hideSelection?: true;
}

export type WorkflowObject = {
  /* Name for the worklfow. */
  name: string;
  /* Pages (in this space) with this label will be controlled by the workflow. */
  label: string;
  states: StateObject[];
}

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
  public findTriggerWithParam = (triggerType: string, paramKey: string, paramValue: string) =>
    this.triggers.find(tag => tag.parameters['_'] === triggerType
      && tag.parameters[paramKey] === paramValue,
    );

  private processState = (stateObj: StateObject): Tag => {
    // create the basic state tag
    const stateTag = new Tag('state', { _: stateObj.name });

    // some simple parameters
    addParamsFromObjectToTag(['final', 'hideSelection'], stateObj, stateTag);

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
    addParamsFromObjectToTag(['rememberAssignees'], approvalObj, approvalTag);

    const { allowedAssigners, allowedApprovers, fastReject } = approvalObj;

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

    this.manageReviewerPermissions(approvalObj, stateObj);
    return approvalTag;
  };
}

