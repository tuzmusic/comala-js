import Tag from './Tag'

class SetStateExpiry extends Tag {
	/**
	 * @type {string}
	 * This parameter is REQUIRED.
	 * <p>Duration until state expiry:</p><ul><li style="list-style-type: none;background-image: none;"><ul><li>Format can be either:<ul><li>Explicit date in the format: <code><strong>YYYY-MM-DD HH:mm</strong></code> (v4.12+)</li><li>ISO 8601 Duration Period</li></ul></li><li>Supports <a href="/display/CDML/Value+References">Value References</a></li><li>See <a href="/display/CDML/Expiry+Dates">Expiry Dates</a> for more information</li></ul></li></ul>
	 */
	duedate: string;

}