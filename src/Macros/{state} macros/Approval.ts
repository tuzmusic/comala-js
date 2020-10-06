import Tag from '../../Tag'

class Approval extends Tag {
	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <div class="content-wrapper"><p>Name of the content review.</p><ul><li>Within any <strong><code>{state}</code></strong> macro, each <strong><code>{approval}</code></strong> macro must be given a unique name</li><li>The name can use any character set supported by your Confluence server &#x2013; except some <a href="/display/CDML/Reserved+Characters">reserved characters</a>.</li></ul><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Adding+Multiple+Reviews">Adding Multiple Reviews</a> </div> </li> </ul><p></p></div>
	 */
	parameter: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>The description for the approvals:</p><ul><li><span>Plain text</span></li><li>Can use any character set supported by your Confluence server &#x2013; except some&#xA0;<a href="/display/CWL/Reserved+Characters">reserved characters</a></li></ul></div>
	 */
	description: string;

	/**
	 * @type {string}
	 * <p>Requires that the content has the specified label for the approval to be active.</p><ul class="ak-ul"><li><p>only one label can be used</p></li><li><p>the label cannot contain , !, #, &amp;, (, ), *, ,, ., :, ;, &lt;, &gt;, ?, @, [, ], ^</p></li><li><p>the label cannot be negated</p></li></ul><p>If the content does not have the specified label:</p><ul><li>the Approve/Reject buttons&#xA0;are disabled.</li><li>reviewers cannot be manually assigned to the approval if the approval includes <code>assignable=true</code></li><li>if the approval is one of several approvals in a state (<a href="/display/CDML/Adding+Multiple+Reviews">multiple reviews</a>) it is not required for the transition</li></ul><p>If the addition of the specified label is a requirement for the the approval to be undertaken then u<span>se the </span><strong><code>haslabel</code></strong><span> condition instead. See:&#xA0;</span><a href="/display/CDML/Conditions">Conditions</a><span>.&#xA0;</span></p>
	 */
	label: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Optionally define additional requirements which must be met prior to content approval &#x2013; see: <a href="/display/CDML/Conditions">Conditions</a>.</p><p>If one or more conditions are not met, the Approve/Reject buttons will be disabled. However, reviewer assignment will still be possible.</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Adding+Multiple+Reviews">Adding Multiple Reviews</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Communardo+Metadata+for+Confluence+app">Communardo Metadata for Confluence app</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Make+tasks+disable+a+review">Make tasks disable a review</a> </div> </li> </ul><p></p></div>
	 */
	Conditions: string;

