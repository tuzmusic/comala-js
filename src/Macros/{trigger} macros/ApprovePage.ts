import Tag from './Tag'

class ApprovePage extends Tag {
	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <p>Name of the approval to approve.</p><p>Only applies if there is an active approval of that name.</p>
	 */
	parameter: string;

	/**
	 * @type {string}
	 * <p>Approval comment:</p><ul><li>Plain text</li><li>Can use any character set supported by your Confluence server &#x2013; except some&#xA0;<a href="/display/CDML/Reserved+Characters">reserved characters</a>.</li></ul>
	 */
	comment: string;

}