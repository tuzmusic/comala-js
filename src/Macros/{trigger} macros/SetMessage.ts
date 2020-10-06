import Tag from './Tag'

class SetMessage extends Tag {
	/**
	 * @type {string}
	 * <div class="content-wrapper"><p><span class="status-macro aui-lozenge aui-lozenge-subtle conf-macro output-inline" data-hasbody="false" data-macro-name="status">DEPRECATED</span> Use the <strong><code>user</code></strong> parameter instead</p></div>
	 */
	parameter: string;

	/**
	 * @type {string}
	 * <p>The message to display:</p><ul><li>Plain text, or <a class="external-link" href="https://confluence.atlassian.com/display/DOC/Confluence+Wiki+Markup" rel="nofollow">Confluence Wiki Markup</a></li><li>Supports&#xA0;<a href="/display/CDML/Value+References">Value References</a></li></ul>
	 */
	body: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>How long should the message be displayed from the point at which it is set?</p><ul><li><strong>ISO 8601 duration code</strong> &#x2013; see: <a href="/display/CDML/Expiry+Dates">Expiry Dates</a></li><li>Supports <a href="/display/CDML/Value+References">Value References</a></li></ul><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+different-space+publishing">Advanced different-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+remote-space+publishing">Advanced remote-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Attachment+events">Attachment events</a> </div> </li> </ul><p></p></div>
	 */
	duration: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Only show to users in specific user group(s)?</p><ul><li>Comma separated list of user groups</li><li>Supports&#xA0;<a href="/display/CDML/Value+References">Value References</a></li></ul><p> </p><div class="content-by-label macro-blank-experience conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <strong class="content-label-header">Content by label</strong> <p>There is no content with the specified labels</p> </div><p></p></div>
	 */
	group: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Message style: <strong><code>info</code></strong>, <strong><code>error</code></strong>, <strong><code>warning</code></strong>, <strong><code>success</code></strong></p><p><span class="confluence-embedded-file-wrapper"><img class="confluence-embedded-image" src="/download/attachments/49356738/message-info.png?version=1&amp;modificationDate=1573412522457&amp;api=v2" data-image-src="/download/attachments/49356738/message-info.png?version=1&amp;modificationDate=1573412522457&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="49356744" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="message-info.png" data-base-url="https://wiki.comalatech.com" data-linked-resource-content-type="image/png" data-linked-resource-container-id="49356738" data-linked-resource-container-version="1"></span><span class="confluence-embedded-file-wrapper"><img class="confluence-embedded-image" src="/download/attachments/49356738/message-error.png?version=1&amp;modificationDate=1573412523748&amp;api=v2" data-image-src="/download/attachments/49356738/message-error.png?version=1&amp;modificationDate=1573412523748&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="49356747" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="message-error.png" data-base-url="https://wiki.comalatech.com" data-linked-resource-content-type="image/png" data-linked-resource-container-id="49356738" data-linked-resource-container-version="1"></span><span class="confluence-embedded-file-wrapper"><img class="confluence-embedded-image" src="/download/attachments/49356738/message-warning.png?version=1&amp;modificationDate=1573412523320&amp;api=v2" data-image-src="/download/attachments/49356738/message-warning.png?version=1&amp;modificationDate=1573412523320&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="49356746" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="message-warning.png" data-base-url="https://wiki.comalatech.com" data-linked-resource-content-type="image/png" data-linked-resource-container-id="49356738" data-linked-resource-container-version="1"></span><span class="confluence-embedded-file-wrapper"><img class="confluence-embedded-image" src="/download/attachments/49356738/message-success.png?version=1&amp;modificationDate=1573412522888&amp;api=v2" data-image-src="/download/attachments/49356738/message-success.png?version=1&amp;modificationDate=1573412522888&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="49356745" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="message-success.png" data-base-url="https://wiki.comalatech.com" data-linked-resource-content-type="image/png" data-linked-resource-container-id="49356738" data-linked-resource-container-version="1"></span></p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+different-space+publishing">Advanced different-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+remote-space+publishing">Advanced remote-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Blog+Post+Events">Blog Post Events</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Message+notification+styles">Message notification styles</a> </div> </li> </ul><p></p></div>
	 */
	style: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Only show to specific user(s)?</p><ul><li>Comma-separated list of usernames</li><li>Supports&#xA0;<a href="/display/CDML/Value+References">Value References</a></li></ul><p> </p><div class="content-by-label macro-blank-experience conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <strong class="content-label-header">Content by label</strong> <p>There is no content with the specified labels</p> </div><p></p></div>
	 */
	user: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Which types of content URL should the message be shown on?</p><ul><li><strong><code>draft</code></strong> &#x2013; the normal URL</li><li><strong><code>published</code></strong> &#x2013; the <code><strong>/public</strong></code> URL</li><li><strong><code>both</code></strong> &#x2013; both normal and public URLs</li></ul><p> </p><div class="content-by-label macro-blank-experience conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <strong class="content-label-header">Content by label</strong> <p>There is no content with the specified labels</p> </div><p></p></div>
	 */
	view: string;

}