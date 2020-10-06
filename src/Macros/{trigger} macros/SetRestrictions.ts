import Tag from './Tag'

class SetRestrictions extends Tag {
	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <p>What type of permission to set?</p><ul><li><strong><code>view</code></strong> &#x2013; assign the user/group view permission</li><li><strong><code>edit</code></strong> &#x2013; assign the user/group edit permission</li></ul>
	 */
	type: string;

	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <p>One or more users to assign <code><strong>type</strong></code> permission to:</p><ul><li>Comma-separated list of usernames</li><li>Supports <a href="/display/CDML/Value+References">Value References</a></li></ul>
	 */
	user: string;

	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <p>One or more user groups to assign <code><strong>type</strong></code> permission to:</p><ul><li>Comma-separated list of user groups</li><li>Supports <a href="/display/CDML/Value+References">Value References</a></li></ul>
	 */
	group: string;

}