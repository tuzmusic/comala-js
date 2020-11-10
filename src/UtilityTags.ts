import Tag, { ParamType } from './Tag';

export class SelfClosingTag extends Tag {
  constructor(name: string, params: ParamType) {
    super(name, params, true);
  }
}

export class State extends Tag {
  constructor(name: string, params: ParamType, ...tags: Tag[]) {
    super('state', { _: name, ...params, childTags: [...params.childTags || [], ...tags] });
  }
}

export class Trigger extends Tag {
  constructor(name: string, params: ParamType, ...tags: Tag[]) {
    super('trigger', { _: name, ...params, childTags: [...params.childTags || [], ...tags] });
  }
}

export class Approval extends SelfClosingTag {
  constructor(name: string, params: ParamType) {
    super('approval', { _: name, ...params });
  }
}

export class SetRestrictions extends SelfClosingTag {
  constructor(type: 'view' | 'edit', params: ParamType) {
    super('set-restrictions', { type, ...params });
  }
}

export class AddRestriction extends SelfClosingTag {
  constructor(type: 'view' | 'edit', params: ParamType) {
    super('add-restriction', { type, ...params });
  }
}

export class RemoveRestriction extends SelfClosingTag {
  constructor(type: 'view' | 'edit', params?: ParamType) {
    super('remove-restriction', { type, ...params });
  }
}

export class StateSelection extends SelfClosingTag {
  constructor(states: string | string[], params?: ParamType) {
    super('state-selection', { states: [states].flat().join(), ...params });
  }
}

export class SetState extends SelfClosingTag {
  constructor(state: string) {
    super('set-state', { _: state });
  }
}

export class WorkflowParameter extends Tag {
  constructor(name: string, type: 'user' | 'group' | 'string' | 'duration' | 'options', edit = true) {
    super('workflowparameter', { _: name, type, edit });
  }
}

export class CompleteTask extends SelfClosingTag {
  constructor(taskName: string) {
    super('complete-task', { task: taskName });
  }
}

export class Task extends SelfClosingTag {
  constructor(taskName: string, assignee: string) {
    super('task', { name: taskName, assignee });
  }
}

export const Creators = {
  WorkflowParameter: (name: string, type: 'user' | 'group' | 'string' | 'duration' | 'options', edit = true) => new WorkflowParameter(name, type, edit),
  SelfClosingTag: (name: string, params: ParamType) => new SelfClosingTag(name, params),
  State: (name: string, params: ParamType) => new State(name, params),
  Trigger: (name: string, params: ParamType, ...tags: Tag[]) => new Trigger(name, params, ...tags),
  Approval: (name: string, params: ParamType) => new Approval(name, params),
  SetRestrictions: (type: 'view' | 'edit', params: ParamType) => new SetRestrictions(type, params),
  AddRestriction: (type: 'view' | 'edit', params: ParamType) => new AddRestriction(type, params),
  RemoveRestriction: (type: 'view' | 'edit', params?: ParamType) => new RemoveRestriction(type, params),
  StateSelection: (states: string | string[], params?: ParamType) => new StateSelection(states, params),
  SetState: (state: string) => new SetState(state),
  CompleteTask: (taskName: string) => new CompleteTask(taskName),
  Task: (taskName: string, assignee: string) => new Task(taskName, assignee),
};
