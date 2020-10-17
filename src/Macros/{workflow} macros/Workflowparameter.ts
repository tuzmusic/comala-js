import Tag from '../../Tag';

class Workflowparameter extends Tag {
	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <p>Name of the parameter.</p>
	 */
	name: string;

	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <p>The default value for the parameter:</p><ul><li>Can use any character set supported by your Confluence server &#x2013; except some&#xA0;<a href="/display/CDML/Reserved+Characters">reserved characters</a></li><li>Can be overridden in <a href="/display/CDML/Parameters+-+Space+Tools">Parameters - Space Tools</a> if template is used in <a href="/display/CDML/Space+Mode">Space Mode</a></li><li>Can be overridden at page or blog post level, via <a href="/display/CDML/Workflow+Popup">Workflow Popup</a>, in both <a href="/display/CDML/Page+Mode">Page Mode</a> and <a href="/display/CDML/Space+Mode">Space Mode</a>, if <strong><code>edit=true</code></strong> is set</li></ul>
	 */
	body: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>The description for the parameter:</p><ul><li><span>Plain text</span></li><li>Can use any character set supported by your Confluence server &#x2013; except some&#xA0;<a href="/display/CDML/Reserved+Characters">reserved characters</a></li></ul><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/State+expiry+dates">State expiry dates</a> </div> </li> </ul><p></p></div>
	 */
	description: string;

	/**
	 * @type {boolean}
	 * <div class="content-wrapper"><p>Should this parameter be editable at the page or blog post level?</p><ul><li><strong><code>true</code></strong> &#x2013; yes, make it editable via the <a href="/display/CDML/Workflow+Popup">Workflow Popup</a></li><li><strong><code>false</code></strong> &#x2013; no, it can only be edited via <a href="/display/CDML/Parameters+-+Space+Tools">Parameters - Space Tools</a></li></ul><p>Tip: If set to <strong><code>true</code></strong>, the value of the parameter can be used as a normal <a href="/display/CDML/Value+References">Value Reference</a> and can be accessed via the <a href="/display/CDML/get-metadata+macro"><code><strong>{get-metadata}</strong></code><strong> </strong>macro</a>.</p><p>edit=true prameters can also be required to be set upon transition to a state by setting them in the requiredparams list for that state.</p><p> </p><div class="content-by-label macro-blank-experience conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <strong class="content-label-header">Content by label</strong> <p>There is no content with the specified labels</p> </div><p></p></div>
	 */
	edit: boolean;

	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <div class="content-wrapper"><p><span class="confluence-embedded-file-wrapper"><img class="confluence-embedded-image emoticon emoticon-information confluence-external-resource" alt="(info)" src="https://wiki.comalatech.com/s/en_GB/7502/ac22fa19040b80942f38f572cb0ccfe31fa6e23d/_/images/icons/emoticons/information.png" data-image-src="https://wiki.comalatech.com/s/en_GB/7502/ac22fa19040b80942f38f572cb0ccfe31fa6e23d/_/images/icons/emoticons/information.png"></span> Required if <strong><code>type</code></strong> is <strong><code>list</code>.</strong></p><p>List options:</p><ul><li>Comma-separated list of values</li><li>Can use any character set supported by your Confluence server &#x2013; except some&#xA0;<a href="/display/CDML/Reserved+Characters">reserved characters</a></li><li>Supports <a href="/display/CDML/Value+References">Value References</a></li></ul><p> </p><div class="content-by-label macro-blank-experience conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <strong class="content-label-header">Content by label</strong> <p>There is no content with the specified labels</p> </div><p></p></div>
	 */
	options: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Parameter type:</p><ul><li><strong><code>string</code></strong> &#x2013; text<ul><li>Usually plain text, but can contain wiki notation depending on where the parameter value will be used</li></ul></li><li><strong><code>user</code></strong> &#x2013; a single username or comma separated list of usernames</li><li><strong><code>duration</code></strong> &#x2013; an ISO 8601 duration</li><li><strong><code>group</code></strong> &#x2013; a single Confluence group or comma separated list of group names</li><li><strong><code>list</code></strong> &#x2013; a list of values to choose from &#x2013; see: <strong><code>options</code></strong> parameter</li></ul><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/State+expiry+dates">State expiry dates</a> </div> </li> </ul><p></p></div>
	 */
	type: string;

}