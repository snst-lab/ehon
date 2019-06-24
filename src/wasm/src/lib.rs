extern crate js_sys;
extern crate web_sys;
extern crate wasm_bindgen;

use std::cell::RefCell;
use std::rc::Rc;
use web_sys::{HtmlElement,CssStyleDeclaration} ;
use wasm_bindgen::{prelude::*, JsCast};

#[macro_use]
extern crate serde_derive;
extern crate serde;
extern crate serde_json;

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_element(a: &web_sys::HtmlElement);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_jsvalue(a: &JsValue);
}


#[wasm_bindgen]
pub struct Console{}

#[wasm_bindgen]
impl Console{
    pub fn out() {
        log("Hello from rust");
    }
}

#[wasm_bindgen]
extern "C" {
    pub type JsStructure;
    #[wasm_bindgen(method, getter)]  pub fn types(this: &JsStructure) -> u8;
    #[wasm_bindgen(method, getter)]  pub fn scene(this: &JsStructure) -> u8;
    #[wasm_bindgen(method, getter)]  pub fn trigger(this: &JsStructure) -> u8;
    #[wasm_bindgen(method, getter)]  pub fn running(this: &JsStructure) -> bool;
    #[wasm_bindgen(method, getter)]  pub fn state(this: &JsStructure) -> Vec<JsValue>;
    #[wasm_bindgen(method, getter)]  pub fn delay(this: &JsStructure) -> u32;
    #[wasm_bindgen(method, getter)]  pub fn iteration(this: &JsStructure) -> u8;
    #[wasm_bindgen(method, getter)]  pub fn pointer(this: &JsStructure) -> String;
    #[wasm_bindgen(method, getter)]  pub fn float(this: &JsStructure) -> bool;
    #[wasm_bindgen(method, getter)]  pub fn now(this: &JsStructure) -> JsValue;
    #[wasm_bindgen(method, getter)]  pub fn element(this: &JsStructure) -> HtmlElement;
    #[wasm_bindgen(method, setter)]  pub fn set_now(this: &JsStructure, val: &JsValue);
    #[wasm_bindgen(method, setter)]  pub fn set_running(this: &JsStructure, val: bool);
    #[wasm_bindgen(method)]  pub fn transition(this: &JsStructure, state: &JsValue);
}

fn get_bool(obj:&JsValue,prop:&str) -> bool {
     js_sys::Reflect::get(obj, &wasm_bindgen::JsValue::from_str(prop)).unwrap().as_bool().unwrap()
}

fn get_num(obj:&JsValue,prop:&str) -> f64 {
     js_sys::Reflect::get(obj, &wasm_bindgen::JsValue::from_str(prop)).unwrap().as_f64().unwrap()
}

fn get_str(obj:&JsValue,prop:&str) -> String {
     js_sys::Reflect::get(obj, &wasm_bindgen::JsValue::from_str(prop)).unwrap().as_string().unwrap()
}

fn get_val(obj:&JsValue,prop:&str) -> JsValue {
     js_sys::Reflect::get(obj, &wasm_bindgen::JsValue::from_str(prop)).unwrap()
}

fn get_element(obj:&JsValue) -> HtmlElement {
    HtmlElement::from(get_val(&obj,"element"))
}

fn set_bool(obj:&JsValue, prop:&str, val:bool) -> Result<bool, JsValue> {
     js_sys::Reflect::set(obj, &wasm_bindgen::JsValue::from_str(prop), &wasm_bindgen::JsValue::from_bool(val))
}

fn set_num(obj:&JsValue, prop:&str, val:f64) -> Result<bool, JsValue> {
     js_sys::Reflect::set(obj, &wasm_bindgen::JsValue::from_str(prop), &wasm_bindgen::JsValue::from_f64(val))
}

fn set_str(obj:&JsValue, prop:&str, val:&str) -> Result<bool, JsValue> {
     js_sys::Reflect::set(obj, &wasm_bindgen::JsValue::from_str(prop), &wasm_bindgen::JsValue::from_str(val))
}

fn set_val(obj:&JsValue, prop:&str, val:&JsValue) -> Result<bool, JsValue> {
     js_sys::Reflect::set(obj, &wasm_bindgen::JsValue::from_str(prop), val)
}

#[wasm_bindgen]
pub struct CalcCSS {}

