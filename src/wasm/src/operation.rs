extern crate js_sys;
extern crate wasm_bindgen;
use wasm_bindgen::{prelude::*, JsCast};

#[macro_use]
extern crate serde_derive;
extern crate serde;
extern crate serde_json;

pub mod getter;
use getter::Get;

#[derive(Debug, Serialize, Deserialize)]
pub struct State {
    pub src: String,
    pub x : f64,
    pub y : f64,
    pub z : f64,
    pub width: f64,
    pub aspectRatio: f64,
    pub rotate: f64,
    pub scale: f64,
    pub blur : f64,
    pub opacity:f64,
    pub chroma: f64,
    pub light: f64,
    pub duration: f64,
    pub option: String,
}

#[wasm_bindgen]
pub struct Operation {}

#[wasm_bindgen]
impl Operation {
    fn add(state1: &JsValue, state2: &JsValue) -> JsValue {
        let obj = State {
            src: Get::str( state1, "src"),
            x: Get::num( state1, "x") + Get::num( state2, "x"),
            y: Get::num( state1, "y") + Get::num( state2, "y"),
            z: Get::num( state1, "z") + Get::num( state2, "z"),
            width: Get::num( state1, "width") + Get::num( state2, "width"),
            aspectRatio: Get::num( state1, "aspectRatio") + Get::num( state2, "aspectRatio"),
            rotate: Get::num( state1, "rotate") + Get::num( state2, "rotate"),
            scale: Get::num( state1, "scale") + Get::num( state2, "scale"),
            blur: Get::num( state1, "blur") + Get::num( state2, "blur"),
            opacity: Get::num( state1, "opacity") + Get::num( state2, "opacity"),
            chroma: Get::num( state1, "chroma") + Get::num( state2, "chroma"),
            light: Get::num( state1, "light") + Get::num( state2, "light"),
            duration: Get::num( state1, "duration"),
            option: Get::str( state1, "option")
        };
        JsValue::from_serde(&obj).unwrap()
    }
    
    fn diff(old_state: &JsValue, new_state: &JsValue, param:&JsValue) -> JsValue {
	    let dur_inv: f64 = if Get::num( new_state, "duration") > 0.0 {
            1.0 / Get::num( new_state, "duration") * Get::num( &Get::val(param, "animation"), "skipFrame")
        }else{
            0.0
        };
        let obj = State {
            src: Get::str( old_state, "src"),
            x: ( Get::num( new_state, "x") - Get::num( old_state, "x") )  * dur_inv,
            y: ( Get::num( new_state, "y") - Get::num( old_state, "y") )  * dur_inv,
            z: ( Get::num( new_state, "z") - Get::num( old_state, "z") )  * dur_inv,
            width: ( Get::num( new_state, "width") - Get::num( old_state, "width") )  * dur_inv,
            aspectRatio: ( Get::num( new_state, "aspectRatio") - Get::num( old_state, "aspectRatio") )  * dur_inv,
            rotate: ( Get::num( new_state, "rotate") - Get::num( old_state, "rotate") )  * dur_inv,
            scale: ( Get::num( new_state, "scale") - Get::num( old_state, "scale") )  * dur_inv,
            blur: ( Get::num( new_state, "blur") - Get::num( old_state, "blur") )  * dur_inv,
            opacity: ( Get::num( new_state, "opacity") - Get::num( old_state, "opacity") )  * dur_inv,
            chroma: ( Get::num( new_state, "chroma") - Get::num( old_state, "chroma") )  * dur_inv,
            light: ( Get::num( new_state, "light") - Get::num( old_state, "light") )  * dur_inv,
            duration: Get::num( old_state, "duration"),
            option: Get::str( old_state, "option")
        };
        JsValue::from_serde(&obj).unwrap()
    }
}