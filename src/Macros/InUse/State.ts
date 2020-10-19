import Tag from '../../Tag';

export default class State extends Tag {
  /**
   * @type {string}
   * This parameter is REQUIRED.
   * <p>Name of the workflow state:</p><ul><li>Within a <strong><code>{workflow}</code></strong> macro, each <strong><code>{state}</code></strong> macro must be given a unique name</li><li>The name can use any character set supported by your Confluence server &#x2013; except some <a href="/display/CDML/Reserved+Characters">reserved characters</a>.</li></ul><p>In addition to being used for <a href="/display/CDML/Transitions">transitions</a>, <a href="/display/CDML/Events">event</a> <a href="/display/CDML/trigger+macro">triggers</a>, etc., the state name is also shown in many aspects of the <a href="/display/CDML/User+Guide">user interface</a> and <a href="/display/CDML/Reporting+Guide">reporting</a>.</p>
   */
  name: string;
  
  /**
   * @type {string}
   * <div class="content-wrapper"><p>Can be empty, or one or more of the following macros:</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/approval+macro">approval macro</a> <span class="smalltext">&#x2014; Add content-focussed reviews to states</span> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/state-selection+macro">state-selection macro</a> <span class="smalltext">&#x2014; Specify direct state transitions</span> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/task+macro">task macro</a> <span class="smalltext">&#x2014; Add tasks to workflow states</span> </div> </li> </ul><p></p></div>
   */
  body: string;
  
  /**
   * @type {string}
   * <div class="content-wrapper"><p>If a <a href="/display/CDML/approval+macro">content review</a> is Approved, which state should the workflow transition to?</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+different-space+publishing">Advanced different-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+remote-space+publishing">Advanced remote-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Communardo+Metadata+for+Confluence+app">Communardo Metadata for Confluence app</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Customise+Approval+Buttons">Customise Approval Buttons</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Fast-tracked+Rejections">Fast-tracked Rejections</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Reviewer+Authentication">Reviewer Authentication</a> </div> </li> </ul><p></p><p><a href="/display/CDML/Concepts">Concepts</a>: <a href="/display/CDML/Transitions">Transitions</a>, <a href="/display/CDML/Reviews">Reviews</a></p></div>
   */
  approved: string;
  
  /**
   * @type {string}
   * <div class="content-wrapper"><p>If a <a href="/display/CDML/approval+macro">content review</a> is Rejected, which state should the workflow transition to?</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+different-space+publishing">Advanced different-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+remote-space+publishing">Advanced remote-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Communardo+Metadata+for+Confluence+app">Communardo Metadata for Confluence app</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Customise+Approval+Buttons">Customise Approval Buttons</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Fast-tracked+Rejections">Fast-tracked Rejections</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Reviewer+Authentication">Reviewer Authentication</a> </div> </li> </ul><p></p><p><a href="/display/CDML/Concepts">Concepts</a>: <a href="/display/CDML/Transitions">Transitions</a>, <a href="/display/CDML/Reviews">Reviews</a></p></div>
   */
  rejected: string;
  
  /**
   * @type {string}
   * <div class="content-wrapper"><p>Define a single state to transition to from the current state.</p><p>Note: This causes a drop-down menu to appear in the <a href="/display/CDML/Workflow+Popup">Workflow Popup</a> to allow direct transition to that state.</p><p>See also: <strong><code>hideselection</code></strong> parameter, <a href="/display/CDML/state-selection+macro"><code><strong>{state-selection}</strong></code> macro</a></p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Adding+Multiple+Reviews">Adding Multiple Reviews</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+different-space+publishing">Advanced different-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+remote-space+publishing">Advanced remote-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Fast-tracked+Rejections">Fast-tracked Rejections</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Require+Parameters+on+State+Transitions">Require Parameters on State Transitions</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/State+expiry+dates">State expiry dates</a> </div> </li> </ul><p></p><p><a href="/display/CDML/Concepts">Concepts</a>: <a href="/display/CDML/Transitions">Transitions</a></p></div>
   */
  submit: string;
  
