import Tag from '../../Tag';

class WorkflowInstructions extends Tag {
	/**
	 * @type {string}
	 * <p>Message to display in panel at top of &quot;create page/blog&quot; screen:</p><ul><li>Wiki markup &#x2013; see <a href="https://confluence.atlassian.com/display/DOC/Confluence+Wiki+Markup" class="external-link" rel="nofollow">Confluence Wiki Markup</a></li><li>Can use any character set supported by your Confluence server &#x2013; except some <a href="/display/CDML/Reserved+Characters">reserved characters</a>.</li></ul><p>Note: As the page or blog post is not yet created, wiki macros which require access to the content cannot be used in this scenario.</p>
	 */
	body: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Panel title:</p><ul><li>Plain text</li><li>Can use any character set supported by your Confluence server &#x2013; except some <a href="/display/CDML/Reserved+Characters">reserved characters</a>.</li></ul><p> </p><div class="content-by-label macro-blank-experience conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <strong class="content-label-header">Content by label</strong> <p>There is no content with the specified labels</p> </div><p></p></div>
	 */
	title: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Specifies the style of the panel: <strong><code>info</code></strong>, <strong><code>error</code></strong>, <strong><code>warning</code></strong>, <strong><code>success</code></strong> &#x2013; see samples below:</p><p><span class="confluence-embedded-file-wrapper"><img class="confluence-embedded-image" src="/download/attachments/49356750/message-info.png?version=1&amp;modificationDate=1573412529350&amp;api=v2" data-image-src="/download/attachments/49356750/message-info.png?version=1&amp;modificationDate=1573412529350&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="49356754" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="message-info.png" data-base-url="https://wiki.comalatech.com" data-linked-resource-content-type="image/png" data-linked-resource-container-id="49356750" data-linked-resource-container-version="1"></span><span class="confluence-embedded-file-wrapper"><img class="confluence-embedded-image" src="/download/attachments/49356750/message-error.png?version=1&amp;modificationDate=1573412528898&amp;api=v2" data-image-src="/download/attachments/49356750/message-error.png?version=1&amp;modificationDate=1573412528898&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="49356753" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="message-error.png" data-base-url="https://wiki.comalatech.com" data-linked-resource-content-type="image/png" data-linked-resource-container-id="49356750" data-linked-resource-container-version="1"></span><span class="confluence-embedded-file-wrapper"><img class="confluence-embedded-image" src="/download/attachments/49356750/message-warning.png?version=1&amp;modificationDate=1573412528450&amp;api=v2" data-image-src="/download/attachments/49356750/message-warning.png?version=1&amp;modificationDate=1573412528450&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="49356752" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="message-warning.png" data-base-url="https://wiki.comalatech.com" data-linked-resource-content-type="image/png" data-linked-resource-container-id="49356750" data-linked-resource-container-version="1"></span><span class="confluence-embedded-file-wrapper"><img class="confluence-embedded-image" src="/download/attachments/49356750/message-success.png?version=1&amp;modificationDate=1573412527991&amp;api=v2" data-image-src="/download/attachments/49356750/message-success.png?version=1&amp;modificationDate=1573412527991&amp;api=v2" data-unresolved-comment-count="0" data-linked-resource-id="49356751" data-linked-resource-version="1" data-linked-resource-type="attachment" data-linked-resource-default-alias="message-success.png" data-base-url="https://wiki.comalatech.com" data-linked-resource-content-type="image/png" data-linked-resource-container-id="49356750" data-linked-resource-container-version="1"></span></p><p> </p><div class="content-by-label macro-blank-experience conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <strong class="content-label-header">Content by label</strong> <p>There is no content with the specified labels</p> </div><p></p></div>
	 */
	style: string;

}
