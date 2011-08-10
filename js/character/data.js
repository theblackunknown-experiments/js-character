// ECMAScript 5 strict mode, function mode.
'use strict';

/**
 * General game data and validation function
 */
var gameData = (function gameSpecificData() {

	/**
	 * Existing items
	 */
	const ITEM = {
		NOTHING : 0
	};

	/**
	 * Existing spells
	 */
	const SPELL = {
		NONE : 0
	};

	/**
	 * Possible states
	 */
	const STATE = {
		NORMAL : 0,
		MOVING : 1
	};

	/**
	 * Character Types
	 */
	const CHARACTER_TYPE = {
		HERO : 1
	};

	/**
	 * Possible actions
	 */
	const ACTION = {
		BACK_TO_NORMAL : 0,
		MOVE_RIGHT : 1,
		MOVE_LEFT : 2,
		MOVE_BACKGROUND : 3,
		MOVE_FOREGROUND : 4
	};


	function checkHandler(expectedHandler) {
		if (typeof expectedHandler !== 'function')
			throw new Exception('Given handler is not a function : ' + (typeof expectedHandler));
	}

	function isSpecificData(data, expected) {
		for each (var code in data)
			if (code === expected)
				return true;
		return false;
	}

	function isItem(expectedItem) {
		return isSpecificData(ITEM, expectedItem);
	}

	function isSpell(expectedSpell) {
		return isSpecificData(SPELL, expectedSpell);
	}

	function isState(expectedState) {
		return isSpecificData(STATE, expectedState);
	}

	function isCharacterType(expectedCharacterType) {
		return isSpecificData(CHARACTER_TYPE, expectedCharacterType);
	}

	function isAction(expectedAction) {
		return isSpecificData(ACTION, expectedAction);
	}

	return {
		ITEM : ITEM,
		SPELL : SPELL,
		STATE : STATE,
		CHARACTER_TYPE : CHARACTER_TYPE,
		ACTION : ACTION,
		checker : {
			isHandler : checkHandler,
			isItem : isItem,
			isSpell : isSpell,
			isState : isState,
			isCharacterType : isCharacterType,
			isAction : isAction
		}
	};

}());