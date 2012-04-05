/**
 * © Glan Thomas 2012
 */

define('views/Marquee', ['models/Rect'], function (Rect) {
    'use strict';

    var template = '\
    <div id="size-helper">\
        <div id="ants"></div>\
        <div class="resize-helper" id="resize-helper-nw" data-type="nw-resize"></div>\
        <div class="resize-helper" id="resize-helper-ne" data-type="ne-resize"></div>\
        <div class="resize-helper" id="resize-helper-sw" data-type="sw-resize"></div>\
        <div class="resize-helper" id="resize-helper-se" data-type="se-resize"></div>\
        <div class="resize-helper" id="resize-helper-n" data-type="n-resize"></div>\
        <div class="resize-helper" id="resize-helper-e" data-type="e-resize"></div>\
        <div class="resize-helper" id="resize-helper-s" data-type="s-resize"></div>\
        <div class="resize-helper" id="resize-helper-w" data-type="w-resize"></div>\
    </div>';

    function Marquee(canvas) {
        canvas.getDomElement().insertAdjacentHTML('beforeend', template);
        this.canvas = canvas;
        this.domElement = document.getElementById('size-helper');
        this.domElement.style.display = 'none';
        this.visible = false;
        document.addEventListener('mousedown', this, true);
        document.addEventListener('mouseup', this, true);
        document.addEventListener('mousemove', this, true);
        document.addEventListener('keydown', this);
    }

    var marquee = {
        // blank hit test function for overriding
        hitTest : function (xy) {
            return xy;
        },
        setHitTest : function (func) {
            this.hitTest = func;
        },
        setRect : function (rect) {
            this.rect = rect;
            this.drawRect();
        },

        drawRect : function () {
            var localRect = this.rect.denormalize(this.canvas.getWidth(), this.canvas.getHeight());
            this.domElement.style.left = localRect.getLeft().toString();
            this.domElement.style.top = localRect.getTop().toString();
            this.domElement.style.width = localRect.getWidth().toString();
            this.domElement.style.height = localRect.getHeight().toString();

            clearTimeout(this.timeout);
            document.getElementById('ants').className = 'animate';
            // Stop the ants from marching after 30 seconds to save CPU cycles.
            this.timeout = setTimeout(function() {
                document.getElementById('ants').className = '';
            }, 30000);
        },

        hideRect : function () {
            //[TODO] should remove event bindings
            this.visible = false;
            this.domElement.style.display = 'none';
        },

        showRect : function () {
            this.visible = true;
            this.domElement.style.display = 'block';
        },

        handleEvent : function (event) {
            if (this.visible) {
                switch(event.type) {
                case 'keydown' :
                    this.keydown(event);
                    break;
                case 'mousedown' :
                    this.mousedown(event);
                    break;
                case 'mouseup' :
                    this.mouseup(event);
                    break;
                case 'mousemove' :
                    if (this.action) {
                        this.mousemove(event);
                    }
                    break;
                }
            }
        },

        keydown : function (event) {
            var inc = ((event.shiftKey) ? 10 : 1);
            if (event.srcElement === document.body) {
                switch ('' + event.keyCode) {
                case '37':
                    this.rect.getLeft().setValue(1 * this.rect.getLeft().getValue() - inc);
                break;
                case '38':
                    this.rect.getTop().setValue(1 * this.rect.getTop().getValue() - inc);
                    break;
                case '39':
                    this.rect.getLeft().setValue(1 * this.rect.getLeft().getValue() + inc);
                    break;
                case '40':
                    this.rect.getTop().setValue(1 * this.rect.getTop().getValue() + inc);
                    break;
                default:
                    return;
                }
                this.dispacheEvent('move');
                this.dispacheEvent('end');
                this.drawRect();
            }
        },

        mousedown : function (event) {
            this.initRect = this.rect.denormalize(this.canvas.getWidth(), this.canvas.getHeight());
            this.startX = event.x;
            this.startY = event.y;
            if (event.target.id === 'size-helper' || event.target.id === 'ants' ) {
                this.action = 'move';
                $(document.body).addClass('moving');
                this.dispacheEvent('movestart');
            } else if (event.target.className === 'resize-helper') {
                this.action = 'resize';
                this.actionType = event.target.getAttribute('data-type');
                $(document.body).addClass('resizing-' + this.actionType);
                this.dispacheEvent('resizestart');
            }
        },

        mouseup : function (event) {
            if (this.action) {
                this.dispacheEvent('end');
                this.action = false;
                $(document.body).removeClass('resizing-' + this.actionType);
                $(document.body).removeClass('moving');
            }
        },

        mousemove : function (event) {
            // [TODO] deal with rects which % rather than px
            var normRect, newRect = this.rect.denormalize(this.canvas.getWidth(), this.canvas.getHeight()),
                x = newRect.getLeft().getValue(),
                y = newRect.getTop().getValue(),
                w = newRect.getWidth().getValue(),
                h = newRect.getHeight().getValue(),
                dx = event.x - this.startX,
                dy = event.y - this.startY,
                checkHeight = false, 
                checkWidth = false, 
                aspect = this.initRect.getAspect(),
                obj;

            if (this.action === 'move') {
                x = this.initRect.getLeft().getValue() + dx;
                y = this.initRect.getTop().getValue() + dy;

                obj = this.hitTest({x:x,y:y});
                x = obj.x;
                y = obj.y;
                
                newRect.getLeft().setValue(x);
                newRect.getTop().setValue(y);

                normRect = newRect.normalize(this.canvas.getWidth(), this.canvas.getHeight());

                this.rect.setLeft((this.rect.getLeft().getUnit() === '%') ? normRect.getLeft() : newRect.getLeft());
                this.rect.setTop((this.rect.getTop().getUnit() === '%') ? normRect.getTop() : newRect.getTop());

                //console.log(this.rect);
                this.dispacheEvent('move');
            } else if (this.action === 'resize') {
                w = this.initRect.getWidth().getValue();
                h = this.initRect.getHeight().getValue();

                switch (this.actionType) {
                    case 'se-resize' :
                        w = w + dx;
                        h = h + dy;
                        obj = this.hitTest({x:w,y:h});
                        w = obj.x;
                        h = obj.y;
                    break;
                    case 'e-resize' :
                        w = w + dx
                        obj = this.hitTest({x:w,y:h});
                        w = obj.x;
                    break;
                    case 's-resize' :
                        h = h + dy;
                        obj = this.hitTest({x:w,y:h});
                        h = obj.y;
                    break;
                    case 'sw-resize' :
                        h = h + dy;
                        checkWidth = true;
                        obj = this.hitTest({x:w,y:h});
                        h = obj.y;
                    break;
                    case 'ne-resize' :
                        w = w + dx;
                        checkHeight = true;
                    break;
                    case 'n-resize' :
                        checkHeight = true;
                    break;
                    case 'w-resize' :
                        checkWidth = true;
                    break;
                    case 'nw-resize' :
                        checkHeight = true;
                        checkWidth = true;
                    break;
                }

                if (checkHeight) {
                    h = h - dy;
                    if (h<1) {
                        y = this.initRect.getTop().getValue() + dy + h;
                        h = 1;
                    } else {
                        y = this.initRect.getTop().getValue() + dy;
                    }
                    obj = this.hitTest({x:x,y:y});
                    h = h + y - obj.y;
                    y = obj.y;
                }
                if (checkWidth) {
                    w = w - dx;
                    if (w<1) {
                        x = this.initRect.getLeft().getValue() + dx + w;
                        w = 1;
                    } else {
                        x = this.initRect.getLeft().getValue() + dx;
                    }
                    obj = this.hitTest({x:x,y:y});
                    w = w + x - obj.x;
                    x = obj.x;
                }

                if (event.shiftKey || this.lockAspect)
                {
                    switch (this.actionType) {
                        case 'se-resize' :
                            if (aspect > 1) {
                                h = w / aspect;
                            } else {
                                w = h * aspect;
                            }
                        break;
                        case 'e-resize' :
                            h = w / aspect;
                        break;
                        case 's-resize' :
                            w = h * aspect;
                        break;
                        case 'n-resize' :
                            w = h * aspect;
                        break;
                        case 'w-resize' :
                            h = w / aspect;
                        break;
                        case 'ne-resize' :
                            if (aspect > 1) {
                                y = y + (h - w / aspect);
                                h = w / aspect;
                            } else {
                                w = h * aspect;
                            }
                        break;
                        case 'sw-resize' :
                            if (aspect > 1) {
                                 h = w / aspect;
                            } else {
                                x = x + (w - h * aspect);
                                w = h * aspect;
                            }
                        break;
                        case 'nw-resize' :
                            if (aspect > 1) {
                                y = y + (h - w / aspect);
                                h = w / aspect;
                            } else {
                                x = x + (w - h * aspect);
                                w = h * aspect;
                            }
                        break;
                    }
                }
                w = (w>1) ? w : 1;
                h = (h>1) ? h : 1;
                
                newRect.getLeft().setValue(x);
                newRect.getTop().setValue(y);
                newRect.getWidth().setValue(w);
                newRect.getHeight().setValue(h);

                normRect = newRect.normalize(this.canvas.getWidth(), this.canvas.getHeight());
                this.rect.setLeft((this.rect.getLeft().getUnit() === '%') ? normRect.getLeft() : newRect.getLeft());
                this.rect.setTop((this.rect.getTop().getUnit() === '%') ? normRect.getTop() : newRect.getTop());
                this.rect.setWidth((this.rect.getWidth().getUnit() === '%') ? normRect.getWidth() : newRect.getWidth());
                this.rect.setHeight((this.rect.getHeight().getUnit() === '%') ? normRect.getHeight() : newRect.getHeight());

                this.dispacheEvent('resize');
            }
            this.drawRect();
        },

        dispacheEvent : function (name) {
            var spawnEvent = document.createEvent('UIEvents');
            spawnEvent.initUIEvent("marquee_" + name, true, true, this.domElement, 1);
            spawnEvent.rect = this.rect;
            document.dispatchEvent(spawnEvent);
        }
    }

    Marquee.prototype = marquee;
    return Marquee;
});