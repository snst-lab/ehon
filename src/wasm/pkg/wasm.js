
const __exports = {};
let wasm;

const heap = new Array(32);

heap.fill(undefined);

heap.push(undefined, null, true, false);

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

let passStringToWasm;
if (typeof cachedTextEncoder.encodeInto === 'function') {
    passStringToWasm = function(arg) {


        let size = arg.length;
        let ptr = wasm.__wbindgen_malloc(size);
        let offset = 0;
        {
            const mem = getUint8Memory();
            for (; offset < arg.length; offset++) {
                const code = arg.charCodeAt(offset);
                if (code > 0x7F) break;
                mem[ptr + offset] = code;
            }
        }

        if (offset !== arg.length) {
            arg = arg.slice(offset);
            ptr = wasm.__wbindgen_realloc(ptr, size, size = offset + arg.length * 3);
            const view = getUint8Memory().subarray(ptr + offset, ptr + size);
            const ret = cachedTextEncoder.encodeInto(arg, view);

            offset += ret.written;
        }
        WASM_VECTOR_LEN = offset;
        return ptr;
    };
} else {
    passStringToWasm = function(arg) {


        let size = arg.length;
        let ptr = wasm.__wbindgen_malloc(size);
        let offset = 0;
        {
            const mem = getUint8Memory();
            for (; offset < arg.length; offset++) {
                const code = arg.charCodeAt(offset);
                if (code > 0x7F) break;
                mem[ptr + offset] = code;
            }
        }

        if (offset !== arg.length) {
            const buf = cachedTextEncoder.encode(arg.slice(offset));
            ptr = wasm.__wbindgen_realloc(ptr, size, size = offset + buf.length);
            getUint8Memory().set(buf, ptr + offset);
            offset += buf.length;
        }
        WASM_VECTOR_LEN = offset;
        return ptr;
    };
}

let cachedTextDecoder = new TextDecoder('utf-8');

