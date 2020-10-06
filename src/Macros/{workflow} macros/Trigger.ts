import Tag from './Tag'

class Trigger extends Tag {
	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <p>The event to listen to &#x2013; see: <a href="/display/CDML/Events">Events</a></p>
	 */
	parameter: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>One or more actions to process when the trigger is activated &#x2013; see: <a href="/display/CDML/Actions">Actions</a></p></div>
	 */
	body: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>The description for the trigger:</p><ul><li><span>Plain text</span></li><li>Can use any character set supported by your Confluence server &#x2013; except some&#xA0;<a href="/display/CWL/Reserved+Characters">reserved characters</a></li></ul></div>
	 */
	description: string;

	/**
	 * @type {string}
	 * <p>Optionally apply further conditions to filter events &#x2013; see: <a href="/display/CDML/Conditions">Conditions</a></p>
	 */
	Conditions: string;

	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <div class="content-wrapper"><p><span class="confluence-embedded-file-wrapper"><img class="confluence-embedded-image emoticon emoticon-information confluence-external-resource" alt="(info)" src="https://wiki.comalatech.com/s/en_GB/7502/ac22fa19040b80942f38f572cb0ccfe31fa6e23d/_/images/icons/emoticons/information.png" data-image-src="https://wiki.comalatech.com/s/en_GB/7502/ac22fa19040b80942f38f572cb0ccfe31fa6e23d/_/images/icons/emoticons/information.png"></span> Required for all events relating to the <strong>{approval}</strong> macro.</p><p>Filter to a specific <code><strong>{approval}</strong></code> name.</p><p>Tip: If you have more than one <strong>{approval}</strong> with same name, you can also filter to a specific <strong>{state}</strong> using the <strong><code>state</code></strong> parameter.</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Add%2C+remove+and+set+page+restrictions">Add, remove and set page restrictions</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+different-space+publishing">Advanced different-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+remote-space+publishing">Advanced remote-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Blog+Post+Events">Blog Post Events</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Fast-tracked+Rejections">Fast-tracked Rejections</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Require+Parameters+on+State+Transitions">Require Parameters on State Transitions</a> </div> </li> </ul><p></p></div>
	 */
	approval: string;

	/**
	 * @type {boolean}
	 * <div class="content-wrapper"><p>Only applies to <code><strong>statechanged</strong></code> event, for each page or blog post the workflow is applied to.</p><ul><li><code><strong>true</strong></code> &#x2013; only listen for the first time the workflow transitions to the <strong>{state}</strong> specified by the <strong><code>state</code></strong> parameter.</li><li><code><strong>false</strong></code> &#x2013; listen to every time the workflow transitions to the <strong>{state}</strong> specified by the <strong><code>state</code></strong> parameter.</li></ul><p>The primary use of this parameter is to perform one-time initialisation actions for a given piece of content. For example, on the first review of a piece of content you might want to send out additional emails, or set some metadata.</p><p> </p><div class="content-by-label macro-blank-experience conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <strong class="content-label-header">Content by label</strong> <p>There is no content with the specified labels</p> </div><p></p></div>
	 */
	initial: boolean;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Only applies to <strong><code>labeladded</code></strong> and <strong><code>labelremoved</code></strong> events.</p><p>The name of the label which was added or removed.</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Space+mode+workflow+application">Space mode workflow application</a> </div> </li> </ul><p></p></div>
	 */
	label: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>If this value is set, then a custom event identified by this value will be <em>published</em> when the actions are executed, and will contain a flag <code>success</code> set to <code>true</code> or <code>false</code> depending on the outcome</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+different-space+publishing">Advanced different-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+remote-space+publishing">Advanced remote-space publishing</a> </div> </li> </ul><p></p></div>
	 */
	newevent: string;

	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <div class="content-wrapper"><p><span class="confluence-embedded-file-wrapper"><img class="confluence-embedded-image emoticon emoticon-information confluence-external-resource" alt="(info)" src="https://wiki.comalatech.com/s/en_GB/7502/ac22fa19040b80942f38f572cb0ccfe31fa6e23d/_/images/icons/emoticons/information.png" data-image-src="https://wiki.comalatech.com/s/en_GB/7502/ac22fa19040b80942f38f572cb0ccfe31fa6e23d/_/images/icons/emoticons/information.png"></span> Required for the <strong><code>pageparameterupdate</code></strong> event</p><p>The name of the parameter to monitor.</p><p> </p><div class="content-by-label macro-blank-experience conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <strong class="content-label-header">Content by label</strong> <p>There is no content with the specified labels</p> </div><p></p></div>
	 */
	parameter: string;

