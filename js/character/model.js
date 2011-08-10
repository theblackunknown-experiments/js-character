/**
 * the intent in this file, is to centralize everything
 * related to character modelisation only,
 * no graphic rendering.
 *
 * subsections :
 *    - space position
 *    - health
 *    - state
 *    - interactions
 */

// ECMAScript 5 strict mode, function mode.
'use strict';

//FIXME Define a utilities namespace


/**  */
/**
 * Character's constructor,
 * data about character dimension will be provided later by graphics constructor
 * @param initialParameters -
 *     contains data about :
 *         //TODO information about the canvas size : tag's id selector ?
 *         where to place the character in the canvas
 *     {
 *      position : {
 *          abscissa : "integer" _character's start abscissa_,
 *          ordinate : "integer" _character's start ordinate_,
 *          layer : "integer" _character's start layer_
 *      }
 *     }
 */
function characterDataGenerator(initialParameters) {

	/**
	 * collections of function that are launch when a specific actions is triggered
	 * index : action's code
	 * value : array (behaving like a queue) of handler
	 */
	//TODO Some default handler may be required ?
	var actionsHandlers = initializeActionsHandlers();

	/**
	 * Simple initialize function,
	 * create the described structure above based on ACTION constant object
	 */
	function initializeActionsHandlers() {
		var handlers = [];
		for each (var actionCode in gameData.ACTION) {
			handlers[actionCode] = [];
		}
		return handlers;
	}

	/**
	 * Trigger the specified action and thus the handler's queue
	 * @param {Number} action - target action to be triggered
	 *
	 */
	function triggerAction(action) {
		var cursor,
			specificActionHandlers = actionsHandlers[action];

		//checking
		gameUtilities.required(action, 'Target action not specified');
		if (!gameData.checker.isAction(action))
			throw new Exception('Given action is not a valid action : ' + action);

		//TODO More attention required by handler-side effect, for example character's state change
		for (cursor = 0; cursor < specificActionHandlers.length; cursor++)
			specificActionHandlers[cursor]();
	}

	/**
	 * Register an handler to a specific action,
	 * the handler will be queued, if not already present, to the existing list of handler
	 * @param {Number} action - trigger action
	 * @param {Function} handler - handler to execute, data passed to the handler is the whole character structure
	 */
	function registerActionHandler(action, handler) {
		//checking
		gameUtilities.required(action, 'Target action not specified');
		gameUtilities.required(handler, 'Action\'s handler not specified');
		if (!gameData.checker.isAction(action))
			throw new Exception('Given action is not a valid action : ' + action);
		if (!gameData.checker.isHandler(handler))
			throw new Exception('Given handler is not a valid handler : ' + handler);

		var targetedActionHandlers = actionsHandlers[action];
		if (!targetedActionHandlers.contains(handler)) {
			targetedActionHandlers.push(handler);
		}
	}

	/**
	 * Unregister an handler from a specific action,
	 * the handler will be queued, if not already present, to the existing list of handler
	 * @param {Number} action - trigger action
	 * @param {Function} handler - handler to execute, data passed to the handler is the whole character structure
	 */
	function unregisterActionHandler(action, handler) {
		//checking
		gameUtilities.required(action, 'Target action not specified');
		gameUtilities.required(handler, 'Action\'s handler not specified');
		if (!gameData.checker.isAction(action))
			throw new Exception('Given action is not a valid action : ' + action);
		if (!gameData.checker.isHandler(handler))
			throw new Exception('Given handler is not a valid handler : ' + handler);

		var targetedActionHandlers = actionsHandlers[action];
		if (targetedActionHandlers.contains(handler)) {
			targetedActionHandlers.remove(handler);
		}
	}

	return {
		type : gameData.CHARACTER_TYPE.HERO,
		//HELP (0,0) refers to a bottom left of a container
		position : {
			x : gameUtilities.getOrElse(initialParameters.position.abscissa, 0),
			y : gameUtilities.getOrElse(initialParameters.position.ordinate, 0),
			layer : gameUtilities.required(initialParameters.position.layer,
					'A layer must be provided for the creation of a character')
		},
		condition : {
			life : 100,
			state : gameData.STATE.NORMAL
		},
		inventory : {
			leftHand : gameData.ITEM.NOTHING,
			rightHand : gameData.ITEM.NOTHING,
			magic : gameData.SPELL.NONE
		},
		actions : {
			doAction : triggerAction,
			register : registerActionHandler,
			unregister : unregisterActionHandler
		}
	};
}