	/**
	 * @type {boolean}
	 * <div class="content-wrapper"><p>Can the user assign reviewers?</p><ul><li><code><strong>true</strong></code> &#x2013; Yes, they can assign reviewers</li><li><code><strong>false</strong></code> &#x2013; No</li></ul><p>Note: Assignees must have permission to edit the content and also be member of <a href="https://confluence.atlassian.com/doc/confluence-groups-139478.html" class="external-link" rel="nofollow"><code>confluence-users</code> group</a> as a minimum. Other parameters relating to reviewers may enforce further restrictions.</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Adding+Multiple+Reviews">Adding Multiple Reviews</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+different-space+publishing">Advanced different-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+remote-space+publishing">Advanced remote-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Assignment+Examples">Assignment Examples</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/State+expiry+dates">State expiry dates</a> </div> </li> </ul><p></p></div>
	 */
	assignable: boolean;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>To what extent do reviewers need to confirm their identity when reviewing?</p><ul><li><strong><code>0</code></strong> &#x2013; <strong>must be logged in</strong> (member of <a href="https://confluence.atlassian.com/doc/confluence-groups-139478.html" class="external-link" rel="nofollow"><code>confluence-users</code> group</a>)</li><li><strong><code>1</code></strong> &#x2013; additionally, must confirm <strong>Password / Signing Token</strong></li><li><strong><code>2</code></strong> &#x2013; additionally, must confirm <strong>Username</strong></li></ul><p>The requirements stack, so a value of <code>2</code> would mean: Logged in + Password / Signing Token + Username.</p><p>The method of authentication can be configured globally. The options above for the credential password can be set to be based on either:</p><ul><li><em style="letter-spacing: 0.0px;">a user&apos;s Confluence credentials</em></li><li><em>a signing token generated by a third-party app.</em></li></ul><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Reviewer+Authentication">Reviewer Authentication</a> </div> </li> </ul><p></p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/E-Signatures">E-Signatures</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/E-Signatures+Configuration+-+Global">E-Signatures Configuration - Global</a> </div> </li> </ul><p></p></div>
	 */
	credentials: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>List users who are not allowed to review.</p><ul><li>A comma-separated list of usernames.</li><li>Supports <a href="/display/CDML/Value+References">Value References</a> (for example: <code><strong>@author@</strong></code> to prevent content author from reviewing)</li></ul><p>Note: While excluded users are not able to be assigned or Approve/Reject, they can still assign other users as reviewers where applicable (eg. if the <strong><code>assignable=true</code></strong> is used).</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Assignment+Examples">Assignment Examples</a> </div> </li> </ul><p></p></div>
	 */
	exclude: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Reviewers must be a member of the specified user group(s):</p><ul><li>A comma-separated list of group names<sup>&#x2021;</sup></li><li>Supports <a href="/display/CDML/Value+References">Value References</a></li></ul><p><span>Note: Users who do not have </span><a href="/display/CDML/Roles+and+Permissions">Edit content permission</a><span> will not be allowed to review.</span></p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Adding+Multiple+Reviews">Adding Multiple Reviews</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Assignment+Examples">Assignment Examples</a> </div> </li> </ul><p></p></div>
	 */
	group†: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Define the minimum number of reviewers required for the content review to be approved.</p><ul><li>Default is at least one user must approve</li><li><span style="color: rgb(23,43,77);">If you need more users, then specify</span>&#xA0;number&#xA0;<span style="color: rgb(23,43,77);"><span>&#xA0;</span>&#x2265;</span>&#xA0;2</li><li>Supports <a href="/display/CDML/Value+References">Value References</a> (v4.18+)</li></ul><p>If more than the minimum number of users are assigned as reviewers then all assignees must undertake and agree the approval.</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Adding+Multiple+Reviews">Adding Multiple Reviews</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Assignment+Examples">Assignment Examples</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Fast-tracked+Rejections">Fast-tracked Rejections</a> </div> </li> </ul><p></p></div>
	 */
	minimum: string;

	/**
	 * @type {boolean}
	 * <div class="content-wrapper"><p>Remember the assignees for reviews with this name?</p><ul><li><strong><code>true</code></strong> &#x2013; any subsequent reviews in the workflow that have the same name as this review (as defined by <em>unnamed first parameter</em>) will automatically have the same reviewers assigned (&quot;sticky assignees&quot;)</li><li><strong><code>false</code></strong> &#x2013; don&apos;t remember assignees</li></ul><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/State+expiry+dates">State expiry dates</a> </div> </li> </ul><p></p></div>
	 */
	rememberassignees: boolean;

