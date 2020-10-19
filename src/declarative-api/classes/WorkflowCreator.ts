import Tag from '../../Tag';
import {
  ApprovalObject,
  PermissionsGroup,
  permissionsKeys,
  StateObject,
  UsersObject,
  UserType,
  userTypes,
  WorkflowObject,
} from '../types';
import clipboardy from 'clipboardy';

//endregion

function addParamsFromObjectToTag(camelCaseParams: string[], object: any, tag: Tag) {
  camelCaseParams.forEach(param => {
    const val: string = object[param];
    if (val) {
      // manage specific issues
      if (typeof val === 'string' && val.startsWith('&') && param.toLowerCase().startsWith('selected'))
        throw new Error(`You can't require approvers (using "&") with "${ param }". \n\tTry: "user=${ val }"\n`);

      // add the tag
      tag.addParameter({ [param.toLowerCase()]: val });
    }
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

  constructor({ label, name, parameters, states }: WorkflowObject) {
    this.workflow = new Tag('workflow', { name: name, label: label });
    const { workflow } = this;

    // simple-convert workflow parameters
    parameters?.forEach(({ name, ...workflowParameters }) =>
      workflow.addChild(new Tag('workflowparameter', { _: name, ...workflowParameters })));

    this.states = states.map(this.processState); // populates this.state
    this.states.forEach(workflow.addChild);
    this.triggers.forEach(workflow.addChild);

    console.log(workflow.markup);
  };

  getMarkup = () => {
    clipboardy.writeSync(this.workflow.markup);
    console.log(this.workflow.markup);
    console.warn('The above markup has been copied to the clipboard.');
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

    // set the state permissions
    this.manageStatePermissions(stateObj);

    // create the approvals
    stateObj.approvals?.map((approvalObj: ApprovalObject) =>
      this.processApproval(approvalObj, stateObj),
    ).forEach(stateTag.addChild);

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
    Object.entries(permissionsKeys).forEach(([permType, permKey]) => {
      const thesePermissions: UsersObject = permissions[permKey]; // e.g., thesePermissions = permissions.viewOnly

      // If there's nothing defined for these permissions, forget it.
      // Because edit permissions encompass view permissions (i.e., there's no such thing as
      // "edit only"), we can do view OR edit permissions.
      // If we have some users who can only view and some who can also edit, we can use both keys.
      if (!thesePermissions) return;

      // todo: not setting edit permissions should assign "empty-group" for edit!
      //  probably also true for view!!!

      const setRestrictionsTag = new Tag('set-restrictions', { type: permType }, true);

      const usersAndGroups = Object.values(thesePermissions).flat();

      // if there are no users OR groups with these permissions, assign "empty group"
      if (!usersAndGroups.length) {
        setRestrictionsTag.addParameter({ group: 'empty-group' });
      } else {
        // if there ARE users/groups with this permission
        const userTypesWithPermission = userTypes.filter((userType: UserType) =>
          permissions?.[permKey]?.[userType]?.length);

        // give add the parameter to the tag
        userTypesWithPermission.forEach((userType: UserType) =>
          setRestrictionsTag.addParameter({ [userType.slice(0, -1)]: permissions[permKey][userType].join() }));
      }

      // add the set-restrictions tag, unless for some reason it's already there.
      if (!triggerTag.children.some(tag => JSON.stringify(tag) === JSON.stringify(setRestrictionsTag)))
        triggerTag.addChild(setRestrictionsTag);

      /*    if (Object.values(userTypes))
            if (userTypes.every((userType: UserType) => !thesePermissions[userType]?.length)) {
              tag.addParameter({ group: 'empty-group' });
            } else {
              userTypes
                .filter((userType: UserType) => permissions?.[permType]?.[userType]?.length)
                .forEach((userType: UserType) =>
                  tag.addParameter({ [userType.slice(0, -1)]: permissions[permType][userType].join() }));
            }
          triggerTag.addChild(tag);*/
    });
  };

  private addEditPermissionsForReviewers = (approvalObj: ApprovalObject, stateObj: StateObject) => {
    const { name: approvalName } = approvalObj;

    // make a copy of the state's permissions and add the assignees
    // "editors" is not seen again in the code because this line already mutates
    // the statePermissions.viewAndEdit.users array (which is stored, as a reference, in "editors".
    const statePermissions = { ...stateObj.permissions };
    const editors = statePermissions.viewAndEdit.users;
    const assignees = '@approvalassignees@';
    if (!editors.includes(assignees)) editors.push(assignees);

    ['pageapprovalassigned', 'approvalunassigned'].forEach(name => {
        const trigger = this.findOrCreateTriggerWithParam(name, 'approval', approvalName);
        this.addPermissionsToTrigger(statePermissions, trigger);
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

    // set who can assign (actual param is allowedassignusers and allowedassigngroups)
    userTypes.forEach(key => {
      if (allowedAssigners?.[key]?.length)
        approvalTag.addParameter({ [`allowedassign${ key }`]: allowedAssigners[key].join() });
    });
    /*if (allowedAssigners) {
      if (allowedAssigners.groups?.length)
        approvalTag.addParameter({ allowedassigngroups: allowedAssigners.groups.join() });

      if (allowedAssigners.users?.length)
        approvalTag.addParameter({ allowedassignusers: allowedAssigners.users.join() });
    }*/

    // set who can be assigned (actual param is selectedapprovers, for "must assign one or more")
    const approvers: string[] = (allowedApprovers?.groups ?? []).concat(allowedApprovers?.users ?? []);
    if (approvers.length)
      approvalTag.addParameter({ selectedapprovers: approvers.join() });

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
      trigger.addParameter({ partial: 'true' });
      trigger.addChild(
        new Tag('set-state', { _: fastApprove }, true),
      );
      // TODO: setting the state this way (PROBABLY???) won't trigger
      //  statechanged so we need to do that too.
      //  Right?
    }

    if (approvalObj.reviewersCanEdit)
      this.addEditPermissionsForReviewers(approvalObj, stateObj);

    return approvalTag;
  };
}

