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

/***/ "./src/script/domController.ts":
/*!*************************************!*\
  !*** ./src/script/domController.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\n/**\r\n### DOMController\r\n    Wrapper of querySelector, appendChild, innerHTML,addEventListener...,etc.\r\n*/\r\nvar DOMController;\r\n(function (DOMController) {\r\n    /**\r\n    ### DOMController.Selector\r\n        Wrapper of querySelector, appendChild, innerHTML,addEventListener...,etc.\r\n    #### Usage\r\n        const p = new DOMController.Selector<string>('p');\r\n        const fragment = new DOMController.Selector<DocumentFragment>();\r\n        for(let i=0;i<10;i++) fragment.render(i);\r\n        p.render(fragment.dom);\r\n        p.at('click',alert('OK'));\r\n    */\r\n    var Selector = /** @class */ (function () {\r\n        function Selector(el) {\r\n            this.parser = new DOMParser();\r\n            this.dom = null;\r\n            if (typeof el === 'string') {\r\n                this.dom = document.querySelector(el);\r\n            }\r\n            else {\r\n                this.dom = document.createDocumentFragment();\r\n            }\r\n        }\r\n        /**\r\n            Wrapper of innerHTML = (string | HTMLElement | DocumentFragment)\r\n        */\r\n        Selector.prototype.render = function (childStr) {\r\n            return this.append(childStr, true);\r\n        };\r\n        /**\r\n            Wrapper of appendChild(string | HTMLElement | DocumentFragment)\r\n        */\r\n        Selector.prototype.append = function (childStr, rewrite) {\r\n            if (typeof childStr === 'undefined')\r\n                return this.dom;\r\n            if (rewrite && this.dom instanceof HTMLElement) {\r\n                this.dom.removeChild(this.dom.firstChild);\r\n                this.dom.appendChild(childStr);\r\n                return this.dom;\r\n            }\r\n            if (typeof childStr === 'string') {\r\n                var fragment = document.createDocumentFragment();\r\n                var collection = this.parser.parseFromString(childStr, 'text/html').body.childNodes;\r\n                var doms = [].slice.call(collection);\r\n                for (var i = 0; i < doms.length; i++)\r\n                    fragment.appendChild(doms[i]);\r\n                if (rewrite)\r\n                    this.dom = fragment;\r\n                else\r\n                    this.dom.appendChild(fragment);\r\n            }\r\n            else {\r\n                if (rewrite)\r\n                    this.dom = childStr;\r\n                else\r\n                    this.dom.appendChild(childStr);\r\n            }\r\n            return this.dom;\r\n        };\r\n        /**\r\n            Wrapper of appendChild(string | Element | DocumentFragment)\r\n        */\r\n        Selector.prototype.prepend = function (childStr, rewrite) {\r\n            if (typeof childStr === 'undefined')\r\n                return this.dom;\r\n            if (rewrite && this.dom instanceof Element) {\r\n                this.dom.removeChild(this.dom.firstChild);\r\n                this.dom.appendChild(childStr);\r\n                return this.dom;\r\n            }\r\n            if (typeof childStr === 'string') {\r\n                var fragment = document.createDocumentFragment();\r\n                var collection = this.parser.parseFromString(childStr, 'text/html').body.childNodes;\r\n                var doms = [].slice.call(collection);\r\n                for (var i = 0; i < doms.length; i++)\r\n                    fragment.insertBefore(doms[i], fragment.firstChild);\r\n                if (rewrite)\r\n                    this.dom = fragment;\r\n                else\r\n                    this.dom.insertBefore(fragment, this.dom.firstChild);\r\n            }\r\n            else {\r\n                if (rewrite)\r\n                    this.dom = childStr;\r\n                else\r\n                    this.dom.insertBefore(childStr, this.dom.firstChild);\r\n            }\r\n            return this.dom;\r\n        };\r\n        /**\r\n            Wrapper of document.addEventListener(eventName, callback, false)\r\n        */\r\n        Selector.prototype.at = function (eventName, callback) {\r\n            if (this.dom !== null && this.dom instanceof Element)\r\n                switch (eventName) {\r\n                    case 'inview':\r\n                        this.inview(callback);\r\n                        break;\r\n                    case 'outview':\r\n                        this.outview(callback);\r\n                        break;\r\n                    default:\r\n                        this.dom.addEventListener(eventName, callback, false);\r\n                        break;\r\n                }\r\n            else\r\n                document.addEventListener(eventName, callback, false);\r\n        };\r\n        /**\r\n            Use Intersection observer to detect the intersection of an element and a visible region\r\n        */\r\n        Selector.prototype.inview = function (callback, options) {\r\n            options = options || {\r\n                root: null,\r\n                rootMargin: '0%',\r\n                threshold: [0.5] //Callback is called when intersection area changes by 50%\r\n            };\r\n            var observer = new IntersectionObserver(function (entries) {\r\n                for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {\r\n                    var e = entries_1[_i];\r\n                    if (e.isIntersecting) {\r\n                        var ie = e;\r\n                        ie.srcElement = e.target;\r\n                        callback(ie);\r\n                    }\r\n                }\r\n            }, options);\r\n            observer.observe(this.dom);\r\n        };\r\n        /**\r\n            Use Intersection observer to detect the intersection of an element and a visible region\r\n        */\r\n        Selector.prototype.outview = function (callback, options) {\r\n            options = options || {\r\n                root: null,\r\n                rootMargin: '0%',\r\n                threshold: [0.5] //Callback is called when intersection area changes by 50%\r\n            };\r\n            var observer = new IntersectionObserver(function (entries) {\r\n                for (var _i = 0, entries_2 = entries; _i < entries_2.length; _i++) {\r\n                    var e = entries_2[_i];\r\n                    if (!e.isIntersecting) {\r\n                        var ie = e;\r\n                        ie.srcElement = e.target;\r\n                        callback(ie);\r\n                    }\r\n                }\r\n            }, options);\r\n            observer.observe(this.dom);\r\n        };\r\n        return Selector;\r\n    }());\r\n    DOMController.Selector = Selector;\r\n})(DOMController = exports.DOMController || (exports.DOMController = {}));\r\n\n\n//# sourceURL=webpack:///./src/script/domController.ts?");

/***/ }),

/***/ "./src/script/dragEventListner.ts":
/*!****************************************!*\
  !*** ./src/script/dragEventListner.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar imageCollection_1 = __webpack_require__(/*! ./imageCollection */ \"./src/script/imageCollection.ts\");\r\nvar DragEventListner;\r\n(function (DragEventListner) {\r\n    var image = new imageCollection_1.ImageCollection.Controller();\r\n    var dragstart = { x: 0, y: 0 };\r\n    var dragend = { x: 0, y: 0 };\r\n    var onDrop = /** @class */ (function () {\r\n        function onDrop(event) {\r\n            // console.log(event);\r\n            event.preventDefault();\r\n            this.drop(event);\r\n        }\r\n        onDrop.prototype.drop = function (event) {\r\n            if (event.dataTransfer.items) {\r\n                // Use DataTransferItemList interface to access the file(s)\r\n                for (var i = 0; i < event.dataTransfer.items.length; i++) {\r\n                    // If dropped items aren't files, reject them\r\n                    if (event.dataTransfer.items[i].kind === 'file') {\r\n                        this.createElement(event, event.dataTransfer.items[i].getAsFile());\r\n                    }\r\n                }\r\n            }\r\n        };\r\n        onDrop.prototype.createElement = function (event, file) {\r\n            var className = image.create(file.name, event.offsetX, event.offsetY, 0, 1, 0, 0, 1);\r\n        };\r\n        return onDrop;\r\n    }());\r\n    DragEventListner.onDrop = onDrop;\r\n    var onDragStart = /** @class */ (function () {\r\n        function onDragStart(event) {\r\n            console.log(event);\r\n            // event.preventDefault();\r\n            this.dragStart(event);\r\n        }\r\n        onDragStart.prototype.dragStart = function (event) {\r\n            dragstart.x = event.clientX;\r\n            dragstart.y = event.clientY;\r\n        };\r\n        return onDragStart;\r\n    }());\r\n    DragEventListner.onDragStart = onDragStart;\r\n    var onDragEnd = /** @class */ (function () {\r\n        function onDragEnd(event) {\r\n            // console.log(event);\r\n            // event.preventDefault();\r\n            this.translate(event);\r\n        }\r\n        onDragEnd.prototype.translate = function (event) {\r\n            console.log(event);\r\n            var className = event.target.classList.item(0);\r\n            var selector = image.select(className);\r\n            var dx = event.clientX - dragstart.x;\r\n            var dy = event.clientY - dragstart.y;\r\n            console.log(selector.component.x, selector.component.y);\r\n            image.translate(selector, dx, dy, 0);\r\n        };\r\n        return onDragEnd;\r\n    }());\r\n    DragEventListner.onDragEnd = onDragEnd;\r\n})(DragEventListner = exports.DragEventListner || (exports.DragEventListner = {}));\r\n\n\n//# sourceURL=webpack:///./src/script/dragEventListner.ts?");

/***/ }),

/***/ "./src/script/imageCollection.ts":
/*!***************************************!*\
  !*** ./src/script/imageCollection.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar domController_1 = __webpack_require__(/*! ./domController */ \"./src/script/domController.ts\");\r\nvar ImageCollection;\r\n(function (ImageCollection) {\r\n    ImageCollection.ImageSrcPath = 'assets/img/';\r\n    ImageCollection.CanvasClassName = 'canvas';\r\n    ImageCollection.Image = new Array();\r\n    ImageCollection.editable = null;\r\n    function uniqueString() {\r\n        return new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16);\r\n    }\r\n    ImageCollection.uniqueString = uniqueString;\r\n    var el = domController_1.DOMController.Selector;\r\n    var canvas = new el('.' + ImageCollection.CanvasClassName);\r\n    var Controller = /** @class */ (function () {\r\n        function Controller() {\r\n        }\r\n        Controller.prototype.create = function (filename, x, y, z, scale, rotate, blur, opacity) {\r\n            var className = 'img-' + uniqueString();\r\n            canvas.append(\"\\n\\t\\t\\t<img draggable=\\\"true\\\" \\n\\t\\t\\t ondragstart=\\\"onDragStart(event);\\\"\\n\\t\\t\\t ondragend=\\\"onDragEnd(event);\\\"\\n\\t\\t\\t src=\\\"\" + ImageCollection.ImageSrcPath + filename + \"\\\"\\n\\t\\t\\t class=\\\"\" + className + \" component-img\\\" \\n\\t\\t\\t style=\\\"width:20%;transform: scale(\" + (scale || 1) + \",\" + (scale || 1) + \") rotate(\" + (rotate || 0) + \"deg)  translate3d(\" + x + \"px,\" + y + \"px,\" + (z ||\r\n                0) + \"px)!important; opacity: \" + (opacity || 1) + \" !important; filter:blur(\" + (blur || 0) + \"px) !important\\n\\t\\t\\t \\\">\\n\\t\\t\\t\");\r\n            var component = {\r\n                fileName: filename,\r\n                className: className,\r\n                x: x,\r\n                y: y,\r\n                z: z,\r\n                scale: scale,\r\n                rotate: rotate,\r\n                blur: blur,\r\n                opacity: opacity\r\n            };\r\n            ImageCollection.Image.push(component);\r\n            return className;\r\n        };\r\n        Controller.prototype.select = function (className) {\r\n            return {\r\n                element: document.getElementsByClassName(className)[0],\r\n                component: ImageCollection.Image.filter(function (e) { return e.className === className; })[0]\r\n            };\r\n        };\r\n        Controller.prototype.translate = function (selector, dx, dy, dz) {\r\n            ['', '-ms-', '-webkit-'].forEach(function (prefix) {\r\n                selector.element.style.setProperty(prefix + 'transform', \"scale(\" + selector.component.scale + \",\" + selector.component.scale + \") rotate(\" + selector.component\r\n                    .rotate + \"deg)  translate3d(\" + (selector.component.x + dx) + \"px,\" + (selector.component.y + dy) + \"px,\" + (selector.component.z + dz) + \"px)\", 'important');\r\n            });\r\n            if (typeof dx === 'number')\r\n                selector.component.x += dx;\r\n            if (typeof dy === 'number')\r\n                selector.component.y += dy;\r\n            if (typeof dz === 'number')\r\n                selector.component.z += dz;\r\n        };\r\n        return Controller;\r\n    }());\r\n    ImageCollection.Controller = Controller;\r\n})(ImageCollection = exports.ImageCollection || (exports.ImageCollection = {}));\r\n\n\n//# sourceURL=webpack:///./src/script/imageCollection.ts?");

