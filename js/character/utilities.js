// ECMAScript 5 strict mode, function mode.
'use strict';

/**
 * Game general utilities function,
 * Some prototype initialization may happen here
 */
var gameUtilities = (function generalUtilities() {

	/**
	 * Clean way of removing an element from an array, once
	 * credit due to :
	 * http://stackoverflow.com/questions/4825812/clean-way-to-remove-element-from-javascript-array-with-jquery-coffeescript
	 * @param {Object} e - element to be remove
	 */
	Array.prototype.remove = function(e) {
		var t, _ref;
		if ((t = this.indexOf(e)) > -1) {
			return ([].splice.apply(this, [t, t - t + 1].concat(_ref = [])), _ref);
		}
	};

	return {
		/**
		 * Check that given param is set
		 * @param {Object} definedObject - defined parameter
		 * @param {String} errorMessage - error message if parameter is not set
		 */
		required : function required(definedObject, errorMessage) {
			if (typeof definedObject === 'undefined')
				throw new Exception('Non defined object - ' + errorMessage);
			return definedObject;
		},
		/**
		 * Check if a given value is specified or provide a default value instead
		 * @param {Object} expected - expected value
		 * @param {String} defaultValue - defaultValue
		 */
		getOrElse : function getOrElse(expected, defaultValue) {
			required(defaultValue,
					'A defaut value wasn\'t provided : \'' + defaultValue + '\'');
			return (typeof expected === 'undefined')
					? defaultValue
					: expected;
		}
	};
}());