import Tag from './Tag'

class WorkflowReport extends Tag {
	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <p>What type of report should be displayed?</p><ul><li><strong><code>approvals</code></strong> &#x2013; <a href="/display/CDML/Workflow+Report+Macro+-+Approvals">Workflow Report Macro - Approvals</a><br><ul><li>The <strong><code>approval</code></strong> parameter must also be specified for this report to work</li></ul></li><li><strong><code>dashboard</code></strong><span> </span><span>&#x2013; </span><a href="/display/CDML/Workflow+Report+Macro+-+Dashboard">Workflow Report Macro - Dashboard</a><code><br></code></li><li><strong><code>states</code></strong> &#x2013; <a href="/display/CDML/Workflow+Report+Macro+-+States">Workflow Report Macro - States</a></li><li><strong><code>stats</code></strong> &#x2013; <a href="/display/CDML/Workflow+Report+Macro+-+Stats">Workflow Report Macro - Stats</a></li><li><strong><code>tasks</code></strong> &#x2013; <a href="/display/CDML/Workflow+Report+Macro+-+Tasks">Workflow Report Macro - Tasks</a></li></ul>
	 */
	type: string;

	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <p><strong><img class="emoticon emoticon-information" src="/s/-pdv0xt/8401/0f22f74a0c673511e48ab1bc7ae6af4388aa8dbf/_/images/icons/emoticons/information.svg" data-emoticon-name="information" alt="(info)">&#xA0;T</strong>he name of a content review is required for the <strong><code>type=approvals</code></strong> report to work.</p><p>The name is defined by the&#xA0;<a href="https://wiki.comalatech.com/display/CWND/approval+macro" rel="nofollow"><code><strong>{approval}</strong></code>&#xA0;macro</a>, and is shown in the&#xA0;<a href="https://wiki.comalatech.com/display/CWND/Workflow+Popup" rel="nofollow">Workflow Popup</a>&#xA0;during&#xA0;<a href="https://wiki.comalatech.com/display/CWND/Content+reviews" rel="nofollow">Content reviews</a>.</p>
	 */
	approval†: string;

	/**
	 * @type {string}
	 * <p>Should the report be filtered to content that the specified user can currently review?</p><ul><li>Leave empty to include all content</li><li>Specify a username to filter to results which that user can review</li><li>Specify&#xA0;<code><strong>@self</strong></code>&#xA0;to filter to results that the current user can review</li></ul>
	 */
	approver†: string;

	/**
	 * @type {string}
	 * <p><sup><span>&#x2020; </span></sup>For <strong><code>type=approvals</code></strong>, which stage of the content review should the content be in?</p><ul><li><strong>pending</strong>&#xA0;&#x2013; the review is not yet complete</li><li><strong>approved</strong>&#xA0;&#x2013; the review was approved</li><li><strong>rejected</strong>&#xA0;&#x2013; the review was rejected</li></ul><p><sup><span>&#x2021; </span></sup>For <code><strong>type=states</strong></code>, you can provide a comma-separated list of CQL filters in the form <code><strong>FieldName:Value</strong></code> &#x2013; the values must be indexed.</p><ul><li><a href="/display/CDML/CQL+Fields">Workflow CQL Fields</a></li><li><a rel="nofollow" href="https://developer.atlassian.com/server/confluence/advanced-searching-using-cql/" class="external-link">Advanced Searching Using CQL</a>&#xA0;(Atlassian)</li><li><a href="https://developer.atlassian.com/server/confluence/cql-field-reference/" class="external-link" rel="nofollow">CQL Field Reference</a>&#xA0;(Atlassian)</li><li><a class="external-link" rel="nofollow" href="https://developer.atlassian.com/server/confluence/cql-function-reference/">CQL Function Reference</a>&#xA0;(Atlassian)</li><li><a class="external-link" rel="nofollow" href="https://developer.atlassian.com/server/confluence/cql-keywords-reference/">CQL Keywords Reference</a>&#xA0;(Atlassian)</li><li><a class="external-link" href="https://developer.atlassian.com/server/confluence/cql-operators-reference/" rel="nofollow">CQL Operators Reference</a>&#xA0;(Atlassian)&#xA0;</li><li><a class="external-link" href="https://developer.atlassian.com/server/confluence/performing-text-searches-using-cql/" rel="nofollow">Performing Text Searches with CQL</a>&#xA0;(Atlassian)</li></ul>
	 */
	filter†‡: string;

