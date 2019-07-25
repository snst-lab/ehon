extern crate js_sys;
extern crate web_sys;
extern crate wasm_bindgen;

use web_sys::{HtmlElement,CssStyleDeclaration} ;
use wasm_bindgen::{prelude::*, JsCast};

pub struct Set{}

impl Set {
     pub fn bool(obj:&JsValue, prop:&str, val:bool) -> Result<bool, JsValue> {
          js_sys::Reflect::set(obj, &wasm_bindgen::JsValue::from_str(prop), &wasm_bindgen::JsValue::from_bool(val))
     }

     pub fn num(obj:&JsValue, prop:&str, val:f64) -> Result<bool, JsValue> {
          js_sys::Reflect::set(obj, &wasm_bindgen::JsValue::from_str(prop), &wasm_bindgen::JsValue::from_f64(val))
     }

     pub fn str(obj:&JsValue, prop:&str, val:&str) -> Result<bool, JsValue> {
          js_sys::Reflect::set(obj, &wasm_bindgen::JsValue::from_str(prop), &wasm_bindgen::JsValue::from_str(val))
     }

     pub fn val(obj:&JsValue, prop:&str, val:&JsValue) -> Result<bool, JsValue> {
          js_sys::Reflect::set(obj, &wasm_bindgen::JsValue::from_str(prop), val)
     }
}
