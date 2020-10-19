import Tag from '../../Tag';

class Workflow extends Tag {
	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <div class="content-wrapper"><p><span class="confluence-embedded-file-wrapper"><img class="confluence-embedded-image emoticon emoticon-information confluence-external-resource" alt="(info)" src="https://wiki.comalatech.com/s/en_GB/7502/ac22fa19040b80942f38f572cb0ccfe31fa6e23d/_/images/icons/emoticons/information.png" data-image-src="https://wiki.comalatech.com/s/en_GB/7502/ac22fa19040b80942f38f572cb0ccfe31fa6e23d/_/images/icons/emoticons/information.png"></span> There must be at least one <code><strong>{state}</strong></code> macro in the body.</p><p>The following macros can be put in the body of a&#xA0;<code><strong>{workflow}</strong></code>&#xA0;macro:</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/description+macro">description macro</a> <span class="smalltext">&#x2014; Describe your workflow templates.</span> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/pagefooter+macro">pagefooter macro</a> <span class="smalltext">&#x2014; Add content to page footer</span> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/pageheader+macro">pageheader macro</a> <span class="smalltext">&#x2014; Add content to page header</span> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/read-ack+macro">read-ack macro</a> <span class="smalltext">&#x2014; Request user read confirmation of content</span> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/state+macro">state macro</a> <span class="smalltext">&#x2014; Define workflow states &amp; basic transitions</span> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/trigger+macro">trigger macro</a> <span class="smalltext">&#x2014; Trigger actions when events are fired</span> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/workflow-instructions+macro">workflow-instructions macro</a> <span class="smalltext">&#x2014; Add message to &quot;create page/blog&quot; screen</span> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/workflowparameter+macro">workflowparameter macro</a> <span class="smalltext">&#x2014; Define editable <a href="/display/CDML/Value+References">Value References</a></span> </div> </li> </ul><p></p></div>
	 */
	body: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Defines additional users who should be treated as admin users from the perspective of the workflow:</p><ul><li>Comma-separated list of usernames</li><li>Listed users can delete labels defined in <code><strong>stickylabels</strong></code> parameter</li><li>Can use <a href="/display/CDML/Administrator+state+override">Administrator state override</a></li><li>Also affects any macro with an <code><strong>admin=true</strong></code> parameter</li></ul><p> </p><div class="content-by-label macro-blank-experience conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <strong class="content-label-header">Content by label</strong> <p>There is no content with the specified labels</p> </div><p></p></div>
	 */
	adminusers: string;

	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <div class="content-wrapper"><p>Name of the workflow:</p><ul><li>In <a href="/display/CDML/Space+Mode">Space Mode</a>, the workflow must have a unique name amongst the enabled workflows</li><li>The name can use any character set supported by your Confluence server &#x2013; except some&#xA0;<a href="https://wiki.comalatech.com/display/CWND/Reserved+Characters" rel="nofollow">reserved characters</a>.</li><li>Can be accessed via <code><strong>@pageworkflowname@</strong></code> <a href="/display/CDML/Event+references">Predefined reference</a></li></ul><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Attachment+events">Attachment events</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Customise+Approval+Buttons">Customise Approval Buttons</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Fast-tracked+Rejections">Fast-tracked Rejections</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Reviewer+Authentication">Reviewer Authentication</a> </div> </li> </ul><p></p></div>
	 */
	name: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Which types of content should the workflow be applied to?</p><ul><li>Comma-separated list of content types</li><li>Supported types: <strong><code>pages</code></strong>, <strong><code>news</code></strong> (blog posts)</li><li>Only takes effect in <a href="/display/CDML/Space+Mode">Space Mode</a></li></ul><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Space+mode+workflow+application">Space mode workflow application</a> </div> </li> </ul><p></p></div>
	 */
	content: string;