	/**
	 * @type {boolean}
	 * <p>Should the report header be hidden?</p><ul><li>Only applies to <strong><code>type=dashboard</code></strong> report</li><li><strong><code>true</code></strong> &#x2013; hide the header</li><li><strong><code>false</code></strong> &#x2013; don&apos;t hide the header</li></ul>
	 */
	hideheader: boolean;

	/**
	 * @type {string}
	 * <p>Should the report be filtered by content label(s)?</p><ul><li>Leave empty to include all content</li><li>Specify one label name to filter to a specific label</li><li>List multiple label names, separated by commas, to filter to content with any of those labels</li></ul><p>If using a list of labels, you can prefix the list with&#xA0;<strong><code>&amp;</code></strong>&#xA0;(ampersand) to require that content has all the labels.</p>
	 */
	label: string;

	/**
	 * @type {string}
	 * <p>The number of results to show per page.</p>
	 */
	maxentries: string;

	/**
	 * @type {string}
	 * <p>What order should results be sorted in?</p><ul><li><code><strong>ascending</strong></code> &#x2013; <code>A&#x2192;Z</code></li><li><code><strong>descending</strong></code> &#x2013; <code>Z&#x2192;A</code></li></ul>
	 */
	order: string;

	/**
	 * @type {string}
	 * <p>Should the report be filtered to a specific parent page and the child pages of the specific page?</p><ul><li>Leave empty to include all content in the space</li><li>Specify a page title to include the specified page and its child pages</li><li>Specify&#xA0;<strong><code>@self</code>&#xA0;</strong>to specify the current page</li></ul>
	 */
	parent: string;

	/**
	 * @type {string}
	 * <p>Which report column of the report should results be sorted by?</p><ul><li><code><strong>modified</strong></code> &#x2013; the most recent date on which the content (page or blog post) was modified</li><li><code><strong>created</strong></code> &#x2013; when the review, state or task was created</li><li><code><strong>duedate</strong></code> &#x2013; the task or state expiry date</li><li><code><strong>pagestate</strong></code> &#x2013; the current workflow state</li><li><code><strong>statechanged</strong></code> &#x2013; the most recent date on which the state was changed</li><li><code><strong>statechangedby</strong></code> &#x2013; the user that most recently changed the state</li></ul>
	 */
	sort: string;

	/**
	 * @type {string}
	 * <p>Which space(s) should be included in the report?</p><ul><li>Leave empty to report on the current space</li><li>Specify one&#xA0;<a rel="nofollow" href="https://confluence.atlassian.com/doc/space-keys-829076188.html" class="external-link">space key</a>&#xA0;to report on a specific space</li><li>List multiple&#xA0;<a class="external-link" rel="nofollow" href="https://confluence.atlassian.com/doc/space-keys-829076188.html">space keys</a>, separated by commas, to report on multiple spaces</li><li>Specify&#xA0;<strong><code>any</code></strong>&#xA0;to report on all spaces &#x2013; but you must also specify <strong><code>approval</code></strong> or <strong><code>state</code></strong> parameter, depending on the report <strong><code>type</code></strong></li></ul>
	 */
	spacekeys: string;

	/**
	 * @type {string}
	 * <p>Should the report be filtered to specific state(s)?</p><ul><li>Leave empty to report on all states</li><li>Specify one state name to report on that state</li><li>List multiple state names, separated by commas, to report on specific states</li></ul>
	 */
	state‡: string;

	/**
	 * @type {string}
	 * <p>Should the report be filtered to content that the specified user can currently review?</p><ul><li>Leave empty to include all content</li><li>Specify a username to filter to results which the specified user can review</li><li>Specify&#xA0;<code><strong>@self</strong></code>&#xA0;to filter to results that the current user can review</li></ul>
	 */
	user‡: string;

}