	/**
	 * @type {boolean}
	 * <div class="content-wrapper"><p>Only applicable to for the following events: <strong><code>pageapproved</code></strong>, <strong><code>pagerejected</code></strong>, <strong><code>newsapproved</code></strong> and <strong><code>newsrejected</code></strong></p><ul><li><code><strong>true</strong></code> &#x2013; process each individual Approve or Reject</li><li><strong><code>false</code></strong> &#x2013; wait until all reviewers agree on either Approve or Reject</li></ul><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Fast-tracked+Rejections">Fast-tracked Rejections</a> </div> </li> </ul><p></p></div>
	 */
	partial: boolean;

	/**
	 * @type {boolean}
	 * <div class="content-wrapper"><p>Should actions be queued?</p><ul><li><strong><code>true</code></strong> &#x2013; Yes, queue them</li><li><strong><code>false</code></strong> &#x2013; No, run them immediately</li></ul><p>If there is a chance that actions will take a long time to process, for example when remote publishing content, they should be queued so the end user doesn&apos;t have to wait for them to finish before continuing with thier work.</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+different-space+publishing">Advanced different-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+remote-space+publishing">Advanced remote-space publishing</a> </div> </li> </ul><p></p></div>
	 */
	queue: boolean;

	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <div class="content-wrapper"><p><span class="confluence-embedded-file-wrapper"><img class="confluence-embedded-image emoticon emoticon-information confluence-external-resource" alt="(info)" src="https://wiki.comalatech.com/s/en_GB/7502/ac22fa19040b80942f38f572cb0ccfe31fa6e23d/_/images/icons/emoticons/information.png" data-image-src="https://wiki.comalatech.com/s/en_GB/7502/ac22fa19040b80942f38f572cb0ccfe31fa6e23d/_/images/icons/emoticons/information.png"></span> Required for the following events: <strong><code>pagestatechanged</code></strong>, <strong><code>statechanged</code></strong> or <strong><code>newsstatechanged</code></strong></p><p>Filter to a specific active <strong>{state}</strong> of the workflow.</p><p>Note: Only a single state can be specified, and it can&apos;t be negated.</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+different-space+publishing">Advanced different-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+remote-space+publishing">Advanced remote-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Attachment+events">Attachment events</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Message+notification+styles">Message notification styles</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/State+expiry+dates">State expiry dates</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/StiltSoft+Talk+app">StiltSoft Talk app</a> </div> </li> </ul><p></p></div>
	 */
	state: string;

	/**
	 * @type {boolean}
	 * <div class="content-wrapper"><p>This setting is used to listen for the outcome of a custom event (set by the <code>newevent</code> parameter in an separate trigger macro). This setting can be used to handle error in actions (for example, failure of remote publishing).</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+different-space+publishing">Advanced different-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+remote-space+publishing">Advanced remote-space publishing</a> </div> </li> </ul><p></p></div>
	 */
	success: boolean;

	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <div class="content-wrapper"><p><span class="confluence-embedded-file-wrapper"><img class="confluence-embedded-image emoticon emoticon-information confluence-external-resource" alt="(info)" src="https://wiki.comalatech.com/s/en_GB/7502/ac22fa19040b80942f38f572cb0ccfe31fa6e23d/_/images/icons/emoticons/information.png" data-image-src="https://wiki.comalatech.com/s/en_GB/7502/ac22fa19040b80942f38f572cb0ccfe31fa6e23d/_/images/icons/emoticons/information.png"></span> If not specified, the trigger will listen for all tasks rather than a specific task.</p><p>Filter to a specific <code><strong>{task}</strong></code> name.</p><p> </p><div class="content-by-label macro-blank-experience conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <strong class="content-label-header">Content by label</strong> <p>There is no content with the specified labels</p> </div><p></p></div>
	 */
	task: string;

}