#[wasm_bindgen]
impl CalcCSS{
    pub fn image_transition(target: &JsStructure, canvas: &JsValue, image: &JsValue, camera: &JsValue, config:  &JsValue, param:  &JsValue) {
        let declaration: CssStyleDeclaration = HtmlElement::style(&target.element());
        target.set_now(image);
        if target.float() {
            CssStyleDeclaration::set_css_text(&declaration, &CalcCSS::image_float(canvas, image, camera, config, param, &get_str(target,"pointer")));
        }else{
            CssStyleDeclaration::set_css_text(&declaration, &CalcCSS::image_fix(canvas, image, camera, config , &get_str(target,"pointer")));
        }
    }

    pub fn text_transition(target: &JsStructure, canvas: &JsValue, text: &JsValue, camera: &JsValue, config:  &JsValue, param:  &JsValue) {
        let declaration: CssStyleDeclaration = HtmlElement::style(&target.element());
        target.set_now(text);
        if target.float() {
            CssStyleDeclaration::set_css_text(&declaration, &CalcCSS::text_float(canvas, text, camera, config, param, &get_str(target,"pointer")));
        }else{
            CssStyleDeclaration::set_css_text(&declaration, &CalcCSS::text_fix(canvas, text, camera, config, &get_str(target,"pointer")));
        }
    }

    pub fn image_transition_for_camera(target: &JsValue, canvas: &JsValue, image: &JsValue, camera: &JsValue, _config: &JsValue, param: &JsValue){
       if get_bool(&target,"float") {
            let distance_inv: f64 = 1.0 / std::cmp::max((get_num(camera,"z") - get_num(image,"z")) as i16, 1) as f64;
            let size: f64 = (get_num(&get_val(param,"camera"),"initialZ") - get_num(&get_val(param,"image"),"initialZ") ) * distance_inv;
            let left: String = (((get_num(image,"x") - get_num(camera,"x") - get_num(&get_val(param,"camera"),"vanishingX")) * get_num(image,"z")) * distance_inv + get_num(&get_val(param,"camera"),"vanishingX")).to_string();
            let top: String = (((get_num(image,"y") - get_num(camera,"y") - get_num(&get_val(param,"camera"),"vanishingY")) * get_num(image,"z")) * distance_inv + get_num(&get_val(param,"camera"),"vanishingY")).to_string();
            let width:String = (get_num(image,"width") * size).to_string();
            let height: String = (get_num(image,"width") * get_num(image,"aspectRatio") / get_num(canvas,"aspectRatio") * size).to_string();
            let filter:String = "blur(".to_string()+ &(get_num(image,"blur") + (get_num(camera,"z") - get_num(image,"z") - get_num(&get_val(param,"camera"),"initialZ") + get_num(&get_val(param,"image"),"initialZ") ).abs() / get_num(&get_val(param,"camera"),"depthOfField") ).to_string() + "px) opacity("+ &get_num(image,"opacity").to_string() +"%)";
            let declaration: CssStyleDeclaration = HtmlElement::style(&get_element(&target));
            CssStyleDeclaration::set_property(&declaration,"left", &(left+"%")).expect("could not set 'left' property");
            CssStyleDeclaration::set_property(&declaration,"top", &(top+"%")).expect("could not set 'top' property");
            CssStyleDeclaration::set_property(&declaration,"width", &(width+"%")).expect("could not set 'width' property");
            CssStyleDeclaration::set_property(&declaration,"height", &(height+"%")).expect("could not set 'height' property");
            CssStyleDeclaration::set_property(&declaration,"filter", &filter).expect("could not set 'filter' property");
        };
    }

