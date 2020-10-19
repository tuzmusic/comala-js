import Tag from '../../Tag';

class Pagefooter extends Tag {
	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <div class="content-wrapper"><p>Footer content:</p><ul><li>Wiki markup &#x2013; see <a href="https://confluence.atlassian.com/display/DOC/Confluence+Wiki+Markup" class="external-link" rel="nofollow">Confluence Wiki Markup</a></li><li>Can use any character set supported by your Confluence server &#x2013; except some <a href="/display/CDML/Reserved+Characters">reserved characters</a>.</li></ul><p>The following macros can be used in the footer:</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/get-metadata+macro">get-metadata macro</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/pageactivity+macro">pageactivity macro</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/pagestatus+macro">pagestatus macro</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/workflow-report+macro">workflow-report macro</a> </div> </li> </ul><p></p></div>
	 */
	body: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Who can see the footer?</p><ul><li><code><strong>contributors</strong></code> &#x2013; users who can edit the page</li><li><code><strong>readonly</strong></code> &#x2013; users who can view, but not edit, the page</li><li><code><strong>all</strong></code> &#x2013; both <code><strong>contributors</strong></code> and <code><strong>readonly</strong></code> users</li></ul><p> </p><div class="content-by-label macro-blank-experience conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <strong class="content-label-header">Content by label</strong> <p>There is no content with the specified labels</p> </div><p></p></div>
	 */
	visibility: string;

}