  /**
   * @type {string}
   * <div class="content-wrapper"><p>If the associated content is edited (updated), which state should the workflow transition to?</p><ul><li>Moving the page will not trigger the <code>updated</code> transition (v4.5+) &#x2013; you can use the <a href="/display/CDML/Events"><strong><code>pagemoved</code></strong> event</a> if you require such functionality.</li><li>Link updates due to moving pages (eg. to another space) or renaming of other pages will not trigger the <code>updated</code> transition (v4.5+)</li></ul><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+different-space+publishing">Advanced different-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+remote-space+publishing">Advanced remote-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Communardo+Metadata+for+Confluence+app">Communardo Metadata for Confluence app</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Fast-tracked+Rejections">Fast-tracked Rejections</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/State+expiry+dates">State expiry dates</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/StiltSoft+Talk+app">StiltSoft Talk app</a> </div> </li> </ul><p></p><p><a href="/display/CDML/Concepts">Concepts</a>: <a href="/display/CDML/Transitions">Transitions</a></p></div>
   */
  updated: string;
  
  /**
   * @type {string}
   * <div class="content-wrapper"><p>Require a given list of workflow parameters to be set before transitioning into this state.</p><ul><li>Comma separated list of parameter names</li><li>Workflow parameters must be defined in the existing workflow and have the edit=true condition set to be valid.</li><li>Note that users will only be prompted to enter parameters when the workflow transitions via a user action, like an approval or state submission. Internal state changes from triggers will not prompt for the required parameters.</li></ul><p><br></p></div>
   */
  requiredparams: string;
  
  /**
   * @type {boolean}
   * <div class="content-wrapper"><p>Can users set and/or change the <strong><code>duedate</code></strong> for this state?</p><ul><li><code><strong>true </strong></code>&#x2013; yes, they can change it &#x2013; see: <a href="/display/CDML/State+expiry+date">State expiry date</a></li><li><code><strong>false </strong></code>&#x2013; no, they can&apos;t</li></ul><p>Note: Can be used with or without the <strong><code>duedate</code></strong> parameter. See <strong>Editing duedate</strong> section below parameter table for more information.</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/State+expiry+dates">State expiry dates</a> </div> </li> </ul><p></p><p><a href="/display/CDML/Concepts">Concepts</a>: <a href="/display/CDML/Expiry+Dates">Expiry Dates</a></p></div>
   */
  changeduedate: boolean;
  
  /**
   * @type {string}
   * <div class="content-wrapper"><p>If defined, the state will be given an expiry date.</p><ul><li>Format can be either:<ul><li>Explicit date in the format: <span style="font-family: SFMono-Medium , &quot;SF Mono&quot; , &quot;Segoe UI Mono&quot; , &quot;Roboto Mono&quot; , &quot;Ubuntu Mono&quot; , Menlo , Courier , monospace;"><strong>DD.MM.YYYY</strong></span> (v4.12+)</li><li>ISO 8601 Duration Period</li><li>See <a href="/display/CDML/Expiry+Dates">Expiry Dates</a> for more information</li></ul></li><li>Supports <a href="/display/CDML/Value+References">Value References</a></li></ul><p>Note: The due date will be logged in the <a href="/display/CDML/Activity+Report+-+Content">Activity Report - Content</a> when the state is entered (v4.5.1+)</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Communardo+Metadata+for+Confluence+app">Communardo Metadata for Confluence app</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Expiry+Dates">Expiry Dates</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/State+expiry+dates">State expiry dates</a> </div> </li> </ul><p></p><p><a href="/display/CDML/Concepts">Concepts</a>: <a href="/display/CDML/Expiry+Dates">Expiry Dates</a></p></div>
   */
  duedate: string;
  
