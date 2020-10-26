import Tag, { ParamType } from './Tag';

export class SelfClosingTag extends Tag {
  constructor(name: string, params: ParamType) {
    super(name, params, true);
  }
}

export class State extends Tag {
  constructor(name: string, params: ParamType) {
    super('state', { _: name, ...params });
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