/***/ }),

/***/ "./src/script/main.ts":
/*!****************************!*\
  !*** ./src/script/main.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nvar domController_1 = __webpack_require__(/*! ./domController */ \"./src/script/domController.ts\");\r\nvar dragEventListner_1 = __webpack_require__(/*! ./dragEventListner */ \"./src/script/dragEventListner.ts\");\r\nvar Main;\r\n(function (Main) {\r\n    var el = domController_1.DOMController.Selector;\r\n    Object.defineProperty(window, 'onDrop', {\r\n        value: function (event) {\r\n            new dragEventListner_1.DragEventListner.onDrop(event);\r\n        }\r\n    });\r\n    Object.defineProperty(window, 'onDragStart', {\r\n        value: function (event) {\r\n            new dragEventListner_1.DragEventListner.onDragStart(event);\r\n        }\r\n    });\r\n    Object.defineProperty(window, 'onDragEnd', {\r\n        value: function (event) {\r\n            new dragEventListner_1.DragEventListner.onDragEnd(event);\r\n        }\r\n    });\r\n    var Start = /** @class */ (function () {\r\n        function Start() {\r\n            this.section = new el('section');\r\n            this.fragment = new el();\r\n            this.counter = 1;\r\n            this.init();\r\n            this.inifinityScroll();\r\n        }\r\n        Start.prototype.init = function () {\r\n            for (var i = 1; i <= 3; i++) {\r\n                this.fragment.append(\"\\n                    <article>\\n                        <h1>Hello World!</h1>\\n                        <p>\\u305D\\u306E\" + this.counter + \"</p>\\n                    </article>\\n                \");\r\n                this.counter += 1;\r\n            }\r\n            this.section.render(this.fragment.dom);\r\n            this.section.at('click', function (e) {\r\n                alert(e.srcElement.textContent);\r\n            });\r\n        };\r\n        Start.prototype.inifinityScroll = function () {\r\n            var _this = this;\r\n            new el('footer').inview(function () {\r\n                setTimeout(function () {\r\n                    _this.section.append(\"\\n                        <article class='fadein'>\\n                            <h1>Hello World!</h1>\\n                            <p>\\u305D\\u306E\" + _this.counter + \"</p>\\n                        </article>\\n                    \");\r\n                    _this.counter += 1;\r\n                }, 1000);\r\n            });\r\n        };\r\n        return Start;\r\n    }());\r\n    new Start();\r\n})(Main || (Main = {}));\r\n\n\n//# sourceURL=webpack:///./src/script/main.ts?");

/***/ }),

/***/ 0:
/*!*********************************************************************************************************************************!*\
  !*** multi ./src/script/domController.ts ./src/script/dragEventListner.ts ./src/script/imageCollection.ts ./src/script/main.ts ***!
  \*********************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! E:\\localhost\\proto\\ehon\\src\\script\\domController.ts */\"./src/script/domController.ts\");\n__webpack_require__(/*! E:\\localhost\\proto\\ehon\\src\\script\\dragEventListner.ts */\"./src/script/dragEventListner.ts\");\n__webpack_require__(/*! E:\\localhost\\proto\\ehon\\src\\script\\imageCollection.ts */\"./src/script/imageCollection.ts\");\nmodule.exports = __webpack_require__(/*! E:\\localhost\\proto\\ehon\\src\\script\\main.ts */\"./src/script/main.ts\");\n\n\n//# sourceURL=webpack:///multi_./src/script/domController.ts_./src/script/dragEventListner.ts_./src/script/imageCollection.ts_./src/script/main.ts?");

/***/ })

/******/ });