  /**
   * @type {string}
   * <div class="content-wrapper"><p>The state to change into if the page expires after its <strong><code>duedate</code></strong> (regardless of how the due date was set).</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Communardo+Metadata+for+Confluence+app">Communardo Metadata for Confluence app</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/State+expiry+dates">State expiry dates</a> </div> </li> </ul><p></p><p><a href="/display/CDML/Concepts">Concepts</a>: <a href="/display/CDML/Transitions">Transitions</a>, <a href="/display/CDML/Expiry+Dates">Expiry Dates</a></p></div>
   */
  expired: string;
  
  /**
   * @type {string}
   * <div class="content-wrapper"><p>The state to change into if all the tasks in the state are completed.</p><p> </p><div class="content-by-label macro-blank-experience conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <strong class="content-label-header">Content by label</strong> <p>There is no content with the specified labels</p> </div><p></p><p><a href="/display/CDML/Concepts">Concepts</a>: <a href="/display/CDML/Transitions">Transitions</a>, <a href="/display/CDML/Tasks">Tasks</a></p></div>
   */
  completed: string;
  
  /**
   * @type {boolean}
   * <p>Whether or not tasks can be manually defined in this state via the <strong>Tasks</strong> button.</p><p><a href="/display/CDML/Concepts">Concepts</a>: <a href="/display/CDML/Tasks">Tasks</a></p>
   */
  taskable: boolean;
  
  /**
   * @type {boolean}
   * <div class="content-wrapper"><p>Should content in this state be considered &quot;Published&quot;?</p><ul><li><code><strong>true</strong></code> &#x2013; yes, this state is published</li><li><code><strong>false</strong></code> &#x2013; no, this state is draft (unpublished)</li></ul><p>Setting to <strong><code>true</code></strong> will cause all other non-final states in the workflow to be treated as drafts (unpublished content). By default, users with view-only permission can not see draft content, they can only see the most recently published version of content.</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+different-space+publishing">Advanced different-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+remote-space+publishing">Advanced remote-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Communardo+Metadata+for+Confluence+app">Communardo Metadata for Confluence app</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Fast-tracked+Rejections">Fast-tracked Rejections</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/State+expiry+dates">State expiry dates</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/StiltSoft+Talk+app">StiltSoft Talk app</a> </div> </li> </ul><p></p><p><a href="/display/CDML/Concepts">Concepts</a>: <a href="/display/CDML/Publishing">Publishing</a>, <a href="/display/CDML/Roles+and+Permissions">Roles and Permissions</a></p></div>
   */
  final: boolean;
  
  /**
   * @type {boolean}
   * This parameter is REQUIRED.
   * <div class="content-wrapper"><p>When using this parameter, the <strong><code>final</code></strong> parameter must be removed.</p><p> </p><div class="content-by-label macro-blank-experience conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <strong class="content-label-header">Content by label</strong> <p>There is no content with the specified labels</p> </div><p></p><p><a href="/display/CDML/Concepts">Concepts</a>: <a href="/display/CDML/Publishing">Publishing</a></p></div>
   */
  versioncompleted: boolean;
  
