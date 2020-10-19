import Tag from '../../Tag';

class GetMetadata extends Tag {
	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <p>The metadata or value reference to display:</p><ul><li>Workflow Parameter Name</li><li>Value Name</li><li>Supplier Reference</li><li>etc.</li></ul><p>Note: Do <strong><u>not</u></strong> enclose the value reference in <code><strong>@</strong></code> (&quot;at&quot;) symbols.</p>
	 */
	name: string;

}
