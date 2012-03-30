/**
 * © Glan Thomas 2012
 */

define('views/Canvas', function () {
    'use strict';

    var template = '<div id="top-rule"></div><div id="left-rule"></div><div id="left-rule-marker"></div><div id="top-rule-marker"></div><div class="back" style="width: 800px; height: 600px;"><div id="canvas"></div></div>';

    function Canvas(frame) {
        frame.insertAdjacentHTML('afterbegin', template);
        this.domElement = document.getElementById('canvas');
        // Prevent mouse down events propergating up to the document level.
        document.getElementById('canvas').addEventListener('mousedown', function (event) {
             event.stopPropagation();
        });

        frame.onselectstart = function () { return false; };

        frame.addEventListener('mousemove', function (event) {
            // [TODO] Don't hard code 280 and 50 px offsets
            document.getElementById('top-rule-marker').style.width = event.clientX - 280 + 'px';
            document.getElementById('left-rule-marker').style.height = event.clientY - 50 + 'px';
        });

        frame.addEventListener('mouseout', function (event) {
            document.getElementById('top-rule-marker').style.display = 'none';
            document.getElementById('left-rule-marker').style.display = 'none';
        });

        frame.addEventListener('mouseover', function (event) {
            document.getElementById('top-rule-marker').style.display = 'block';
            document.getElementById('left-rule-marker').style.display = 'block';
        });

    }

    var canvas = {
        render : function (css) {
            this.domElement.setAttribute('style',PrefixFree.prefixCSS(css));
        },
        getDomElement : function () {
            return this.domElement;
        },
        setWidth : function (w) {
            var ww = Math.round(((50 - (w/2)) % 50)) - 25;
            this.domElement.parentNode.style.width = w + 'px';
            document.getElementById('top-rule').style.backgroundImage = PrefixFree.prefixCSS(
            ' repeating-linear-gradient(left, #333 '+ (ww-1) +'px, #333 '+ (ww) +'px, #555 '+ (ww) +'px, #555 '+ (ww+1) +'px, transparent '+ (ww+1) +'px, transparent '+ (ww+9) +'px),'+
            ' repeating-linear-gradient(left, #333 '+ (ww-1) +'px, #333 '+ (ww) +'px, #555 '+ (ww) +'px, #555 '+ (ww+1) +'px, transparent '+ (ww+1) +'px, transparent '+ (ww+49) +'px)');
            document.getElementById('top-rule').style.minWidth = w + 'px';
        },
        setHeight : function (h) {
            var hh = Math.round(((50 - (h/2)) % 50)) - 25;
            this.domElement.parentNode.style.height = h + 'px';
            document.getElementById('left-rule').style.backgroundImage = PrefixFree.prefixCSS(
            ' repeating-linear-gradient(top, #333 '+ (hh-1) +'px, #333 '+ (hh) +'px, #555 '+ (hh) +'px, #555 '+ (hh+1) +'px, transparent '+ (hh+1) +'px, transparent '+ (hh+9) +'px),'+
            ' repeating-linear-gradient(top, #333 '+ (hh-1) +'px, #333 '+ (hh) +'px, #555 '+ (hh) +'px, #555 '+ (hh+1) +'px, transparent '+ (hh+1) +'px, transparent '+ (hh+49) +'px)');
            document.getElementById('left-rule').style.minHeight = h + 'px';
        }
    }

    Canvas.prototype = canvas;
    return Canvas;
});