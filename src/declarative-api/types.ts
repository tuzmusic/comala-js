import Approval from '../Macros/InUse/Approval';
import Workflowparameter from '../Macros/InUse/Workflowparameter';
import State from '../Macros/InUse/State';

export type ParamValueType = string | string[] | number | boolean;

export const permissionsKeys = {
  view: 'viewOnly',
  edit: 'viewAndEdit',
};

// Using typeof doesn't appear to actually do typechecking
export const userTypes = ['groups', 'users'];
export type UserType = 'groups' | 'users'

// This allows for "one or both". The optional second member
// of each type is necessary for typescript to be happy any
// time we refer to either member.
export type UsersObject =
// Record<UserType, string[]>
  { users: string[]; groups?: string[] }
  | { users?: string[]; groups: string[] }

export type PermissionsGroup =
// Record<PermissionsType, UsersObject>;
  { viewOnly: UsersObject; viewAndEdit?: UsersObject }
  | { viewOnly?: UsersObject; viewAndEdit: UsersObject }

export type TaskObject = {
  name: string;
  assignee: string;
  // the values of Event return functions, yes.
  // but when constructing a workflow, the function (that is a
  // value of Event) is CALLED, so completeOn is simply a function.
  completeOn: Function;
};
export type ApprovalObject = {
  /* Name of the approval. */
  name: string;
  /* Should prior assignees be reassinged next time we enter this state?
  *
  * NB: I think I still haven't confirmed that assignees are not remembered
  * between the same review on different pages, which the docs might imply. */
  rememberAssignees?: true;
  /* Groups/Users who are allowed to assign approvers for this review. */
  allowedAssigners?: UsersObject;
  /* Groups/Users who are available to be assigned as approvers for this review. */
  allowedApprovers?: UsersObject;
  // todo: this api might as well use onRejected, in combination with a fastReject boolean

  /* If a single rejection should reject this review, this value is the name of the
  * state to transition to on rejection. Its truthiness serves to "activate" fastReject. */
  fastReject?: string;

  /* Whether reviewers should have edit permissions.
  * Note that these permissions aren't "connected" to the approval or reviewers by Comala,
  * but rather our markup explicitly sets permissions when approvers are assigned and unassigned,
  * and when the review starts and ends. */
  reviewersCanEdit?: boolean;

  approveLabel?: string;
  rejectLabel?: string;

  /* If this approval should cause the state to change, even if other pending approvals
  * remain for this state, this value is the name of the state to transition to when
  * this approval passes.*/
  fastApprove?: string;

  otherParams?: Partial<Approval>;

  // TODO: "assignable" should be a first-class param, and possibly even a default
}

export type StateObject = {
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
  otherParams?: Partial<State>;

  // TODO: handle state-selection macro
}

export type WorkflowObject = {
  /* Name for the work\flow. */
  name: string;
  /* Pages (in this space) with this label will be controlled by the workflow. */
  label: string;
  states: StateObject[];
  parameters?: Partial<Workflowparameter>[];
}
