/**
 * User: blackpanther
 * Date: 8/15/11
 * TODO Look for a data:url solution if image number is kept low and images are small
 * https://developer.mozilla.org/en/Canvas_tutorial/Using_images
 */

var imageManager = (function initializeImageManager(){
    'use strict';

    /**
     * Sequence of preferred extensions to load image * in case a
     choice is given */
    var imageExtensionsPreferences = [
    'png', 'gif', 'jpeg', 'bmp'
    ];

    /**
    * Load required image
    * @synchronous
    * @param imageURI - required image URI
    */
    function getImage(imageURI,callback) {
        var loadedImage,
        realCallback;

        //image not yet cached
        if(gameImages[imageURI] === undefined) {

            //build image loading callback
            realCallback =
                function (imageContainerReference) {
                    if(typeof callback == 'function') {
                        callback();
                    } imageContainerReference.loaded = true;
                };

            //load it manually
            loadedImage = new Image(); //attach a reference in the cache
            gameImages[imageURI] = {
                sourceImage : loadedImage, 
                loaded : false
            };
            //attach callback
            loadedImage.onload = realCallback(gameImages[imageURI]);
            //at last, load it
            loadedImage.src = imageURI;

        }

        return gameImages[imageURI];
    }

    /**
    * Load specific part of the sprite map as an image,
    * thus create the necessary rendered graphic for character's state.
    *
    * This loader is mean to be called only when the image is needed.
    * TODO Explore caching strategy,
    * @param {String} imageURI - character's sprite map URI
    * @param {Object} location - location on the map of the corresponding
    * rectangle in character map
    * {
    *   {Number} x : _abscissa position_,
    *   {Number} y : _ordinate position_,
    *   {Number} width : _graphic width_,
    *   {Number} height : _graphic height_
    * }
    */
    function getSprite(imageURI,location,callback) {
        return getImage(imageURI[imageURI]).getSprite(location);
    }

    var gameImages = {};

    return {
        getImage : getImage
    }
}());

/**
 * Constructor responsible for character's graphic setting
 * @param {Object} characterSkeleton - character model built by 'characterDataGenerator'
 * @param {Object} mapSlicing - properties are state's name of {Object} describing reference of a specific part of the image,
 *                              which point to a character graphic. Index are corresponding state code
 * {
 *      {String} spriteType : 'single',
 *      {Number} x : _abscissa position_,
 *      {Number} y : _ordinate position_,
 *      {Number} width : _graphic width_,
 *      {Number} height : _graphic height_
 * }
 * {
 *      {String} spriteType : 'sequence',
 *      {Number} current : _current sprite being displayed_,
 *      {Array} sequence : [
 *      {
 *          {String} spriteType : 'single',
 *          {Number} x : _abscissa position_,
 *          {Number} y : _ordinate position_,
 *          {Number} width : _graphic width_,
 *          {Number} height : _graphic height_
 *      }, ... ]
 * }
 */
function characterVisualGenerator(characterSkeleton, spriteMap, mapSlicing) {
    'use strict';

    /**
     * Initialize mapping between character's state and corresponding image in the character's sprite map
     * Mapping exists to know which image to display when the character is in a specific state.
     *
     * For now, mapping is an object which properties are state's names
     * with minimal information to load itself the image :
     * {
     *      {String} state : {Object} reference in the character's map of state's corresponding graphic(s)
     * }
     */
    function initializeStateSpriteMapping() {
        var mapping = { };
        try {
            for(var stateCode in gameData.CHARACTER_STATES) {
                if (gameData.CHARACTER_STATES.hasOwnProperty(stateCode)) {
                    //checking
                    mapping[gameData.CHARACTER_STATES[stateCode]] = mapSlicing[gameData.CHARACTER_STATES[stateCode]];
                }
            }
        } catch(error) {
            throw new ReferenceError(
                    'Following state is not include in the sprite map slicing : '
                    + stateCode);
        } return mapping;
    }

    characterSkeleton.extends({
        graphic : {
            spriteMap : spriteMap,
            slicing : initializeStateSpriteMapping()
        }
    }, true);

    return characterSkeleton;
}
