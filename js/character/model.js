/**
 * the intent in this file, is to centralize everything
 * related to character model only,
 * no graphic rendering.
 *
 * subsections :
 *    - space position
 *    - health
 *    - state
 *    - interevents
 */

/**
 * Character's constructor,
 * data about character dimension will be provided later by graphics constructor
 * @param initialParameters -
 *     {
 *         name : {String} character name
 *         position : {
 *             abscissa : {Number} character's start abscissa,
 *             ordinate : {Number}  character's start ordinate,
 *             layer : {Number} character's start layer
 *         },
 *         type : {Number} character's type
 *     }
 */
function characterModelGenerator(initialParameters) {
	'use strict';

	/**
	 * Simple initialize function,
	 * create the described structure above based on game's events
	 */
	function initializeEventsHandlers() {
		var handlers = [],
			eventCode;
		for (eventCode in gameData.EVENTS) {
			handlers[gameData.EVENTS[eventCode]] = [];
		}

		return handlers;
	}

	var defaults = {
			position : {
				x : 0,
				y : 0
			},
			condition : {
				life : 100
			}
		},
		character = {
			name : gameUtilities.required(initialParameters.name,
						'A name must be provided for the creation of a character'),
			type : gameUtilities.required(initialParameters.type,
						'A character\'s type must be provided for the creation of a character'),
			position : {
				x : gameUtilities.getOrElse(initialParameters.position.x, defaults.position.x),
				y : gameUtilities.getOrElse(initialParameters.position.y, defaults.position.y),
				layer : gameUtilities.required(initialParameters.position.layer,
						'A layer must be provided for the creation of a character')
			},
			condition : {
				life : defaults.condition.life,
				state : gameData.CHARACTER_STATES.NORMAL
			},
			inventory : {
				leftHand : gameData.ITEMS.NOTHING,
				rightHand : gameData.ITEMS.NOTHING,
				magic : gameData.SPELLS.NONE
			},
			events : {
				doEvent : triggerEvent,
				register : registerEventHandler,
				unregister : unregisterEventHandler
			}
		},
		eventHandlers = initializeEventsHandlers();

	/**
	 * Trigger the specified event and thus the handler's queue
	 * @param {Number} event - target event to be triggered
	 */
	function triggerEvent(event) {
		var cursor, length,
			specificEventHandlers = eventHandlers[event],
			//TODO Make an inline copy of only necessary data
			characterCopy = Object.clone(character);

		//checking
		if (!gameData.checker.isEvent(event)) {
			throw new TypeError('Given event is not a valid event : ' + event);
		}

		for (cursor = 0, length = specificEventHandlers.length; cursor < length; cursor++) {
			specificEventHandlers[cursor](characterCopy);
			//TODO More attention required by handler-side effect, for example character's state change
			//TODO Computation : State resolution, Life decreasing, etc...
			//TODO Quick-end if character died
		}
	}

	/**
	 * Register an handler to a specific event,
	 * the handler will be queued, if not already present, to the existing list of handler
	 * @param {Number} event - trigger event
	 * @param {Function} handler - handler to execute, data passed to the handler is the whole character structure
	 */
	function registerEventHandler(event, handler) {
		//checking
		gameUtilities.required(event, 'Target event not specified');
		gameUtilities.required(handler, 'Event\'s handler not specified');
		if (!gameData.checker.isEvent(event)) {
			throw new TypeError('Given event is not a valid event : ' + event);
		}
		if (!gameData.checker.isHandler(handler)) {
			throw new TypeError('Given handler is not a valid handler : ' + handler);
		}

		var targetedEventHandlers = eventHandlers[event];
		if (!targetedEventHandlers.contains(handler)) {
			targetedEventHandlers.push(handler);
		}
	}

	/**
	 * Unregister an handler from a specific event,
	 * the handler will be queued, if not already present, to the existing list of handler
	 * @param {Number} event - trigger event
	 * @param {Function} handler - handler to execute, data passed to the handler is the whole character structure
	 */
	function unregisterEventHandler(event, handler) {
		//checking
		gameUtilities.required(event, 'Target event not specified');
		gameUtilities.required(handler, 'Event\'s handler not specified');
		if (!gameData.checker.isEvent(event)) {
			throw new TypeError('Given event is not a valid event : ' + event);
		}
		if (!gameData.checker.isHandler(handler)) {
			throw new TypeError('Given handler is not a valid handler : ' + handler);
		}

		var targetedEventHandlers = eventHandlers[event];
		if (targetedEventHandlers.contains(handler)) {
			targetedEventHandlers.remove(handler);
		}
	}

	return character;
}
