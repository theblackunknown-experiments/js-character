/**
 * the intent in this file, is to centralize everything
 * related to character model only,
 * no graphic rendering.
 *
 * subsections :
 *    - space position
 *    - health
 *    - state
 *    - events
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
                state : gameData.CHARACTER_STATES.MOVING_RIGHT
            },
            inventory : {
                leftHand : gameData.ITEMS.NONE,
                rightHand : gameData.ITEMS.NONE,
                magic : gameData.SPELLS.NONE
            },
            events : {
                doEvent : handleEvent,
                register : registerEventHandler,
                unregister : unregisterEventHandler
            }
        },
        eventHandlers = initializeEventsHandlers();

    /**
     * Handle the specified event and thus execute the handler's queue
     * @param {Number} event - target event to be handled
     */
    function handleEvent(event) {
        var cursor, length,
            specificEventHandlers = eventHandlers[event],
            characterCopy;

        /**
         * Compute change only if values differ
         * @param former - previous property's value
         * @param latter - new property's value
         * @param computation - optional complex computation, or simple assignment if none provided
         */
        function computeChange(former, latter, computation) {
            var realComputation = computation || function simpleAssignment(newValue) {
                return newValue;
            };
            if(latter !== undefined) {
                if( former !== latter && getTypeOf(former) === getTypeOf(latter) ) {
                    return realComputation(latter);
                }
            }
            return former;
        }

        /**
         * Compute position changes,
         * COLLISIONS ARE RESOLVED BY GAME ENGINE
         */
        function computePositionChanges(former,latter) {
            if (latter === undefined) {
                return former;
            } else {
                return {
                    x : computeChange(former.x, latter.x),
                    y : computeChange(former.y, latter.y),
                    layer : computeChange(former.layer, latter.layer)
                };
            }
        }

        /**
         * Compute condition changes
         */
        function computeConditionChanges(former,latter) {
            if (latter === undefined) {
                return former;
            } else {
                return {
                    life : computeChange(former.life, latter.life, function lifeDecrease(lifeValue){
                        return (lifeValue < 0)
                            ? 0
                            : lifeValue;
                    }),
                    state : computeChange(former.state, latter.state, function stateChange(newState){
                        return gameData.checker.isCharacterState(newState)
                             ? newState
                             : gameData.CHARACTER_STATES.BACK_TO_NORMAL;
                    })
                };
            }
        }

        /**
         * Compute inventory changes
         */
        function computeInventoryChanges(former,latter) {

            function handChange(newHandItem) {
                return gameData.checker.isItem(newHandItem)
                    ? newHandItem
                    : gameData.ITEMS.NONE;
            }

            if (latter === undefined) {
                return former;
            } else {
                return {
                    leftHand : computeChange(former.leftHand, latter.leftHand, handChange),
                    rightHand : computeChange(former.rightHand, latter.rightHand, handChange),
                    magic : computeChange(former.magic, latter.magic, function spellChange(newSpell){
                        return gameData.checker.isSpell(newSpell)
                        ? newSpell
                        : gameData.SPELLS.NONE;
                    })
                };
            }
        }

        /**
         * Check if given character is still alive
         */
        function alive(characterReference) {
            var characterCondition = characterReference.condition;
            return characterCondition.state != gameData.CHARACTER_STATES.DEAD
                && characterCondition.life > 0;
        }

        //checking
        if (!gameData.checker.isEvent(event)) {
            throw new TypeError('Given event is not a valid event : ' + event);
        }

        for (cursor = 0, length = specificEventHandlers.length; cursor < length; cursor++) {
            //dump real character
            characterCopy = {
                name : character.name,
                type : character.type,
                position : {
                    x : character.position.x,
                    y : character.position.y,
                    layer : character.position.layer
                },
                condition : {
                    life : character.condition.life,
                    state : character.condition.state
                },
                inventory : {
                    leftHand : character.inventory.leftHand,
                    rightHand : character.inventory.rightHand,
                    magic : character.inventory.magic
                }
            };
            //pass it to handler
            specificEventHandlers[cursor](characterCopy);
            //compute differences
            character.position = computePositionChanges(character.position,characterCopy.position);
            character.condition = computeConditionChanges(character.condition,characterCopy.condition);
            character.inventory = computeInventoryChanges(character.inventory,characterCopy.inventory);

            //TODO Resolved here or by game engine ?
            if (!alive(character))
                break;
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
        gameUtilities.required(event, 'Targeted event not specified : ' + event);
        gameUtilities.required(handler, 'Event\'s handler not specified');
        if (!gameData.checker.isEvent(event)) {
            throw new TypeError('Given event is not a valid event : ' + event);
        }
        if (!gameData.checker.isHandler(handler)) {
            throw new TypeError('Given handler is not a valid handler : ' + handler);
        }

        console.debug('Caller is ', this);
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
        gameUtilities.required(event, 'Targeted event not specified : ' + event);
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
