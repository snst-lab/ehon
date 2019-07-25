extern crate wasm_bindgen;
use wasm_bindgen::{prelude::*, JsCast};
extern crate web_sys;
use web_sys::{HtmlElement} ;

#[wasm_bindgen]
extern "C" {
    pub type JsStructure;
    #[wasm_bindgen(method, getter)]  pub fn types(this: &JsStructure) -> u8;
    #[wasm_bindgen(method, getter)]  pub fn scene(this: &JsStructure) -> u8;
    #[wasm_bindgen(method, getter)]  pub fn trigger(this: &JsStructure) -> u8;
    #[wasm_bindgen(method, getter)]  pub fn running(this: &JsStructure) -> bool;
    #[wasm_bindgen(method, getter)]  pub fn state(this: &JsStructure) -> Vec<JsValue>;
    #[wasm_bindgen(method, getter)]  pub fn delay(this: &JsStructure) -> u32;
    #[wasm_bindgen(method, getter)]  pub fn iteration(this: &JsStructure) -> i8;
    #[wasm_bindgen(method, getter)]  pub fn pointer(this: &JsStructure) -> String;
    #[wasm_bindgen(method, getter)]  pub fn float(this: &JsStructure) -> bool;
    #[wasm_bindgen(method, getter)]  pub fn now(this: &JsStructure) -> JsValue;
    #[wasm_bindgen(method, getter)]  pub fn element(this: &JsStructure) -> HtmlElement;
    #[wasm_bindgen(method, setter)]  pub fn set_now(this: &JsStructure, val: &JsValue);
    #[wasm_bindgen(method, setter)]  pub fn set_running(this: &JsStructure, val: bool);
    #[wasm_bindgen(method)]  pub fn transition(this: &JsStructure, state: &JsValue);
}