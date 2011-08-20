/**
 * Game general utilities function,
 * Some prototype initialization may happen here
 */
var gameUtilities = (function generalUtilities(window) {
    'use strict';

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
            return Array.prototype.splice.call(this, index, 1);
        } else {
            return null;
        }
    };

    function extendStructureTo(sourceObject, extensionPoint, deepCopy) {
        var needDeepCopy = ( getType(deepCopy) == 'boolean' && deepCopy );
        required(typeof sourceObject == 'object',
                'Source must be an object');
        required(typeof extensionPoint == 'object',
                'Extension must be an object');

        console.log('Extending ', sourceObject, ' to ', extensionPoint, ' with deep copy ? ', needDeepCopy);

        for (var property in extensionPoint) {
            console.log('Property name : ', property,
                        'Property value : ', extensionPoint[property],
                        'Own property ? ', extensionPoint.hasOwnProperty(property),
                        'Need to go deeper ? ', ( needDeepCopy && (typeof extensionPoint[property] == 'object') )
            );
            if (extensionPoint.hasOwnProperty(property)) {
                if( needDeepCopy && (typeof extensionPoint[property] == 'object') ) {
                    sourceObject[property] = Object.create(null);
                    extendStructureTo(sourceObject[property], extensionPoint[property], true)
                } else {
                    sourceObject[property] = extensionPoint[property];
                }
            }
        }
    }

    function getType(caller) {
        var that = caller || this,
            typeExtraction = /^\[\w+\s(\w+)\]$/,
            instanceDescription = Object.prototype.toString.call(that);
        switch(typeof that){
            case 'object':
                if( typeExtraction.test(instanceDescription) ) {
                    return (typeExtraction.exec(instanceDescription)[1]).toLowerCase();
                } else {
                    return 'undefined';
                }
            default :
                return typeof that;
        }

    }

    Object.prototype.extends = function extendThisTo(extensionPoint,deepCopy) {
        extendStructureTo(this, extensionPoint, deepCopy);
    }

    Object.extend = extendStructureTo;

    Object.prototype.getType = getType;

    window.getTypeOf = getType;

    Object.clone =	function clone2(o) {
        var a;
        switch(o.getType()) {
            case 'date':
                return new Date(o.getTime());
            case 'array':
                a = [];
                break;
            case 'object':
                a = {};
                break;
            case 'function':
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

    return Object.freeze({
        required : required,
           getOrElse : getOrElse,
           nullFunction : function (){}
    });
}(window));