    pub fn text_transition_for_camera(target: &JsValue, canvas: &JsValue, text: &JsValue, camera: &JsValue, _config: &JsValue, param: &JsValue){
       if get_bool(&target,"float") {
            let distance_inv: f64 = 1.0 / std::cmp::max((get_num(camera,"z") - get_num(text,"z")) as i16, 1) as f64;
            let size: f64 = (get_num(&get_val(param,"camera"),"initialZ") - get_num(&get_val(param,"image"),"initialZ") ) * distance_inv;
            let left: String = (((get_num(text,"x") - get_num(camera,"x") - get_num(&get_val(param,"camera"),"vanishingX")) * get_num(text,"z")) * distance_inv + get_num(&get_val(param,"camera"),"vanishingX")).to_string();
            let top: String = (((get_num(text,"y") - get_num(camera,"y") - get_num(&get_val(param,"camera"),"vanishingY")) * get_num(text,"z")) * distance_inv + get_num(&get_val(param,"camera"),"vanishingY")).to_string();
            let width:String = (get_num(text,"width") * size).to_string();
            let height: String = (get_num(text,"width") * get_num(text,"aspectRatio") / get_num(canvas,"aspectRatio") * size).to_string();
            let filter:String = "blur(".to_string()+ &(get_num(text,"blur") + (get_num(camera,"z") - get_num(text,"z") - get_num(&get_val(param,"camera"),"initialZ") + get_num(&get_val(param,"text"),"initialZ") ).abs() / get_num(&get_val(param,"camera"),"depthOfField") ).to_string() + "px) opacity("+ &get_num(text,"opacity").to_string() +"%)";
            let declaration: CssStyleDeclaration = HtmlElement::style(&get_element(&target));
            CssStyleDeclaration::set_property(&declaration,"left", &(left+"%")).expect("could not set 'left' property");
            CssStyleDeclaration::set_property(&declaration,"top", &(top+"%")).expect("could not set 'top' property");
            CssStyleDeclaration::set_property(&declaration,"width", &(width+"%")).expect("could not set 'width' property");
            CssStyleDeclaration::set_property(&declaration,"height", &(height+"%")).expect("could not set 'height' property");
            CssStyleDeclaration::set_property(&declaration,"filter", &filter).expect("could not set 'filter' property");
        };
    }

    pub fn image_float(canvas: &JsValue, image: &JsValue, camera: &JsValue, config: &JsValue, param: &JsValue, pointer: &str) -> String {
        let distance_inv: f64 = 1.0 / std::cmp::max((get_num(camera,"z") - get_num(image,"z")) as i16, 1) as f64;
        let size: f64 = (get_num(&get_val(param,"camera"),"initialZ") - get_num(&get_val(param,"image"),"initialZ") ) * distance_inv;
        return "background-image:url(".to_string() + &get_str(config,"imageSrcUrl") + &get_str(image,"src") + "); 
            left:" + &(((get_num(image,"x")- get_num(camera,"x") - get_num(&get_val(param,"camera"),"vanishingX")) * get_num(image,"z")) * distance_inv + get_num(&get_val(param,"camera"),"vanishingX")).to_string() + "%;
            top:" + &(((get_num(image,"y")- get_num(camera,"y") - get_num(&get_val(param,"camera"),"vanishingY")) * get_num(image,"z")) * distance_inv + get_num(&get_val(param,"camera"),"vanishingY")).to_string() + "%;
            z-index:"+ &(get_num(image,"z")+ get_num(canvas,"z")).to_string() +";
            width:"+ &(get_num(image,"width") * size).to_string() +"%;
            height:"+ &(get_num(image,"width") * get_num(image,"aspectRatio") / get_num(canvas,"aspectRatio") * size).to_string() +"%; 
            transform:rotate("+ &get_num(image,"rotate").to_string() +"deg) scale("+ &get_num(image,"scale").to_string() +"); 
            filter:blur("+ &(get_num(image,"blur") + (get_num(canvas,"z") - get_num(image,"z") - get_num(&get_val(param,"camera"),"initialZ")  + get_num(&get_val(param,"image"),"initialZ")).abs() / get_num(&get_val(param,"camera"),"depthOfField")).to_string()+"px)    
            opacity("+ &get_num(image,"opacity").to_string()+"%) 
            saturate("+ &get_num(image,"chroma").to_string()+"%) 
            brightness("+ &get_num(image,"light").to_string()+"%);
            pointer-events:" + &pointer.to_string() +";"+ &get_str(image,"option");
    }

    pub fn image_fix(canvas: &JsValue, image: &JsValue, camera: &JsValue, config: &JsValue, pointer: &str) -> String {
        return "background-image:url(".to_string() + &get_str(config,"imageSrcUrl") + &get_str(image,"src") + "); 
            left:" + &get_num(image,"x").to_string() + "%;
            top:" + &get_num(image,"y").to_string() + "%;
            z-index:" + &get_num(camera,"z").to_string() + ";
            width:" + &get_num(image,"width").to_string() + "%;
            height:" + &(get_num(image,"width") * get_num(image,"aspectRatio") / get_num(canvas,"aspectRatio") ).to_string() + "%;
            transform: rotate(" + &get_num(image,"rotate").to_string() + "deg) scale(" + &get_num(image,"scale").to_string() +");
            filter:blur(" + &get_num(image,"blur").to_string() + "px) opacity(" + &get_num(image,"opacity").to_string() + "%) saturate(" + &get_num(image,"chroma").to_string() + "%) brightness(" + &get_num(image,"light").to_string() +"%);
            pointer-events:" + &pointer.to_string() +";"+  &get_str(image,"option");
    }

