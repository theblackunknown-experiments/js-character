/**
 * Game general utilities function,
 * Some prototype initialization may happen here
 */
var gameUtilities = (function generalUtilities() {
	'use strict';

	/**
	 * Clean way of removing an element from an array, once
	 * @param {Object} e - element to be remove
	 */
	Array.prototype.contains = function arrayContains(e) {
		return this.indexOf(e) > -1;
	};

	/**
	 * Clean way of removing an element from an array, once
	 * @param {Object} e - element to be remove
	 */
	Array.prototype.remove = function arrayRemove(e) {
		var index;
		if ((index = this.indexOf(e)) > -1) {
			return [].splice.call(this, index, 1);
		} else {
			return null;
		}
	};

	Object.prototype.getType =	function getType() {
		var typeExtraction = /^\[\w+\s(\w+)\]$/,
			instanceDescription = Object.prototype.toString.call(this);
		if( typeExtraction.test(instanceDescription) ) {
			return typeExtraction.exec(instanceDescription)[1];
		} else {
			return 'undefined';
		}
	};

	Object.clone =	function clone2(o) {
		var a;
		switch(o.getType()) {
			case 'Date':
				return new Date(o.getTime());
			case 'Array':
				a = [];
				break;
			case 'Object':
				a = {};
				break;
			case 'Function':
			default:
				return o;
		}
		for (var i in o) {
		  if (o.hasOwnProperty(i)) {
			  a[i] = clone2(o[i]);
		  }
		}
		return a;
	};

	/**
	 * Check that given param is set
	 * @param {Object} definedObject - defined parameter
	 * @param {String} errorMessage - error message if parameter is not set
	 */
	function required(definedObject, errorMessage) {
		if (definedObject === undefined) {
			throw new ReferenceError('Non defined object - ' + errorMessage);
		}
		return definedObject;
	}

	/**
	 * Check if a given value is specified or provide a default value instead
	 * @param {Object} expected - expected value
	 * @param {String} defaultValue - defaultValue
	 */
	function getOrElse(expected, defaultValue) {
		required(defaultValue,
				'A default value wasn\'t provided : \'' + defaultValue + '\'');
		return (expected === undefined)
				? defaultValue
				: expected;
	}

	return {
		required : required,
		getOrElse : getOrElse
	};
}());