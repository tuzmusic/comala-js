import Tag from '../../Tag';

type WorkflowObject = any

function addParamsFromObjectToTag(camelCaseParams: string[], object: any, tag: Tag) {
  camelCaseParams.forEach(param => {
    const val = object[param];
    if (val)
      tag.addParameter({ [param.toLowerCase()]: val });
  });

}

export default class WorkflowCreator {
  static create = (obj: WorkflowObject) => {
    const workflow = new Tag('workflow', { name: obj.name, label: obj.label });

    const states: Record<string, Tag> = {};

    for (const stateObj of obj.states) {
      // create the basic state tag
      const stateTag = new Tag('state', { _: stateObj.name });
      states[stateObj.name] = stateTag;

      // some simple parameters
      addParamsFromObjectToTag(['final', 'hideSelection'], stateObj, stateTag);

      // add the parameters for (simple) transitions
      const transitions = { 'onApproved': 'approved' };
      Object.entries(transitions).forEach(([key, value]) => {
        const nextState = stateObj[key];
        if (nextState)
          stateTag.addParameter({ [value]: nextState });
      });

      for (const approvalObj of stateObj.approvals ?? []) {
        // create the basic approval tag
        const approvalTag = new Tag('approval', { _: approvalObj.name });

        // some simple parameters
        addParamsFromObjectToTag(['rememberAssignees'], approvalObj, approvalTag);

        // set who can assign
        const { allowedAssigners } = approvalObj;
        if (allowedAssigners) {
          if (allowedAssigners.groups)
            approvalTag.addParameter({ allowedassigngroups: allowedAssigners.groups.join(',') });
          if (allowedAssigners.users)
            approvalTag.addParameter({ allowedassigngroups: allowedAssigners.users.join(',') });
        }

        // handle tasks
        for (const { name, assignee, completeOn } of approvalObj.tasks) {
          const taskTag = new Tag('task', { name, assignee });

          approvalTag.addChild(taskTag);
        } // for (task of tasks)

        stateTag.addChild(approvalTag);
      } // for (approval of approvals)

      workflow.addChild(stateTag);
    } // for (state of states)

    console.log(workflow.markup);
    return workflow;
  };
}

