import Tag from './Tag'

class RejectPage extends Tag {
	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <p>Name of the approval to reject.</p><p>Only applies if there is an active approval of that name.</p>
	 */
	parameter: string;

	/**
	 * @type {string}
	 * <p>Rejection comment:</p><ul><li>Plain text</li><li>Can use any character set supported by your Confluence server &#x2013; except some&#xA0;<a href="https://wiki.comalatech.com/display/CWND/Reserved+Characters" rel="nofollow">reserved characters</a>.</li></ul>
	 */
	comment: string;

}