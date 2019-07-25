extern crate js_sys;
extern crate web_sys;
extern crate wasm_bindgen;

use web_sys::{HtmlElement,CssStyleDeclaration} ;
use wasm_bindgen::{prelude::*, JsCast};

pub struct Get{}

impl Get {
     pub fn bool(obj:&JsValue,prop:&str) -> bool {
          js_sys::Reflect::get(obj, &wasm_bindgen::JsValue::from_str(prop)).unwrap().as_bool().unwrap()
     }

     pub fn num(obj:&JsValue,prop:&str) -> f64 {
          js_sys::Reflect::get(obj, &wasm_bindgen::JsValue::from_str(prop)).unwrap().as_f64().unwrap()
     }

     pub fn str(obj:&JsValue,prop:&str) -> String {
          js_sys::Reflect::get(obj, &wasm_bindgen::JsValue::from_str(prop)).unwrap().as_string().unwrap()
     }

     pub fn val(obj:&JsValue,prop:&str) -> JsValue {
          js_sys::Reflect::get(obj, &wasm_bindgen::JsValue::from_str(prop)).unwrap()
     }

     pub fn element(obj:&JsValue) -> HtmlElement {
     HtmlElement::from(Get::val(&obj,"element"))
     }
}

