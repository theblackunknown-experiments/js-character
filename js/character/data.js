// ECMAScript 5 strict mode, function mode.
'use strict';

/**
 * General game data and validation function
 */
var gameData = (function gameSpecificData() {

	/**
	 * Existing items
	 */
	var gameItems = {
		NOTHING : 0
	};

	/**
	 * Existing spells
	 */
	var gameSpells = {
		NONE : 0
	};

	/**
	 * Possible states
	 */
	var characterStates = {
		NORMAL : 0,
		MOVING : 1
	};

	/**
	 * Character Types
	 */
	var characterTypes = {
		HERO : 1
	};

	/**
	 * Possible actions
	 */
	var characterEvents = {
		BACK_TO_NORMAL : 0,
		MOVE_RIGHT : 1,
		MOVE_LEFT : 2,
		MOVE_BACKGROUND : 3,
		MOVE_FOREGROUND : 4,
		JUMP : 5
	};


	function isHandler(expectedHandler) {
		return typeof expectedHandler == 'function';
	}

	function isSpecificData(data, expected) {
		for (var code in data) {
			if (data[code] === expected) {
				return true;
			}
		}
		return false;
	}

	function isItem(expectedItem) {
		return isSpecificData(gameItems, expectedItem);
	}

	function isSpell(expectedSpell) {
		return isSpecificData(gameSpells, expectedSpell);
	}

	function isCharacterState(expectedState) {
		return isSpecificData(characterStates, expectedState);
	}

	function isCharacterType(expectedCharacterType) {
		return isSpecificData(characterTypes, expectedCharacterType);
	}

	function isEvent(expectedEvent) {
		return isSpecificData(characterEvents, expectedEvent);
	}

	return Object.freeze({
		ITEMS : gameItems,
		SPELLS : gameSpells,
		CHARACTER_STATES : characterStates,
		CHARACTER_TYPES : characterTypes,
		EVENTS : characterEvents,
		checker : Object.freeze({
			isHandler : isHandler,
			isItem : isItem,
			isSpell : isSpell,
			isCharacterState : isCharacterState,
			isCharacterType : isCharacterType,
			isEvent : isEvent
		})
	});

}());
