/**
 * User: blackpanther
 * Date: 8/15/11
 */

var gameEngine = (function initializeGameEngine(window){
    'use strict';

    /*
     * Cross-browser compatibility to enable animation
     * https://developer.mozilla.org/en/DOM/window.mozRequestAnimationFrame
     */
    var requestAnimationFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                 window.setTimeout(callback, 1000 / 60);
              };
    })();
    if( window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame) {
        console.log('requestanimationframe activated');
    }

    function registerAgent(character) {
        agents.push(character);
    }

    /*
     * TODO Test how character is searched through array...
     */
    function unregisterAgent(character) {
        agents.remove(character);
    }

    function startRendering() {
        console.debug('Engine state : ', engine);
        switch(engine.rendering.running){
            case false:
                engine.rendering.running = true;
                performance.rendering.renderStart = +new Date;
                performance.fps.watcherTimer = setInterval(watchPerformance,1000);
                requestAnimationFrame(drawScene);
                break;
            default:
                break;
        }
    }

    function stopRendering() {
        switch(engine.rendering.running){
            case true:
                clearInterval(performance.fps.watcherTimer);
                engine.rendering.running = false;
                document.getElementById('canvas-fps').innerHTML = '-';
                document.getElementById('canvas-render-time').innerHTML = '-';
                performance.rendering.renderStart = undefined;
                performance.rendering.lastRender = undefined;
            default:
        }
    }

    function watchPerformance() {
        var render = performance.rendering;

        document.getElementById('canvas-fps').innerHTML =
            performance.fps.frameNumber;

        if( render.timeToRender != undefined )
            document.getElementById('canvas-render-time').innerHTML = 
                render.timeToRender;

        if( render.renderStart != undefined
                && render.lastRender != undefined)
            document.getElementById('canvas-render-uptime').innerHTML = 
                render.lastRender - render.renderStart;

        performance.fps.frameNumber = 0;
    }

    function drawScene() {

        function renderImage(context,imagePath,location,canvasPosition) {
            context.drawImage(
                    imageManager.getImage(imagePath).sourceImage,
                    location.x,
                    location.y,
                    location.width,
                    location.height,
                    canvasPosition.x,
                    canvasPosition.y,
                    //TODO Make the character have its own volume, 
                    // or maybe better its own ratio depending on initial image
                    location.width * 3,
                    location.height * 3
            );
        }

        function drawCharacter(context,character) {
            
            var graphics = character.graphic,
                slice = graphics.slicing[character.condition.state];

            console.debug('Currently drawing : ', character.name);
            console.debug(
                    'Character analysis :', 
                    "\nState : ", character.condition.state,
                    "\nSlicing : ", slice
            );
            
            switch(slice.type){
                case 'single':
                    renderImage(
                            context,
                            character.graphic.spriteMap,
                            slice,
                            character.position
                    );
                    break;
                case 'sequence':
                    //set current image in the sequence
                    slice.current =
                            slice.current == undefined
                                ? 0
                                : ( slice.current + 1 ) % slice.size;
                    var currentSpriteIndex = slice.current,
                        currentLocation = 
                            slice.sequence[currentSpriteIndex];

                    console.debug(
                            'Sequence, ', slice.sequence,
                            'Current index : ', currentSpriteIndex, 
                            'Sprite : ', currentLocation);
                    renderImage(
                            context,
                            character.graphic.spriteMap,
                            currentLocation,
                            character.position
                    );
            }

        }

        var time0 = +new Date,
            delay = 80;
        
        if( performance.rendering.lastRender != undefined
            && time0 - performance.rendering.lastRender < delay) {

            requestAnimationFrame(drawScene);

        } else {

            var canvas = document.getElementById('game-playground'),
                ctx = canvas.getContext('2d');

            //1. clear canvas
            //TODO Try 'copy'
            //https://developer.mozilla.org/en/Canvas_tutorial%3aCompositing
            ctx.globalCompositeOperation = 'destination-over';
            ctx.clearRect(0,0,
                    +canvas.getAttribute('width'),
                    +canvas.getAttribute('height')
            );

            console.debug('Agents : ', agents);
            var index = agents.length;
            while(index--){
                var agent = agents[index];
                drawCharacter(ctx,agent);
            }

            //timing
            //recompute now because render may have been expensive
            var time1 = +new Date;
            performance.rendering.lastRender = time1;
            performance.rendering.timeToRender = time1 - time0;
            //fps
            performance.fps.frameNumber++;
            //keep drawing if render is not paused
            engine.rendering.running && requestAnimationFrame(drawScene);
        }
    }
    
    var agents = [],
        scenes = undefined,
        performance = {
            fps : {
                frameNumber : 0,
                watcherTimer : undefined
            },
            rendering : {
                renderStart : undefined,
                lastRender : undefined,
                timeToRender : undefined
            }
        },
        engine = {
            agents : {
                register : registerAgent,
                unregister : unregisterAgent
            },
            rendering : {
                running : false,
                play : startRendering,
                pause : stopRendering
            }
        };

    return engine;
}(window));