	/**
	 * @type {boolean}
	 * <p>Enable approval roles feature</p><ul><li><strong><code>true</code></strong> &#x2013; <a href="/display/CDML/Reviews#Reviews-ApprovalRole">approval roles</a> are enabled, users assigning a review will be able to record the role that the reviewer is performing</li><li><strong><code>false</code></strong> &#x2013; approval roles are dis<span class="inline-comment-marker" data-ref="4bc38691-efd5-409a-8502-fb9f32a93f0b">abled</span></li></ul>
	 */
	roles: boolean;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>A single reviewer must be assigned from the list:</p><ul><li>A comma-separated list of usernames and/or group names</li><li>Group names are treated as &quot;a list of usernames&quot;</li><li>Supports <a href="/display/CDML/Value+References">Value References</a></li></ul><p><span>Note: Users who do not have </span><a href="/display/CDML/Roles+and+Permissions">Edit content permission</a><span> will not be allowed to review.</span></p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Assignment+Examples">Assignment Examples</a> </div> </li> </ul><p></p></div>
	 */
	selectedapprover†: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>One or more reviewers must be assigned from the list:</p><ul><li>A comma-separated list of usernames and/or group names<sup>&#x2021;</sup></li><li>Group names are treated as &quot;a list of usernames&quot;</li><li>Supports <a href="/display/CDML/Value+References">Value References</a></li></ul><p>Note: Users who do not have <a href="/display/CDML/Roles+and+Permissions">Edit content permission</a> will not be allowed to review.</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Assignment+Examples">Assignment Examples</a> </div> </li> </ul><p></p></div>
	 */
	selectedapprovers†: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Reviewers must be in the specified list:</p><ul><li>A comma-separated list of usernames<sup>&#x2021;</sup></li><li>Supports <a href="/display/CDML/Value+References">Value References</a></li></ul><p><span>Note: Users who do not have </span><a href="/display/CDML/Roles+and+Permissions">Edit content permission</a><span> will not be allowed to review.</span></p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Adding+Multiple+Reviews">Adding Multiple Reviews</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Assignment+Examples">Assignment Examples</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Communardo+Metadata+for+Confluence+app">Communardo Metadata for Confluence app</a> </div> </li> </ul><p></p></div>
	 */
	user†: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Assigners must be in the specified list:</p><ul><li>A comma-separated list of usernames</li><li>Supports <a href="/display/CDML/Value+References">Value References</a></li></ul><p>Note</p><ul><li>Users who do not have <a href="/display/CDML/Roles+and+Permissions">Edit content permission</a> will not be allowed to assign. It can be used along with the <code>allowedassigngroups</code> parameter.</li><li>Adding this parameter does not disable the review for users who&#xA0;have <a href="/display/CDML/Roles+and+Permissions">Edit content permission</a>&#xA0;until a reviewer has been assigned. To prevent the review from being undertaken before assignment of a reviewer, use this parameter in conjunction with one of&#xA0; <code>selectedapprover&#xA0;</code>or&#xA0; <code>selectedapprovers&#xA0;</code>parameters.</li></ul><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Assignment+Examples">Assignment Examples</a> </div> </li> </ul><p></p></div>
	 */
	allowedassignusers: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Assigners <span>must be a member of the specified user group(s):</span></p><ul><li>A comma-separated list of <span> group names</span></li><li>Supports <a href="/display/CDML/Value+References">Value References</a></li></ul><p>Note</p><ul><li>Users who do not have <a href="/display/CDML/Roles+and+Permissions">Edit content permission</a> will not be allowed to assign. It can be used along with the <code>allowedassigngroups</code> parameter.</li><li>Adding this parameter does not disable the review for users who&#xA0;have <a href="/display/CDML/Roles+and+Permissions">Edit content permission</a>&#xA0;until a reviewer has been assigned. To prevent the review from being undertaken before assignment of a reviewer, use this parameter in conjunction with one of&#xA0; <code>selectedapprover&#xA0;</code>or&#xA0; <code>selectedapprovers&#xA0;</code>parameters.</li></ul><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Assignment+Examples">Assignment Examples</a> </div> </li> </ul><p></p></div>
	 */
	allowedassigngroups: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Set the caption of the Approve button.</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+different-space+publishing">Advanced different-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+remote-space+publishing">Advanced remote-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Customise+Approval+Buttons">Customise Approval Buttons</a> </div> </li> </ul><p></p></div>
	 */
	approvelabel: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>Set the caption of the Reject button.</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+different-space+publishing">Advanced different-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+remote-space+publishing">Advanced remote-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Customise+Approval+Buttons">Customise Approval Buttons</a> </div> </li> </ul><p></p></div>
	 */
	rejectlabel: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p>When using multiple <strong><code>{approval}</code></strong> macros inside a single <strong><code>{state}</code></strong>, you can use this parameter to set the <em>initial</em> display order.</p><ul><li>Number &#x2265; <code>1</code></li><li>Valid values in range of <code>1 &#x2192; 2<sup>32</sup></code></li><li>For best results, use multiples of 40.</li><li>Items of the same weight will be ordered alphabetically <code><span>A</span><span>&#x2192;Z</span></code></li><li>Completed reviews will bubble to the top of the list, in order of completion</li></ul><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Adding+Multiple+Reviews">Adding Multiple Reviews</a> </div> </li> </ul><p></p></div>
	 */
	weight: string;

	/**
	 * @type {string}
	 * <div class="content-wrapper"><p><span class="status-macro aui-lozenge aui-lozenge-success conf-macro output-inline" data-hasbody="false" data-macro-name="status">PUBLISHED</span> Use the <strong><code>final</code></strong> parameter on the published <a href="/display/CDML/state+macro"><code><strong>{state}</strong></code> macro</a> instead &#x2013; see <a href="/display/CDML/Publishing">Publishing</a>.</p></div>
	 */
	final: string;

}