function getStringFromWasm(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

let cachedGlobalArgumentPtr = null;
function globalArgumentPtr() {
    if (cachedGlobalArgumentPtr === null) {
        cachedGlobalArgumentPtr = wasm.__wbindgen_global_argument_ptr();
    }
    return cachedGlobalArgumentPtr;
}

let cachegetUint32Memory = null;
function getUint32Memory() {
    if (cachegetUint32Memory === null || cachegetUint32Memory.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory;
}

function getObject(idx) { return heap[idx]; }

function __wbg_float_6d3d92616b55ef6d(arg0) {
    return getObject(arg0).float;
}
__exports.__wbg_float_6d3d92616b55ef6d = __wbg_float_6d3d92616b55ef6d

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function __wbg_element_3f8bfacc2eb62b78(arg0) {
    return addHeapObject(getObject(arg0).element);
}
__exports.__wbg_element_3f8bfacc2eb62b78 = __wbg_element_3f8bfacc2eb62b78

function __wbg_setnow_b984c1ff57bc4064(arg0, arg1) {
    getObject(arg0).now = getObject(arg1);
}
__exports.__wbg_setnow_b984c1ff57bc4064 = __wbg_setnow_b984c1ff57bc4064

function handleError(exnptr, e) {
    const view = getUint32Memory();
    view[exnptr / 4] = 1;
    view[exnptr / 4 + 1] = addHeapObject(e);
}

function __widl_f_set_property_CSSStyleDeclaration(arg0, arg1, arg2, arg3, arg4, exnptr) {
    let varg1 = getStringFromWasm(arg1, arg2);
    let varg3 = getStringFromWasm(arg3, arg4);
    try {
        getObject(arg0).setProperty(varg1, varg3);
    } catch (e) {
        handleError(exnptr, e);
    }
}
__exports.__widl_f_set_property_CSSStyleDeclaration = __widl_f_set_property_CSSStyleDeclaration

function __widl_f_set_css_text_CSSStyleDeclaration(arg0, arg1, arg2) {
    let varg1 = getStringFromWasm(arg1, arg2);
    getObject(arg0).cssText = varg1;
}
__exports.__widl_f_set_css_text_CSSStyleDeclaration = __widl_f_set_css_text_CSSStyleDeclaration

function __widl_f_style_HTMLElement(arg0) {
    return addHeapObject(getObject(arg0).style);
}
__exports.__widl_f_style_HTMLElement = __widl_f_style_HTMLElement

function __wbg_get_48d637c66043532c(arg0, arg1, exnptr) {
    try {
        return addHeapObject(Reflect.get(getObject(arg0), getObject(arg1)));
    } catch (e) {
        handleError(exnptr, e);
    }
}
__exports.__wbg_get_48d637c66043532c = __wbg_get_48d637c66043532c

function __wbindgen_string_new(p, l) { return addHeapObject(getStringFromWasm(p, l)); }
__exports.__wbindgen_string_new = __wbindgen_string_new

function __wbindgen_number_get(n, invalid) {
    let obj = getObject(n);
    if (typeof(obj) === 'number') return obj;
    getUint8Memory()[invalid] = 1;
    return 0;
}
__exports.__wbindgen_number_get = __wbindgen_number_get

function __wbindgen_boolean_get(i) {
    let v = getObject(i);
    return typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
}
__exports.__wbindgen_boolean_get = __wbindgen_boolean_get

function __wbindgen_string_get(i, len_ptr) {
    let obj = getObject(i);
    if (typeof(obj) !== 'string') return 0;
    const ptr = passStringToWasm(obj);
    getUint32Memory()[len_ptr / 4] = WASM_VECTOR_LEN;
    return ptr;
}
__exports.__wbindgen_string_get = __wbindgen_string_get

function __wbindgen_debug_string(i, len_ptr) {
    const debug_str =
    val => {
        // primitive types
        const type = typeof val;
        if (type == 'number' || type == 'boolean' || val == null) {
            return  `${val}`;
        }
        if (type == 'string') {
            return `"${val}"`;
        }
        if (type == 'symbol') {
            const description = val.description;
            if (description == null) {
                return 'Symbol';
            } else {
                return `Symbol(${description})`;
            }
        }
        if (type == 'function') {
            const name = val.name;
            if (typeof name == 'string' && name.length > 0) {
                return `Function(${name})`;
            } else {
                return 'Function';
            }
        }
        // objects
        if (Array.isArray(val)) {
            const length = val.length;
            let debug = '[';
            if (length > 0) {
                debug += debug_str(val[0]);
            }
            for(let i = 1; i < length; i++) {
                debug += ', ' + debug_str(val[i]);
            }
            debug += ']';
            return debug;
        }
        // Test for built-in
        const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
        let className;
        if (builtInMatches.length > 1) {
            className = builtInMatches[1];
        } else {
            // Failed to match the standard '[object ClassName]'
            return toString.call(val);
        }
        if (className == 'Object') {
            // we're a user defined class or Object
            // JSON.stringify avoids problems with cycles, and is generally much
            // easier than looping through ownProperties of `val`.
            try {
                return 'Object(' + JSON.stringify(val) + ')';
            } catch (_) {
                return 'Object';
            }
        }
        // errors
        if (val instanceof Error) {
        return `${val.name}: ${val.message}
        ${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}
;
const toString = Object.prototype.toString;
const val = getObject(i);
const debug = debug_str(val);
const ptr = passStringToWasm(debug);
getUint32Memory()[len_ptr / 4] = WASM_VECTOR_LEN;
return ptr;
}
__exports.__wbindgen_debug_string = __wbindgen_debug_string

function __wbindgen_throw(ptr, len) {
    throw new Error(getStringFromWasm(ptr, len));
}
__exports.__wbindgen_throw = __wbindgen_throw

function freeCalcCSS(ptr) {

    wasm.__wbg_calccss_free(ptr);
}
/**
*/
export class CalcCSS {

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeCalcCSS(ptr);
    }

    /**
    * @param {any} target
    * @param {any} canvas
    * @param {any} image
    * @param {any} camera
    * @param {any} config
    * @param {any} param
    * @returns {void}
    */
    static image_transition(target, canvas, image, camera, config, param) {
        try {
            return wasm.calccss_image_transition(addBorrowedObject(target), addBorrowedObject(canvas), addBorrowedObject(image), addBorrowedObject(camera), addBorrowedObject(config), addBorrowedObject(param));

        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;

        }

    }
    /**
    * @param {any} target
    * @param {any} canvas
    * @param {any} text
    * @param {any} camera
    * @param {any} param
    * @returns {void}
    */
    static text_transition(target, canvas, text, camera, param) {
        try {
            return wasm.calccss_text_transition(addBorrowedObject(target), addBorrowedObject(canvas), addBorrowedObject(text), addBorrowedObject(camera), addBorrowedObject(param));

        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;

        }

    }
    /**
    * @param {any} target
    * @param {any} canvas
    * @param {any} image
    * @param {any} camera
    * @param {any} param
    * @returns {void}
    */
    static image_transition_for_camera(target, canvas, image, camera, param) {
        try {
            return wasm.calccss_image_transition_for_camera(addBorrowedObject(target), addBorrowedObject(canvas), addBorrowedObject(image), addBorrowedObject(camera), addBorrowedObject(param));

        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;

        }

    }
    /**
    * @param {any} target
    * @param {any} canvas
    * @param {any} text
    * @param {any} camera
    * @param {any} param
    * @returns {void}
    */
    static text_transition_for_camera(target, canvas, text, camera, param) {
        try {
            return wasm.calccss_text_transition_for_camera(addBorrowedObject(target), addBorrowedObject(canvas), addBorrowedObject(text), addBorrowedObject(camera), addBorrowedObject(param));

        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;

        }

    }
    /**
    * @param {any} canvas
    * @param {any} image
    * @param {any} camera
    * @param {any} config
    * @param {any} param
    * @param {string} pointer
    * @returns {string}
    */
    static image_float(canvas, image, camera, config, param, pointer) {
        const ptr5 = passStringToWasm(pointer);
        const len5 = WASM_VECTOR_LEN;
        const retptr = globalArgumentPtr();
        try {
            wasm.calccss_image_float(retptr, addBorrowedObject(canvas), addBorrowedObject(image), addBorrowedObject(camera), addBorrowedObject(config), addBorrowedObject(param), ptr5, len5);
            const mem = getUint32Memory();
            const rustptr = mem[retptr / 4];
            const rustlen = mem[retptr / 4 + 1];

            const realRet = getStringFromWasm(rustptr, rustlen).slice();
            wasm.__wbindgen_free(rustptr, rustlen * 1);
            return realRet;


        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            wasm.__wbindgen_free(ptr5, len5 * 1);

        }

    }
    /**
    * @param {any} canvas
    * @param {any} image
    * @param {any} camera
    * @param {any} config
    * @param {string} pointer
    * @returns {string}
    */
    static image_fix(canvas, image, camera, config, pointer) {
        const ptr4 = passStringToWasm(pointer);
        const len4 = WASM_VECTOR_LEN;
        const retptr = globalArgumentPtr();
        try {
            wasm.calccss_image_fix(retptr, addBorrowedObject(canvas), addBorrowedObject(image), addBorrowedObject(camera), addBorrowedObject(config), ptr4, len4);
            const mem = getUint32Memory();
            const rustptr = mem[retptr / 4];
            const rustlen = mem[retptr / 4 + 1];

            const realRet = getStringFromWasm(rustptr, rustlen).slice();
            wasm.__wbindgen_free(rustptr, rustlen * 1);
            return realRet;


        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            wasm.__wbindgen_free(ptr4, len4 * 1);

        }

    }
    /**
    * @param {any} canvas
    * @param {any} text
    * @param {any} camera
    * @param {any} param
    * @param {string} pointer
    * @returns {string}
    */
    static text_float(canvas, text, camera, param, pointer) {
        const ptr4 = passStringToWasm(pointer);
        const len4 = WASM_VECTOR_LEN;
        const retptr = globalArgumentPtr();
        try {
            wasm.calccss_text_float(retptr, addBorrowedObject(canvas), addBorrowedObject(text), addBorrowedObject(camera), addBorrowedObject(param), ptr4, len4);
            const mem = getUint32Memory();
            const rustptr = mem[retptr / 4];
            const rustlen = mem[retptr / 4 + 1];

            const realRet = getStringFromWasm(rustptr, rustlen).slice();
            wasm.__wbindgen_free(rustptr, rustlen * 1);
            return realRet;


        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            wasm.__wbindgen_free(ptr4, len4 * 1);

        }

    }
    /**
    * @param {any} canvas
    * @param {any} text
    * @param {any} camera
    * @param {string} pointer
    * @returns {string}
    */
    static text_fix(canvas, text, camera, pointer) {
        const ptr3 = passStringToWasm(pointer);
        const len3 = WASM_VECTOR_LEN;
        const retptr = globalArgumentPtr();
        try {
            wasm.calccss_text_fix(retptr, addBorrowedObject(canvas), addBorrowedObject(text), addBorrowedObject(camera), ptr3, len3);
            const mem = getUint32Memory();
            const rustptr = mem[retptr / 4];
            const rustlen = mem[retptr / 4 + 1];

            const realRet = getStringFromWasm(rustptr, rustlen).slice();
            wasm.__wbindgen_free(rustptr, rustlen * 1);
            return realRet;


        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            wasm.__wbindgen_free(ptr3, len3 * 1);

        }

    }
}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function __wbindgen_object_drop_ref(i) { dropObject(i); }
__exports.__wbindgen_object_drop_ref = __wbindgen_object_drop_ref

function init(module) {
    let result;
    const imports = { './wasm': __exports };

    if (module instanceof URL || typeof module === 'string' || module instanceof Request) {

        const response = fetch(module);
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            result = WebAssembly.instantiateStreaming(response, imports)
            .catch(e => {
                console.warn("`WebAssembly.instantiateStreaming` failed. Assuming this is because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
                return response
                .then(r => r.arrayBuffer())
                .then(bytes => WebAssembly.instantiate(bytes, imports));
            });
        } else {
            result = response
            .then(r => r.arrayBuffer())
            .then(bytes => WebAssembly.instantiate(bytes, imports));
        }
    } else {

        result = WebAssembly.instantiate(module, imports)
        .then(result => {
            if (result instanceof WebAssembly.Instance) {
                return { instance: result, module };
            } else {
                return result;
            }
        });
    }
    return result.then(({instance, module}) => {
        wasm = instance.exports;
        init.__wbindgen_wasm_module = module;

        return wasm;
    });
}

export default init;