    pub fn text_float(canvas: &JsValue, text: &JsValue, camera: &JsValue, _config: &JsValue, param: &JsValue, pointer: &str) -> String {
        let distance_inv: f64 = 1.0 / std::cmp::max((get_num(camera,"z") - get_num(text,"z")) as i16, 1) as f64;
        let size: f64 = (get_num(&get_val(param,"camera"),"initialZ") - get_num(&get_val(param,"text"),"initialZ") ) * distance_inv;
        return "left:".to_string() + &(((get_num(text,"x")- get_num(camera,"x") - get_num(&get_val(param,"camera"),"vanishingX")) * get_num(text,"z")) * distance_inv + get_num(&get_val(param,"camera"),"vanishingX")).to_string() + "%;
            top:" + &(((get_num(text,"y")- get_num(camera,"y") - get_num(&get_val(param,"camera"),"vanishingY")) * get_num(text,"z")) * distance_inv + get_num(&get_val(param,"camera"),"vanishingY")).to_string() + "%;
            z-index:"+ &(get_num(text,"z")+ get_num(canvas,"z")).to_string() +";
            width:"+ &(get_num(text,"width") * size).to_string() +"%;
            height:"+ &(get_num(text,"width") * get_num(text,"aspectRatio") / get_num(canvas,"aspectRatio") * size).to_string() +"%; 
            transform:rotate("+ &get_num(text,"rotate").to_string() +"deg) scale("+ &get_num(text,"scale").to_string() +"); 
            filter:blur("+ &(get_num(text,"blur") + (get_num(canvas,"z") - get_num(text,"z") - get_num(&get_val(param,"camera"),"initialZ")  + get_num(&get_val(param,"text"),"initialZ")).abs() / get_num(&get_val(param,"camera"),"depthOfField")).to_string()+"px)   
            opacity("+ &get_num(text,"opacity").to_string()+"%) 
            saturate("+ &get_num(text,"chroma").to_string()+"%) 
            brightness("+ &get_num(text,"light").to_string()+"%);
            pointer-events:" + &pointer.to_string() +";"+ &get_str(text,"option");
    }

