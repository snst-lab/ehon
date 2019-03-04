/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/script/canvas.ts":
/*!******************************!*\
  !*** ./src/script/canvas.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar domController_1 = __webpack_require__(/*! ./domController */ \"./src/script/domController.ts\");\r\nvar Canvas;\r\n(function (Canvas) {\r\n    var el = domController_1.DOMController.Selector;\r\n    Canvas.ClassName = 'canvas';\r\n    Canvas.DOM = new el('.' + Canvas.ClassName);\r\n    Canvas.Element = document.querySelector('.' + Canvas.ClassName);\r\n    Canvas.Z = Number(Canvas.Element.style.zIndex);\r\n})(Canvas = exports.Canvas || (exports.Canvas = {}));\r\n\n\n//# sourceURL=webpack:///./src/script/canvas.ts?");

/***/ }),

/***/ "./src/script/componentEditor.ts":
/*!***************************************!*\
  !*** ./src/script/componentEditor.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar canvas_1 = __webpack_require__(/*! ./canvas */ \"./src/script/canvas.ts\");\r\nvar imageCollection_1 = __webpack_require__(/*! ./imageCollection */ \"./src/script/imageCollection.ts\");\r\nvar ComponentEditor;\r\n(function (ComponentEditor) {\r\n    var image = new imageCollection_1.ImageCollection.Controller();\r\n    var keyDown = null;\r\n    var activeStyle = /** @class */ (function () {\r\n        function activeStyle() {\r\n        }\r\n        activeStyle.color = '#00ffdd';\r\n        activeStyle.style = 'solid';\r\n        activeStyle.width = '3px';\r\n        return activeStyle;\r\n    }());\r\n    var params = /** @class */ (function () {\r\n        function params() {\r\n        }\r\n        params.translateXYFine = 0.01;\r\n        params.translateZFine = 0.03;\r\n        params.sizeFine = 0.01;\r\n        params.rotateFine = 0.05;\r\n        params.opacityFine = 0.001;\r\n        params.blurFine = 0.01;\r\n        return params;\r\n    }());\r\n    var keyMap = {\r\n        88: 'x',\r\n        89: 'y',\r\n        90: 'z',\r\n        83: 's',\r\n        82: 'r',\r\n        66: 'b',\r\n        79: 'o'\r\n    };\r\n    var EventHandler = /** @class */ (function () {\r\n        function EventHandler() {\r\n            new detectkeyDown();\r\n            this.defineProperty();\r\n            this.listenCanvasWheel();\r\n            this.listenCanvasClick();\r\n        }\r\n        EventHandler.prototype.listenCanvasWheel = function () {\r\n            canvas_1.Canvas.DOM.on('mousewheel', function (event) {\r\n                event.preventDefault();\r\n                if (imageCollection_1.ImageCollection.Active === null)\r\n                    return;\r\n                switch (keyDown) {\r\n                    case 'x':\r\n                        new translate().x(imageCollection_1.ImageCollection.Active, event.deltaY * params.translateXYFine);\r\n                        break;\r\n                    case 'y':\r\n                        new translate().y(imageCollection_1.ImageCollection.Active, event.deltaY * params.translateXYFine);\r\n                        break;\r\n                    case 'z':\r\n                        new translate().z(imageCollection_1.ImageCollection.Active, event.deltaY * params.translateZFine);\r\n                        break;\r\n                    case 's':\r\n                        new size().change(imageCollection_1.ImageCollection.Active, event.deltaY * params.sizeFine);\r\n                        break;\r\n                    case 'r':\r\n                        new rotate().change(imageCollection_1.ImageCollection.Active, event.deltaY * params.rotateFine);\r\n                        break;\r\n                    case 'b':\r\n                        new blur().change(imageCollection_1.ImageCollection.Active, event.deltaY * params.blurFine);\r\n                        break;\r\n                    case 'o':\r\n                        new opacity().change(imageCollection_1.ImageCollection.Active, event.deltaY * params.opacityFine);\r\n                        break;\r\n                    default:\r\n                        break;\r\n                }\r\n            });\r\n        };\r\n        EventHandler.prototype.listenCanvasClick = function () {\r\n            var _this = this;\r\n            canvas_1.Canvas.DOM.on('click', function (event) {\r\n                event.preventDefault();\r\n                _this.releaseActivate();\r\n            });\r\n        };\r\n        EventHandler.prototype.releaseActivate = function () {\r\n            if (imageCollection_1.ImageCollection.Active !== null) {\r\n                imageCollection_1.ImageCollection.Active.element.style['outline-color'] = '';\r\n                imageCollection_1.ImageCollection.Active.element.style['outline-style'] = '';\r\n                imageCollection_1.ImageCollection.Active.element.style['outline-width'] = '';\r\n                imageCollection_1.ImageCollection.Active = null;\r\n            }\r\n        };\r\n        EventHandler.prototype.defineProperty = function () {\r\n            Object.defineProperty(window, 'onDoubleClick', {\r\n                value: function (event) {\r\n                    new onDoubleClick(event);\r\n                }\r\n            });\r\n        };\r\n        return EventHandler;\r\n    }());\r\n    ComponentEditor.EventHandler = EventHandler;\r\n    var onDoubleClick = /** @class */ (function () {\r\n        function onDoubleClick(event) {\r\n            event.preventDefault();\r\n            this.activate(event);\r\n        }\r\n        onDoubleClick.prototype.activate = function (event) {\r\n            var className = event.target.classList.item(0);\r\n            if (imageCollection_1.ImageCollection.Active !== null && imageCollection_1.ImageCollection.Active.element.className === className)\r\n                return;\r\n            imageCollection_1.ImageCollection.Active = image.select(className);\r\n            imageCollection_1.ImageCollection.Active.element.style['outline-color'] = activeStyle.color;\r\n            imageCollection_1.ImageCollection.Active.element.style['outline-style'] = activeStyle.style;\r\n            imageCollection_1.ImageCollection.Active.element.style['outline-width'] = activeStyle.width;\r\n            imageCollection_1.ImageCollection.All.forEach(function (e) {\r\n                if (e.className !== className) {\r\n                    var deactive = document.querySelector('.' + e.className);\r\n                    deactive.style['outline-color'] = '';\r\n                    deactive.style['outline-style'] = '';\r\n                    deactive.style['outline-width'] = '';\r\n                }\r\n            });\r\n        };\r\n        return onDoubleClick;\r\n    }());\r\n    ComponentEditor.onDoubleClick = onDoubleClick;\r\n    var detectkeyDown = /** @class */ (function () {\r\n        function detectkeyDown() {\r\n            document.addEventListener('keydown', function (event) {\r\n                if (keyDown === null) {\r\n                    keyDown = keyMap[event.keyCode];\r\n                }\r\n            }, false);\r\n            document.addEventListener('keyup', function (event) {\r\n                keyDown = null;\r\n            }, false);\r\n        }\r\n        return detectkeyDown;\r\n    }());\r\n    var translate = /** @class */ (function () {\r\n        function translate() {\r\n        }\r\n        translate.prototype.x = function (selector, delta) {\r\n            selector.component.x += delta * selector.component.z / imageCollection_1.ImageCollection.params.vanishingPoint;\r\n            selector.element.style.setProperty('left', selector.component.x + \"%\", 'important');\r\n        };\r\n        translate.prototype.y = function (selector, delta) {\r\n            selector.component.y += delta * selector.component.z / imageCollection_1.ImageCollection.params.vanishingPoint;\r\n            selector.element.style.setProperty('top', selector.component.y + \"%\", 'important');\r\n        };\r\n        translate.prototype.z = function (selector, delta) {\r\n            selector.component.z = Math.max(selector.component.z + delta, canvas_1.Canvas.Z);\r\n            selector.element.style.setProperty('z-index', \"\" + selector.component.z, 'important');\r\n            var scaleByZtrans = (selector.component.z - canvas_1.Canvas.Z) / (imageCollection_1.ImageCollection.params.initialZ - canvas_1.Canvas.Z);\r\n            var blurByZtrans = Math.abs(selector.component.z - imageCollection_1.ImageCollection.params.initialZ) / imageCollection_1.ImageCollection.params.depthOfField;\r\n            ['', '-webkit-'].forEach(function (prefix) {\r\n                selector.element.style.setProperty(prefix + 'transform', \"scale(\" + scaleByZtrans + \")\", 'important');\r\n                selector.element.style.setProperty(prefix + 'filter', \"blur(\" + (selector.component.blur + blurByZtrans) + \"px)\", 'important');\r\n            });\r\n        };\r\n        return translate;\r\n    }());\r\n    var size = /** @class */ (function () {\r\n        function size() {\r\n        }\r\n        size.prototype.change = function (selector, delta) {\r\n            selector.component.size = Math.max(selector.component.size + delta, 0.01);\r\n            selector.element.style.setProperty('width', selector.component.size + \"%\", 'important');\r\n        };\r\n        return size;\r\n    }());\r\n    var rotate = /** @class */ (function () {\r\n        function rotate() {\r\n        }\r\n        rotate.prototype.change = function (selector, delta) {\r\n            selector.component.rotate = (selector.component.rotate + delta) % 360;\r\n            ['', '-webkit-'].forEach(function (prefix) {\r\n                selector.element.style.setProperty(prefix + 'transform', \"rotate(\" + selector.component.rotate + \"deg)\", 'important');\r\n            });\r\n        };\r\n        return rotate;\r\n    }());\r\n    var blur = /** @class */ (function () {\r\n        function blur() {\r\n        }\r\n        blur.prototype.change = function (selector, delta) {\r\n            selector.component.blur = Math.max(selector.component.blur + delta, 0);\r\n            var blurByZtrans = Math.abs(selector.component.z - imageCollection_1.ImageCollection.params.initialZ) / imageCollection_1.ImageCollection.params.depthOfField;\r\n            ['', '-webkit-'].forEach(function (prefix) {\r\n                selector.element.style.setProperty(prefix + 'filter', \"blur(\" + (selector.component.blur + blurByZtrans) + \"px)\", 'important');\r\n            });\r\n        };\r\n        return blur;\r\n    }());\r\n    var opacity = /** @class */ (function () {\r\n        function opacity() {\r\n        }\r\n        opacity.prototype.change = function (selector, delta) {\r\n            selector.component.opacity = Math.max(selector.component.opacity + delta, 0);\r\n            selector.component.opacity = Math.min(1, selector.component.opacity);\r\n            selector.element.style.setProperty('opacity', \"\" + selector.component.opacity, 'important');\r\n        };\r\n        return opacity;\r\n    }());\r\n})(ComponentEditor = exports.ComponentEditor || (exports.ComponentEditor = {}));\r\n\n\n//# sourceURL=webpack:///./src/script/componentEditor.ts?");

