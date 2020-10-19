import Tag from '../../Tag';

class SetState extends Tag {
	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <p>The state to transition to.</p><p>Note: It must be defined in the workflow.</p>
	 */
	state: string;

	/**
	 * @type {string}
	 * <p>Comment to associate with the state change:</p><ul><li>plain text</li><li>can use any character set supported by your Confluence server &#x2013; except some&#xA0;<a href="https://wiki.comalatech.com/display/CWND/Reserved+Characters" rel="nofollow">reserved characters</a>.</li></ul>
	 */
	comment: string;

	/**
	 * @type {string}
	 * <p>If specified, the state will be changed on the parent page or child pages, not the current page:</p><ul><li><strong><code>@parent</code></strong> &#x2013; Change state of parent page</li><li><strong><code>@children</code></strong> &#x2013; Change state of child pages</li></ul><p>Obviously, this parameter only works on pages, not blog posts.</p>
	 */
	page: string;

}