    pub fn text_fix(canvas: &JsValue, text: &JsValue, camera: &JsValue, _config: &JsValue, pointer: &str) -> String {
        return "left:".to_string() + &get_num(text,"x").to_string() + "%;
            top:" + &get_num(text,"y").to_string() + "%;
            z-index:" + &get_num(camera,"z").to_string() + ";
            width:" + &get_num(text,"width").to_string() + "%;
            height:" + &(get_num(text,"width") * get_num(text,"aspectRatio") / get_num(canvas,"aspectRatio") ).to_string() + "%;
            transform: rotate(" + &get_num(text,"rotate").to_string() + "deg) scale(" + &get_num(text,"scale").to_string() +");
            filter:blur(" + &get_num(text,"blur").to_string() + "px) opacity(" + &get_num(text,"opacity").to_string() + "%) saturate(" + &get_num(text,"chroma").to_string() + "%) brightness(" + &get_num(text,"light").to_string() +"%);
            pointer-events:" + &pointer.to_string() +";"+  &get_str(text,"option");
    }
}


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
            src: get_str( state1, "src"),
            x: get_num( state1, "x") + get_num( state2, "x"),
            y: get_num( state1, "y") + get_num( state2, "y"),
            z: get_num( state1, "z") + get_num( state2, "z"),
            width: get_num( state1, "width") + get_num( state2, "width"),
            aspectRatio: get_num( state1, "aspectRatio") + get_num( state2, "aspectRatio"),
            rotate: get_num( state1, "rotate") + get_num( state2, "rotate"),
            scale: get_num( state1, "scale") + get_num( state2, "scale"),
            blur: get_num( state1, "blur") + get_num( state2, "blur"),
            opacity: get_num( state1, "opacity") + get_num( state2, "opacity"),
            chroma: get_num( state1, "chroma") + get_num( state2, "chroma"),
            light: get_num( state1, "light") + get_num( state2, "light"),
            duration: get_num( state1, "duration"),
            option: get_str( state1, "option")
        };
        JsValue::from_serde(&obj).unwrap()
    }
    
    fn diff(old_state: &JsValue, new_state: &JsValue, param:&JsValue) -> JsValue {
	    let dur_inv: f64 = if get_num( new_state, "duration") > 0.0 {
            1.0 / get_num( new_state, "duration") * get_num( &get_val(param, "animation"), "skipFrame")
        }else{
            0.0
        };
        let obj = State {
            src: get_str( old_state, "src"),
            x: ( get_num( new_state, "x") - get_num( old_state, "x") )  * dur_inv,
            y: ( get_num( new_state, "y") - get_num( old_state, "y") )  * dur_inv,
            z: ( get_num( new_state, "z") - get_num( old_state, "z") )  * dur_inv,
            width: ( get_num( new_state, "width") - get_num( old_state, "width") )  * dur_inv,
            aspectRatio: ( get_num( new_state, "aspectRatio") - get_num( old_state, "aspectRatio") )  * dur_inv,
            rotate: ( get_num( new_state, "rotate") - get_num( old_state, "rotate") )  * dur_inv,
            scale: ( get_num( new_state, "scale") - get_num( old_state, "scale") )  * dur_inv,
            blur: ( get_num( new_state, "blur") - get_num( old_state, "blur") )  * dur_inv,
            opacity: ( get_num( new_state, "opacity") - get_num( old_state, "opacity") )  * dur_inv,
            chroma: ( get_num( new_state, "chroma") - get_num( old_state, "chroma") )  * dur_inv,
            light: ( get_num( new_state, "light") - get_num( old_state, "light") )  * dur_inv,
            duration: get_num( old_state, "duration"),
            option: get_str( old_state, "option")
        };
        JsValue::from_serde(&obj).unwrap()
    }
}

fn window() -> web_sys::Window {
    web_sys::window().expect("no global `window` exists")
}

fn request_animation_frame(f: &Closure<dyn FnMut()>) {
    window()
        .request_animation_frame(f.as_ref().unchecked_ref())
        .expect("should register `requestAnimationFrame` OK");
}

#[wasm_bindgen]
extern "C" {
    pub type JsPlay;
    #[wasm_bindgen(method, getter)]  pub fn parent(this: &JsPlay) -> JsPlay;
    #[wasm_bindgen(method, getter)]  pub fn diff(this: &JsPlay) -> Vec<JsValue>;
    #[wasm_bindgen(method, getter)]  pub fn state_length(this: &JsPlay) -> usize;
    #[wasm_bindgen(method, getter)]  pub fn iteration(this: &JsPlay) -> u8;
    #[wasm_bindgen(method, getter)]  pub fn target(this: &JsPlay) -> JsStructure;
    #[wasm_bindgen(method, getter)]  pub fn param(this: &JsPlay) -> JsValue;
    #[wasm_bindgen(method, getter)]  pub fn config(this: &JsPlay) -> JsValue;
    #[wasm_bindgen(method, getter)]  pub fn canvas(this: &JsPlay) -> JsValue;
    #[wasm_bindgen(method, getter)]  pub fn camera(this: &JsPlay) -> JsValue;
    #[wasm_bindgen(method, getter)]  pub fn images(this: &JsPlay) -> Vec<JsValue>;
    #[wasm_bindgen(method, getter)]  pub fn texts(this: &JsPlay) -> Vec<JsValue>;
    #[wasm_bindgen(method, setter)]  pub fn set_diff(this: &JsPlay, val:Vec<JsValue>);
    #[wasm_bindgen(method, setter)]  pub fn set_state_length(this: &JsPlay, val:usize);
    #[wasm_bindgen(method, setter)]  pub fn set_iteration(this: &JsPlay, val:u8);
}

#[wasm_bindgen]
pub struct Play {}

#[wasm_bindgen]
impl Play {
    pub fn init(play: JsPlay){
        if !play.target().running() {
			play.set_state_length(play.target().state().len());
            play.set_iteration(0);
            if play.state_length() > 1 {
                play.target().set_running(true);
                play.target().transition(&(play.target().state()[0]));
                Play::calc_diff(&play).expect("could not get diff");
            }
        }
    }