/***/ }),

/***/ "./src/script/domController.ts":
/*!*************************************!*\
  !*** ./src/script/domController.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n/**\r\n### DOMController\r\n    Wrapper of querySelector, appendChild, innerHTML,addEventListener...,etc.\r\n*/\r\nvar DOMController;\r\n(function (DOMController) {\r\n    /**\r\n    ### DOMController.Selector\r\n        Wrapper of querySelector, appendChild, innerHTML,addEventListener...,etc.\r\n    #### Usage\r\n        const p = new DOMController.Selector<string>('p');\r\n        const fragment = new DOMController.Selector<DocumentFragment>();\r\n        for(let i=0;i<10;i++) fragment.render(i);\r\n        p.render(fragment.dom);\r\n        p.at('click',alert('OK'));\r\n    */\r\n    var Selector = /** @class */ (function () {\r\n        function Selector(el) {\r\n            this.parser = new DOMParser();\r\n            this.dom = null;\r\n            if (typeof el === 'string') {\r\n                this.dom = document.querySelector(el);\r\n            }\r\n            else {\r\n                this.dom = document.createDocumentFragment();\r\n            }\r\n        }\r\n        /**\r\n            Wrapper of innerHTML = (string | HTMLElement | DocumentFragment)\r\n        */\r\n        Selector.prototype.render = function (childStr) {\r\n            return this.append(childStr, true);\r\n        };\r\n        /**\r\n            Wrapper of appendChild(string | HTMLElement | DocumentFragment)\r\n        */\r\n        Selector.prototype.append = function (childStr, rewrite) {\r\n            if (typeof childStr === 'undefined')\r\n                return this.dom;\r\n            if (rewrite && this.dom instanceof HTMLElement) {\r\n                this.dom.removeChild(this.dom.firstChild);\r\n                this.dom.appendChild(childStr);\r\n                return this.dom;\r\n            }\r\n            if (typeof childStr === 'string') {\r\n                var fragment = document.createDocumentFragment();\r\n                var collection = this.parser.parseFromString(childStr, 'text/html').body.childNodes;\r\n                var doms = [].slice.call(collection);\r\n                for (var i = 0; i < doms.length; i++)\r\n                    fragment.appendChild(doms[i]);\r\n                if (rewrite)\r\n                    this.dom = fragment;\r\n                else\r\n                    this.dom.appendChild(fragment);\r\n            }\r\n            else {\r\n                if (rewrite)\r\n                    this.dom = childStr;\r\n                else\r\n                    this.dom.appendChild(childStr);\r\n            }\r\n            return this.dom;\r\n        };\r\n        /**\r\n            Wrapper of appendChild(string | Element | DocumentFragment)\r\n        */\r\n        Selector.prototype.prepend = function (childStr, rewrite) {\r\n            if (typeof childStr === 'undefined')\r\n                return this.dom;\r\n            if (rewrite && this.dom instanceof Element) {\r\n                this.dom.removeChild(this.dom.firstChild);\r\n                this.dom.appendChild(childStr);\r\n                return this.dom;\r\n            }\r\n            if (typeof childStr === 'string') {\r\n                var fragment = document.createDocumentFragment();\r\n                var collection = this.parser.parseFromString(childStr, 'text/html').body.childNodes;\r\n                var doms = [].slice.call(collection);\r\n                for (var i = 0; i < doms.length; i++)\r\n                    fragment.insertBefore(doms[i], fragment.firstChild);\r\n                if (rewrite)\r\n                    this.dom = fragment;\r\n                else\r\n                    this.dom.insertBefore(fragment, this.dom.firstChild);\r\n            }\r\n            else {\r\n                if (rewrite)\r\n                    this.dom = childStr;\r\n                else\r\n                    this.dom.insertBefore(childStr, this.dom.firstChild);\r\n            }\r\n            return this.dom;\r\n        };\r\n        /**\r\n            Wrapper of document.addEventListener(eventName, callback, false)\r\n        */\r\n        Selector.prototype.on = function (eventName, callback) {\r\n            if (this.dom !== null)\r\n                switch (eventName) {\r\n                    case 'inview':\r\n                        this.inview(callback);\r\n                        break;\r\n                    case 'outview':\r\n                        this.outview(callback);\r\n                        break;\r\n                    default:\r\n                        this.dom.addEventListener(eventName, callback, false);\r\n                        break;\r\n                }\r\n            else\r\n                document.addEventListener(eventName, callback, false);\r\n        };\r\n        /**\r\n            Wrapper of document.removeEventListener(eventName, callback, false)\r\n        */\r\n        Selector.prototype.off = function (eventName, callback) {\r\n            if (this.dom !== null) {\r\n                this.dom.removeEventListener(eventName, callback, false);\r\n            }\r\n            else\r\n                document.removeEventListener(eventName, callback, false);\r\n        };\r\n        /**\r\n            Use Intersection observer to detect the intersection of an element and a visible region\r\n        */\r\n        Selector.prototype.inview = function (callback, options) {\r\n            options = options || {\r\n                root: null,\r\n                rootMargin: '0%',\r\n                threshold: [0.5] //Callback is called when intersection area changes by 50%\r\n            };\r\n            var observer = new IntersectionObserver(function (entries) {\r\n                for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {\r\n                    var e = entries_1[_i];\r\n                    if (e.isIntersecting) {\r\n                        var ie = e;\r\n                        ie.srcElement = e.target;\r\n                        callback(ie);\r\n                    }\r\n                }\r\n            }, options);\r\n            observer.observe(this.dom);\r\n        };\r\n        /**\r\n            Use Intersection observer to detect the intersection of an element and a visible region\r\n        */\r\n        Selector.prototype.outview = function (callback, options) {\r\n            options = options || {\r\n                root: null,\r\n                rootMargin: '0%',\r\n                threshold: [0.5] //Callback is called when intersection area changes by 50%\r\n            };\r\n            var observer = new IntersectionObserver(function (entries) {\r\n                for (var _i = 0, entries_2 = entries; _i < entries_2.length; _i++) {\r\n                    var e = entries_2[_i];\r\n                    if (!e.isIntersecting) {\r\n                        var ie = e;\r\n                        ie.srcElement = e.target;\r\n                        callback(ie);\r\n                    }\r\n                }\r\n            }, options);\r\n            observer.observe(this.dom);\r\n        };\r\n        return Selector;\r\n    }());\r\n    DOMController.Selector = Selector;\r\n})(DOMController = exports.DOMController || (exports.DOMController = {}));\r\n\n\n//# sourceURL=webpack:///./src/script/domController.ts?");

/***/ }),

/***/ "./src/script/dragEventListner.ts":
/*!****************************************!*\
  !*** ./src/script/dragEventListner.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar canvas_1 = __webpack_require__(/*! ./canvas */ \"./src/script/canvas.ts\");\r\nvar imageCollection_1 = __webpack_require__(/*! ./imageCollection */ \"./src/script/imageCollection.ts\");\r\nvar DragEventListner;\r\n(function (DragEventListner) {\r\n    var image = new imageCollection_1.ImageCollection.Controller();\r\n    var dragstart = { x: 0, y: 0 };\r\n    var dragend = { x: 0, y: 0 };\r\n    var EventHandler = /** @class */ (function () {\r\n        function EventHandler() {\r\n            Object.defineProperty(window, 'onDrop', {\r\n                value: function (event) {\r\n                    new onDrop(event);\r\n                }\r\n            });\r\n            Object.defineProperty(window, 'onDragStart', {\r\n                value: function (event) {\r\n                    new onDragStart(event);\r\n                }\r\n            });\r\n            Object.defineProperty(window, 'onDragEnd', {\r\n                value: function (event) {\r\n                    new onDragEnd(event);\r\n                }\r\n            });\r\n        }\r\n        return EventHandler;\r\n    }());\r\n    DragEventListner.EventHandler = EventHandler;\r\n    var onDrop = /** @class */ (function () {\r\n        function onDrop(event) {\r\n            // console.log(event);\r\n            event.preventDefault();\r\n            this.drop(event);\r\n        }\r\n        onDrop.prototype.drop = function (event) {\r\n            if (event.dataTransfer.items) {\r\n                // Use DataTransferItemList interface to access the file(s)\r\n                for (var i = 0; i < event.dataTransfer.items.length; i++) {\r\n                    // If dropped items aren't files, reject them\r\n                    if (event.dataTransfer.items[i].kind === 'file') {\r\n                        this.createElement(event, event.dataTransfer.items[i].getAsFile());\r\n                    }\r\n                }\r\n            }\r\n        };\r\n        onDrop.prototype.createElement = function (event, file) {\r\n            image.create(file.name, event.offsetX / (canvas_1.Canvas.Element.offsetWidth + canvas_1.Canvas.Element.offsetLeft) * 100, event.offsetY / (canvas_1.Canvas.Element.offsetHeight + canvas_1.Canvas.Element.offsetTop) * 100);\r\n        };\r\n        return onDrop;\r\n    }());\r\n    var onDragStart = /** @class */ (function () {\r\n        function onDragStart(event) {\r\n            // event.preventDefault();\r\n            this.dragStart(event);\r\n        }\r\n        onDragStart.prototype.dragStart = function (event) {\r\n            dragstart.x = event.clientX;\r\n            dragstart.y = event.clientY;\r\n        };\r\n        return onDragStart;\r\n    }());\r\n    var onDragEnd = /** @class */ (function () {\r\n        function onDragEnd(event) {\r\n            event.preventDefault();\r\n            this.translate(event);\r\n        }\r\n        onDragEnd.prototype.translate = function (event) {\r\n            var className = event.target.classList.item(0);\r\n            var selector = image.select(className);\r\n            var dx = event.clientX - dragstart.x;\r\n            var dy = event.clientY - dragstart.y;\r\n            image.translate(selector, dx / canvas_1.Canvas.Element.offsetWidth * 100, dy / canvas_1.Canvas.Element.offsetWidth * 100, 0);\r\n        };\r\n        return onDragEnd;\r\n    }());\r\n})(DragEventListner = exports.DragEventListner || (exports.DragEventListner = {}));\r\n\n\n//# sourceURL=webpack:///./src/script/dragEventListner.ts?");

/***/ }),

/***/ "./src/script/imageCollection.ts":
/*!***************************************!*\
  !*** ./src/script/imageCollection.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar canvas_1 = __webpack_require__(/*! ./canvas */ \"./src/script/canvas.ts\");\r\nvar ImageCollection;\r\n(function (ImageCollection) {\r\n    ImageCollection.ImageSrcPath = 'assets/img/';\r\n    ImageCollection.All = new Array();\r\n    ImageCollection.Active = null;\r\n    var params = /** @class */ (function () {\r\n        function params() {\r\n        }\r\n        params.defaultSize = 50; //per canvas size\r\n        params.initialZ = 100; // from canvas z\r\n        params.focusZ = 100; // from viewer \r\n        params.depthOfField = 100;\r\n        params.vanishingPoint = params.initialZ + params.focusZ;\r\n        return params;\r\n    }());\r\n    ImageCollection.params = params;\r\n    function uniqueString() {\r\n        return new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16);\r\n    }\r\n    ImageCollection.uniqueString = uniqueString;\r\n    var Controller = /** @class */ (function () {\r\n        function Controller() {\r\n        }\r\n        Controller.prototype.create = function (filename, x, y) {\r\n            var className = 'img-' + uniqueString();\r\n            canvas_1.Canvas.DOM.append(\"\\n\\t\\t\\t<img draggable=\\\"true\\\" \\n\\t\\t\\t ondragstart=\\\"onDragStart(event);\\\"\\n\\t\\t\\t ondragend=\\\"onDragEnd(event);\\\"\\n\\t\\t\\t ondblclick=\\\"onDoubleClick(event);\\\"\\n\\t\\t\\t src=\\\"\" + ImageCollection.ImageSrcPath + filename + \"\\\"\\n\\t\\t\\t class=\\\"\" + className + \" component-img\\\" \\n\\t\\t\\t style=\\\"position:absolute;outline:none;\\n\\t\\t\\t left:\" + x + \"%;top:\" + y + \"%;\\n\\t\\t\\t z-index:\" + (params.initialZ + canvas_1.Canvas.Z) + \";\\n\\t\\t\\t width:\" + params.defaultSize + \"%;\\n\\t\\t\\t transform-origin:50% 50%;\\n\\t\\t\\t transform: scale(1);\\n\\t\\t\\t transform: rotate(0deg);\\n\\t\\t\\t filter:blur(0px);\\n\\t\\t\\t opacity:1; \\n\\t\\t\\t \\\">\\n\\t\\t\\t\");\r\n            var component = {\r\n                fileName: filename,\r\n                className: className,\r\n                x: x,\r\n                y: y,\r\n                z: params.initialZ + canvas_1.Canvas.Z,\r\n                size: params.defaultSize,\r\n                rotate: 0,\r\n                blur: 0,\r\n                opacity: 1\r\n            };\r\n            ImageCollection.All.push(component);\r\n            return className;\r\n        };\r\n        Controller.prototype.select = function (className) {\r\n            return {\r\n                element: document.getElementsByClassName(className)[0],\r\n                component: ImageCollection.All.filter(function (e) { return e.className === className; })[0]\r\n            };\r\n        };\r\n        Controller.prototype.translate = function (selector, dx, dy, dz) {\r\n            selector.component.x += dx;\r\n            selector.component.y += dy;\r\n            selector.element.style.setProperty('left', selector.component.x + \"%\", 'important');\r\n            selector.element.style.setProperty('top', selector.component.y + \"%\", 'important');\r\n        };\r\n        return Controller;\r\n    }());\r\n    ImageCollection.Controller = Controller;\r\n})(ImageCollection = exports.ImageCollection || (exports.ImageCollection = {}));\r\n\n\n//# sourceURL=webpack:///./src/script/imageCollection.ts?");

