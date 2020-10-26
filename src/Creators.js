/* @ts-ignore */
import { Trigger } from './UtilityTags';

export const Creators = {
  SelfClosingTag: (...args) => new SelfClosingTag(...args),
  State: (...args) => new State(...args),
  Trigger: (...args) => new Trigger(...args),
  Approval: (...args) => new Approval(...args),
  SetRestrictions: (...args) => new SetRestrictions(...args),
  AddRestriction: (...args) => new AddRestriction(...args),
  RemoveRestriction: (...args) => new RemoveRestriction(...args),
  StateSelection: (...args) => new StateSelection(...args),
  SetState: (...args) => new SetState(...args),
  WorkflowParameter: (...args) => new WorkflowParameter(...args),
};