  /**
   * @type {string}
   * <div class="content-wrapper"><p>By default, states are coloured as described in <a href="/display/CDML/Status+Indicator+Circles">Status Indicator Circles</a>, namely:</p><ul><li><span style="color: rgb(51,102,255);"><strong>Blue</strong></span> &#x2013; there is no <strong><code>final=true</code></strong> state in the workflow</li><li><strong><span style="color: rgb(255,153,0);">Orange</span></strong> &#x2013; there is a <strong><code>final=true</code></strong> state, but the current state isn&apos;t that state</li><li><strong><span style="color: rgb(51,153,102);">Green</span></strong> &#x2013; the current state is <strong><code>final=true</code></strong></li></ul><p>If desired, you can override the colour of individual states by specifying a colour in one of the following formats:</p><ul><li><strong>#rrggbb </strong>&#x2013; Hexadecimal representation of RGB (Red, Green, Blue) color space &#x2013; see: <a href="https://htmlcolorcodes.com/color-chart/" class="external-link" rel="nofollow">Color Picker</a></li><li><strong><em>name </em></strong>&#x2013; A valid <a href="https://htmlcolorcodes.com/color-names/" class="external-link" rel="nofollow">HTML Color Name</a></li></ul><p>Note: Invalid colour specifications will default to <strong>Grey</strong>. See also: <a href="/display/CDML/Confused+States+-+Grey+Circle">Confused States - Grey Circle</a>.</p><p>Tip: <a href="https://www.w3schools.com/colors/colors_schemes.asp" class="external-link" rel="nofollow">Triadic colour schemes</a> yield good visual colour segregation.</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+different-space+publishing">Advanced different-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+remote-space+publishing">Advanced remote-space publishing</a> </div> </li> </ul><p></p></div>
   */
  colour: string;
  
  /**
   * @type {string}
   * <div class="content-wrapper"><p>Add a <strong>plain text</strong> description to the <a href="/display/CDML/Workflow+Popup">Workflow Popup</a> when this state is active.</p><p><span>Supports </span><a href="/display/CDML/Value+References">Value References</a>.</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+different-space+publishing">Advanced different-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+remote-space+publishing">Advanced remote-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/State+expiry+dates">State expiry dates</a> </div> </li> </ul><p></p></div>
   */
  description: string;
  
  /**
   * @type {boolean}
   * <div class="content-wrapper"><p>Should the state be hidden from the Progress Tracker bar on the <a href="/display/CDML/Workflow+Popup">Workflow Popup</a>?</p><ul><li><code><strong>true</strong></code> &#x2013; yes, hide it</li><li><code><strong>false</strong></code> &#x2013; no, show it</li></ul><p>Note: The state will still appear in the tracker bar when the workflow is in that state.</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+different-space+publishing">Advanced different-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+remote-space+publishing">Advanced remote-space publishing</a> </div> </li> </ul><p></p><p>See also: <strong><code>progresstracker</code></strong> parameter on <a href="/display/CDML/workflow+macro"><strong><code>{workflow}</code></strong> macro</a>.</p></div>
   */
  hidefrompath: boolean;
  
  /**
   * @type {boolean}
   * <div class="content-wrapper"><p>By default, direct state transition buttons (to every other state in the workflow) will be added to the <a href="/display/CDML/Workflow+Popup">Workflow Popup</a>, unless you specify any of the following parameters: <strong><code>approved</code></strong>, <strong><code>rejected</code></strong>, <strong><code>submit</code></strong>, <strong><code>updated</code></strong>, <strong><code>expired</code></strong> or <strong><code>completed</code></strong>.</p><p>If none of those parameters are specified, should the default buttons be hidden?</p><ul><li><code><strong>true</strong></code> &#x2013; hide default state transition buttons</li><li><code><strong>false</strong></code> &#x2013; show default state transition buttons, if applicable</li></ul><p>Alternatively, you can use a <a href="/display/CDML/state-selection+macro"><code><strong>{state-selection}</strong></code> macro</a> to specify which direct state transition buttons should be shown.</p><p></p><ul class="content-by-label conf-macro output-block" data-hasbody="false" data-macro-name="contentbylabel"> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+different-space+publishing">Advanced different-space publishing</a> </div> </li> <li> <div> <span class="icon aui-icon content-type-page" title="Page">Page:</span> </div> <div class="details"> <a href="/display/CDML/Advanced+remote-space+publishing">Advanced remote-space publishing</a> </div> </li> </ul><p></p><p><a href="/display/CDML/Concepts">Concepts</a>: <a href="/display/CDML/Transitions">Transitions</a></p></div>
   */
  hideselection: boolean;
  
}