/***/ }),

/***/ "./src/script/main.ts":
/*!****************************!*\
  !*** ./src/script/main.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar domController_1 = __webpack_require__(/*! ./domController */ \"./src/script/domController.ts\");\r\nvar dragEventListner_1 = __webpack_require__(/*! ./dragEventListner */ \"./src/script/dragEventListner.ts\");\r\nvar componentEditor_1 = __webpack_require__(/*! ./componentEditor */ \"./src/script/componentEditor.ts\");\r\nvar Main;\r\n(function (Main) {\r\n    var el = domController_1.DOMController.Selector;\r\n    new componentEditor_1.ComponentEditor.EventHandler();\r\n    new dragEventListner_1.DragEventListner.EventHandler();\r\n    var Start = /** @class */ (function () {\r\n        function Start() {\r\n            this.section = new el('section');\r\n            this.fragment = new el();\r\n            this.counter = 1;\r\n            this.init();\r\n            this.inifinityScroll();\r\n        }\r\n        Start.prototype.init = function () {\r\n            for (var i = 1; i <= 3; i++) {\r\n                this.fragment.append(\"\\n                    <article>\\n                        <h1>Hello World!</h1>\\n                        <p>\\u305D\\u306E\" + this.counter + \"</p>\\n                    </article>\\n                \");\r\n                this.counter += 1;\r\n            }\r\n            this.section.render(this.fragment.dom);\r\n            this.section.on('click', function (e) {\r\n                alert(e.srcElement.textContent);\r\n            });\r\n        };\r\n        Start.prototype.inifinityScroll = function () {\r\n            var _this = this;\r\n            new el('footer').inview(function () {\r\n                setTimeout(function () {\r\n                    _this.section.append(\"\\n                        <article class='fadein'>\\n                            <h1>Hello World!</h1>\\n                            <p>\\u305D\\u306E\" + _this.counter + \"</p>\\n                        </article>\\n                    \");\r\n                    _this.counter += 1;\r\n                }, 1000);\r\n            });\r\n        };\r\n        return Start;\r\n    }());\r\n    new Start();\r\n})(Main || (Main = {}));\r\n\n\n//# sourceURL=webpack:///./src/script/main.ts?");

