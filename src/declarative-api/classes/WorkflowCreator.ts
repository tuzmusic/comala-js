import Tag from '../../Tag';

type WorkflowObject = any
type StateObject = any
type ApprovalObject = any

function addParamsFromObjectToTag(camelCaseParams: string[], object: any, tag: Tag) {
  camelCaseParams.forEach(param => {
    const val = object[param];
    if (val)
      tag.addParameter({ [param.toLowerCase()]: val });
  });

}

export default class WorkflowCreator {
  workflow: Tag;
  // states: Record<string, Tag> = {};
  // approvals: Record<string, Tag> = {};
  states: Tag[];

  constructor(obj: WorkflowObject) {
    this.workflow = new Tag('workflow', { name: obj.name, label: obj.label });
    const { workflow } = this;

    this.states = obj.states.map(this.processState); // populates this.state
    this.states.forEach(workflow.addChild);

    console.log(workflow.markup);
  };

  private processState = (stateObj: StateObject): Tag => {
    // create the basic state tag
    const stateTag = new Tag('state', { _: stateObj.name });

    // some simple parameters
    addParamsFromObjectToTag(['final', 'hideSelection'], stateObj, stateTag);

    // add the parameters for (simple) transitions
    const transitions = { 'onApproved': 'approved' };
    Object.entries(transitions).forEach(([key, value]) => {
      const nextState = stateObj[key];
      if (nextState)
        stateTag.addParameter({ [value]: nextState });
    });

    stateObj.approvals?.map(this.processApproval)
      .forEach(stateTag.addChild);

    return stateTag;
  };

  private processApproval = (approvalObj: ApprovalObject): Tag => {
    // create the basic approval tag
    const approvalTag = new Tag('approval', { _: approvalObj.name });

    // some simple parameters
    addParamsFromObjectToTag(['rememberAssignees'], approvalObj, approvalTag);

    const { allowedAssigners, allowedApprovers } = approvalObj;

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

    // handle tasks
    for (const { name, assignee, completeOn } of approvalObj.tasks) {
      const taskTag = new Tag('task', { name, assignee });

      approvalTag.addChild(taskTag);
    } // for (task of tasks)

    // stateTag.addChild(approvalTag);
    return approvalTag;
  };
}

