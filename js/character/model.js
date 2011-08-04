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
 
 /** Character's constructor */
 /**
  * @param initialParameters - 
  *     contains data about :
  *         //TODO information about the canvas size : tag's id selector ?
  *         where to place the character in the canvas
  */
 function characterGenerator(initialParameters) {
     
     function required(definedObject,reason) {
         if(typeof definedObject === 'undefined')
            throw new Exception('Non defined object - ' + reason);
         return definedObject;
     }
    
    /**
     * Teste si une valeur est renseignée sinon donne une valeur par défaut
     */
    function getOrElse(expected,defaultValue) {
        required(defaultValue,
            'A defaut value wasn't provided : \'' + defaultValue + '\'');
        return (typeof expected === 'undefined')
            ? defaulValue
            : expected;
    }

    return {
        //HELP (0,0) refers to a bottom left of a container
        position : {
           x : getOrElse(initialParameters.position.abscissa,0),
           y : getOrElse(initialParameters.position.ordinate,0),
           layer : required(initialParameters.position.layer,
                    'A layer must be provided for the creation of a character)
        },
    }
 }