	/**
	 * @type {boolean}
	 * <div class="content-wrapper"><p>Should the purpose of the label parameter be inverted?</p><ul><li><strong><code>true</code></strong> &#x2013; yes, only apply the workflow to content with none of the listed labels</li><li><strong><code>false</code></strong> &#x2013; no, apply the workflow to content that has one or more of the listed labels</li></ul><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Space+mode+workflow+application">Space mode workflow application</a> </div> </li> </ul><p></p></div>
	 */
	invertlabel: boolean;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Which labels should this workflow be applied to?</p><ul><li>Comma-separated list of labels</li><li>Workflow will be applied to any content with one or more of the listed labels</li><li>Only takes effect in <a href="/display/CDML/Space+Mode">Space Mode</a></li></ul><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Space+mode+workflow+application">Space mode workflow application</a> </div> </li> </ul><p></p></div>
	 */
	label: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Should one or more labels be protected from removal?</p><ul><li>Comma-separated list of labels which must not be removed</li><li>Once added, the labels can only be removed by a <a href="/display/CDML/Space+Admin">Space Admin</a>, <a href="/display/CDML/Confluence+Admin">Confluence Admin</a> or users listed in the <code><strong>adminusers</strong></code> parameter</li></ul><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Space+mode+workflow+application">Space mode workflow application</a> </div> </li> </ul><p></p></div>
	 */
	stickylabels: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Display a Space-level <a href="https://confluence.atlassian.com/doc/create-a-template-296093779.html" class="external-link" rel="nofollow">Page Template</a> in the footer of all pages / blog posts that the workflow is applied to:</p><ul><li>Full path to template: <strong><code>SPACEKEY:Page Template Title</code></strong></li><li>If no <strong><code>SPACEKEY</code></strong> specified, it will default to the current space</li></ul><p> </p><div class="content-by-label macro-blank-experience conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <strong class="content-label-header">Content by label</strong> <p>There is no content with the specified labels</p> </div><p></p><p>See also: <a href="/display/CDML/pagefooter+macro">{pagefooter} macro</a></p></div>
	 */
	footer: string;
	footertemplate: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Display a Space-level <a href="https://confluence.atlassian.com/doc/create-a-template-296093779.html" class="external-link" rel="nofollow">Page Template</a> in the header of all pages / blog posts that the workflow is applied to:</p><ul><li>Full path to template: <strong><code>SPACEKEY:Page Template Title</code></strong></li><li>If no <strong><code>SPACEKEY</code></strong> specified, it will default to the current space</li></ul><p> </p><div class="content-by-label macro-blank-experience conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <strong class="content-label-header">Content by label</strong> <p>There is no content with the specified labels</p> </div><p></p><p>See also: <a href="/display/CDML/pageheader+macro">{pageheader} macro</a>, <a href="/display/CDML/include-segment">{include-segment} macro</a>, <a href="/display/CDML/set-message+macro">{set-message} macro</a>, <a href="/display/CDML/workflow-instructions+macro">{workflow-instructions} macro</a></p></div>
	 */
	header: string;
	headertemplate: string;

	/**
	 * @type {boolean}
	 * <div class="content-wrapper"><p>Should the Progress Tracker be available in the <a href="/display/CDML/Workflow+Popup">Workflow Popup</a>?</p><ul><li><strong><code>true</code></strong> &#x2013; yes, include the Progress Tracker</li><li><strong><code>false</code></strong> &#x2013; no, remove the Progress Tracker</li></ul><p> </p><div class="content-by-label macro-blank-experience conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <strong class="content-label-header">Content by label</strong> <p>There is no content with the specified labels</p> </div><p></p><p>See also: <strong><code>hidefrompath</code></strong> parameter on <a href="/display/CDML/state+macro"><strong><code>{state}</code></strong> macro</a></p></div>
	 */
	progresstracker: boolean;

	/**
	 * @type {boolean}
	 * <div class="content-wrapper"><p>If a page or blog post contains the Confluence <strong><a href="https://confluence.atlassian.com/display/DOC/Status+Macro" class="external-link" rel="nofollow">{status} macro</a>,</strong> should it be updated whenever the workflow state changes?</p><ul><li><strong><code>true</code></strong> &#x2013; yes, update the {status} macro to show the name of the current workflow state</li><li><strong><code>false</code></strong> &#x2013; no, don&apos;t update</li></ul><p>This is primarily for old templates that used the {status} macro as a mechanism to display workflow status in the page content.</p><p> </p><div class="content-by-label macro-blank-experience conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <strong class="content-label-header">Content by label</strong> <p>There is no content with the specified labels</p> </div><p></p><p>It is recommended to use the <strong><a href="/display/AWP31/pagestatus+macro">{pagestatus} macro</a></strong> instead.</p></div>
	 */
	updatestatus: boolean;

}