    fn calc_diff(play: &JsPlay) -> Result<(), JsValue>{
        let mut diff:Vec<JsValue> = Vec::new();
        for i in 0..(play.state_length()-1) {
            diff.push(
                Operation::diff(
                    &(play.target().state()[i]),
                    &(play.target().state()[i + 1]),
                    &play.param()
                    )
            );
        }
        play.set_diff(diff);
        Play::delay_start(&play).expect("could not delay start");
        Ok(())
    }

    fn delay_start(play: &JsPlay) -> Result<(), JsValue>{
        let delay = play.target().delay() as usize;
        let target = play.target();
        let play_clone= Rc::new(RefCell::new(play.parent())).clone();

        let f = Rc::new(RefCell::new(None));
        let g = f.clone();
        
        let mut frame = 0;
        *g.borrow_mut() = Some(Closure::wrap(Box::new(move || {
            if target.running() == true {
                if frame < delay {
                        frame += 1;
                        request_animation_frame(f.borrow().as_ref().unwrap());
                } else {
                    f.borrow_mut().take();
                    Play::iterate(&(*play_clone.borrow_mut())).expect("failed to iterate start");
                    return;
                }
            }
        }) as Box<FnMut()>));
        request_animation_frame(g.borrow().as_ref().unwrap());
        Ok(())
    }

    fn iterate(play: &JsPlay) -> Result<(), JsValue>{
        if play.iteration() == 0 {
            play.set_iteration(play.iteration()+1);
            Play::shift(play,1).expect("failed to shift");
            Ok(())

        } else if play.iteration()  > 0 && play.iteration() < play.target().iteration() {
            play.target().transition(&(play.target().state()[0]));
            play.set_iteration(play.iteration()+1);
            Play::shift(play,1).expect("failed to shift");
            Ok(())
            
        } else {
            play.set_iteration(0);
            play.target().set_running(false);
            Ok(())
        }
    }
    
    fn shift(play: &JsPlay, end_state: usize)-> Result<(), JsValue>{
        if end_state < play.state_length() {
            Play::moving(play, end_state).expect("failed to moving");
            Ok(())

        } else {
            Play::wait(play).expect("failed to wait");
            Ok(())
        }
    }
    
    fn wait(play: &JsPlay) -> Result<(), JsValue>{
        let duration = get_num(&(play.target().state()[0]),"duration") as usize;
        let target = play.target();
        let play_clone= Rc::new(RefCell::new(play.parent())).clone();

        let f = Rc::new(RefCell::new(None));
        let g = f.clone();
        
        let mut frame = 0;
        *g.borrow_mut() = Some(Closure::wrap(Box::new(move || {
            if target.running() == true {
                if frame < duration {
                        frame += 1;
                        request_animation_frame(f.borrow().as_ref().unwrap());
                } else {
                    let _ = f.borrow_mut().take();
                    Play::iterate(&(*play_clone.borrow_mut())).expect("failed to iterate start");
                    return;
                }
            }
        }) as Box<FnMut()>));
        request_animation_frame(g.borrow().as_ref().unwrap());
        Ok(())
    }

    fn moving(play: &JsPlay, end_state: usize) -> Result<(), JsValue>{
        let skip_frame = get_num(&get_val(&play.param(),"animation"),"skipFrame") as usize;
        let target = play.target();
        let diff = play.diff();
        let duration = get_num(&(play.target().state()[end_state]),"duration") as usize;
        let play_clone= Rc::new(RefCell::new(play.parent())).clone();

        let f = Rc::new(RefCell::new(None));
        let g = f.clone();

        let mut frame = 0;
        *g.borrow_mut() = Some(Closure::wrap(Box::new(move || {
            if target.running() == true {
                if frame % skip_frame== 0  {
                    if frame < duration  {
                        target.transition(
                                &Operation::add(
                                    &(target.now()),
                                    &(diff[end_state - 1])
                                )
                        );
                        frame += 1;
                        request_animation_frame(f.borrow().as_ref().unwrap());
                        
                    } else {
                        target.transition(&(target.state()[end_state]));
                        let _ = f.borrow_mut().take();
                        Play::shift(&(*play_clone.borrow_mut()),end_state+1);
                        return;
                    }
                }else{
                    frame += 1;
                    request_animation_frame(f.borrow().as_ref().unwrap());
                }
            }
        }) as Box<FnMut()>));
        request_animation_frame(g.borrow().as_ref().unwrap());
        Ok(())
    }
}