/***/ }),

/***/ 0:
/*!*****************************************************************************************************************************************************************!*\
  !*** multi ./src/script/componentEditor.ts ./src/script/domController.ts ./src/script/dragEventListner.ts ./src/script/imageCollection.ts ./src/script/main.ts ***!
  \*****************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! E:\\localhost\\proto\\ehon\\src\\script\\componentEditor.ts */\"./src/script/componentEditor.ts\");\n__webpack_require__(/*! E:\\localhost\\proto\\ehon\\src\\script\\domController.ts */\"./src/script/domController.ts\");\n__webpack_require__(/*! E:\\localhost\\proto\\ehon\\src\\script\\dragEventListner.ts */\"./src/script/dragEventListner.ts\");\n__webpack_require__(/*! E:\\localhost\\proto\\ehon\\src\\script\\imageCollection.ts */\"./src/script/imageCollection.ts\");\nmodule.exports = __webpack_require__(/*! E:\\localhost\\proto\\ehon\\src\\script\\main.ts */\"./src/script/main.ts\");\n\n\n//# sourceURL=webpack:///multi_./src/script/componentEditor.ts_./src/script/domController.ts_./src/script/dragEventListner.ts_./src/script/imageCollection.ts_./src/script/main.ts?");

/***/ })

/******/ });