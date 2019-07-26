/* tslint:disable */
/**
*/
export class CalcCSS {
  free(): void;
/**
* @param {any} target 
* @param {any} canvas 
* @param {any} image 
* @param {any} camera 
* @param {any} config 
* @param {any} param 
* @returns {void} 
*/
  static image_transition(target: any, canvas: any, image: any, camera: any, config: any, param: any): void;
/**
* @param {any} target 
* @param {any} canvas 
* @param {any} text 
* @param {any} camera 
* @param {any} param 
* @returns {void} 
*/
  static text_transition(target: any, canvas: any, text: any, camera: any, param: any): void;
/**
* @param {any} target 
* @param {any} canvas 
* @param {any} image 
* @param {any} camera 
* @param {any} param 
* @returns {void} 
*/
  static image_transition_for_camera(target: any, canvas: any, image: any, camera: any, param: any): void;
/**
* @param {any} target 
* @param {any} canvas 
* @param {any} text 
* @param {any} camera 
* @param {any} param 
* @returns {void} 
*/
  static text_transition_for_camera(target: any, canvas: any, text: any, camera: any, param: any): void;
/**
* @param {any} canvas 
* @param {any} image 
* @param {any} camera 
* @param {any} config 
* @param {any} param 
* @param {string} pointer 
* @returns {string} 
*/
  static image_float(canvas: any, image: any, camera: any, config: any, param: any, pointer: string): string;
/**
* @param {any} canvas 
* @param {any} image 
* @param {any} camera 
* @param {any} config 
* @param {string} pointer 
* @returns {string} 
*/
  static image_fix(canvas: any, image: any, camera: any, config: any, pointer: string): string;
/**
* @param {any} canvas 
* @param {any} text 
* @param {any} camera 
* @param {any} param 
* @param {string} pointer 
* @returns {string} 
*/
  static text_float(canvas: any, text: any, camera: any, param: any, pointer: string): string;
/**
* @param {any} canvas 
* @param {any} text 
* @param {any} camera 
* @param {string} pointer 
* @returns {string} 
*/
  static text_fix(canvas: any, text: any, camera: any, pointer: string): string;
}

/**
* If `module_or_path` is {RequestInfo}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {RequestInfo | BufferSource | WebAssembly.Module} module_or_path
*
* @returns {Promise<any>}
*/
export default function init (module_or_path: RequestInfo | BufferSource | WebAssembly.Module): Promise<any>;
        