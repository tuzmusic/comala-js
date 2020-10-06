import Tag from './Tag'

class CompleteTask extends Tag {
	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <p>Name of the task to complete.</p><p>No action will be taken if the task does not exist or is already closed.</p>
	 */
	task: string;

	/**
	 * @type {string}
	 * <p>The comment to record against the completed task.</p>
	 */
	comment: string;

}