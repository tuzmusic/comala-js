import Tag from './Tag'

class Task extends Tag {
	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <p>Name of task:</p><ul><li>Within any&#xA0;<strong><code>{state}</code></strong>&#xA0;macro, each&#xA0;<strong><code>{task}</code></strong>&#xA0;macro must have a unique name</li><li>The name can use any character set supported by your Confluence server &#x2013; except some&#xA0;<a href="https://wiki.comalatech.com/display/CWND/Reserved+Characters" rel="nofollow">reserved characters</a>.</li></ul>
	 */
	name: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Task assignee:</p><ul><li>Username &#x2013; must have edit permission on the associated content</li><li>Supports <a href="/display/CDML/Value+References">Value References</a></li></ul><p>If no assignee specified, any user with edit permission on the associated content can assign or complete tasks.</p><p> </p><div class="content-by-label macro-blank-experience conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <strong class="content-label-header">Content by label</strong> <p>There is no content with the specified labels</p> </div><p></p></div>
	 */
	assignee: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Due date for task completion:</p><ul><li>Format can be either:<ul><li>Explicit date in the format: <code><strong>YYYY-MM-DD HH:mm</strong></code> (v4.12+)</li><li>ISO 8601 Duration Period</li><li>See <a href="/display/CDML/Expiry+Dates">Expiry Dates</a> for more information</li></ul></li><li>Supports <a href="/display/CDML/Value+References">Value References</a></li></ul><p>If specified, the task, if not completed, will eventually expire and trigger a <a href="/display/CDML/Events"><code><strong>taskexpired</strong></code> event</a>.</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Expiry+Dates">Expiry Dates</a> </div> </li> </ul><p></p></div>
	 */
	duedate: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Note to associate with the task:</p><ul><li>Plain text</li><li>Can use any character set supported by your Confluence server &#x2013; except some&#xA0;<a href="https://wiki.comalatech.com/display/CWND/Reserved+Characters" rel="nofollow">reserved characters</a>.</li><li>Logged in activity report and sent in notifications</li></ul><p> </p><div class="content-by-label macro-blank-experience conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <strong class="content-label-header">Content by label</strong> <p>There is no content with the specified labels</p> </div><p></p></div>
	 */
	note: string;

}