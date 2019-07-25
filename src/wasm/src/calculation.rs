extern crate js_sys;
extern crate web_sys;
extern crate wasm_bindgen;

use web_sys::{HtmlElement,CssStyleDeclaration} ;
use wasm_bindgen::{prelude::*, JsCast};

pub mod getter;
use getter::Get;
pub mod structure;
use structure::JsStructure;

#[wasm_bindgen]
pub struct CalcCSS {}

#[wasm_bindgen]
impl CalcCSS{
    pub fn image_transition(target: &JsStructure, canvas: &JsValue, image: &JsValue, camera: &JsValue, config:  &JsValue, param:  &JsValue) {
        let declaration: CssStyleDeclaration = HtmlElement::style(&target.element());
        target.set_now(image);
        if target.float() {
            CssStyleDeclaration::set_css_text(&declaration, &CalcCSS::image_float(canvas, image, camera, config, param, &Get::str(target,"pointer")));
        }else{
            CssStyleDeclaration::set_css_text(&declaration, &CalcCSS::image_fix(canvas, image, camera, config , &Get::str(target,"pointer")));
        }
    }

    pub fn text_transition(target: &JsStructure, canvas: &JsValue, text: &JsValue, camera: &JsValue, param:  &JsValue) {
        let declaration: CssStyleDeclaration = HtmlElement::style(&target.element());
        target.set_now(text);
        if target.float() {
            CssStyleDeclaration::set_css_text(&declaration, &CalcCSS::text_float(canvas, text, camera, param, &Get::str(target,"pointer")));
        }else{
            CssStyleDeclaration::set_css_text(&declaration, &CalcCSS::text_fix(canvas, text, camera, &Get::str(target,"pointer")));
        }
    }

    pub fn image_transition_for_camera(target: &JsValue, canvas: &JsValue, image: &JsValue, camera: &JsValue, param: &JsValue){
       if Get::bool(&target,"float") {
            let distance_inv: f64 = 1.0 / std::cmp::max((Get::num(camera,"z") - Get::num(image,"z")) as i16, 1) as f64;
            let size: f64 = (Get::num(&Get::val(param,"camera"),"initialZ") - Get::num(&Get::val(param,"image"),"initialZ") ) * distance_inv;
            let left: String = (((Get::num(image,"x") - Get::num(camera,"x") - Get::num(&Get::val(param,"camera"),"vanishingX")) * Get::num(image,"z")) * distance_inv + Get::num(&Get::val(param,"camera"),"vanishingX")).to_string();
            let top: String = (((Get::num(image,"y") - Get::num(camera,"y") - Get::num(&Get::val(param,"camera"),"vanishingY")) * Get::num(image,"z")) * distance_inv + Get::num(&Get::val(param,"camera"),"vanishingY")).to_string();
            let width:String = (Get::num(image,"width") * size).to_string();
            let height: String = (Get::num(image,"width") * Get::num(image,"aspectRatio") / Get::num(canvas,"aspectRatio") * size).to_string();
            let filter:String = "blur(".to_string()+ &(Get::num(image,"blur") + (Get::num(camera,"z") - Get::num(image,"z") - Get::num(&Get::val(param,"camera"),"initialZ") + Get::num(&Get::val(param,"image"),"initialZ") ).abs() / Get::num(&Get::val(param,"camera"),"depthOfField") ).to_string() + "px) opacity("+ &Get::num(image,"opacity").to_string() +"%)";
            let declaration: CssStyleDeclaration = HtmlElement::style(&Get::element(&target));
            CssStyleDeclaration::set_property(&declaration,"left", &(left+"%")).expect("could not set 'left' property");
            CssStyleDeclaration::set_property(&declaration,"top", &(top+"%")).expect("could not set 'top' property");
            CssStyleDeclaration::set_property(&declaration,"width", &(width+"%")).expect("could not set 'width' property");
            CssStyleDeclaration::set_property(&declaration,"height", &(height+"%")).expect("could not set 'height' property");
            CssStyleDeclaration::set_property(&declaration,"filter", &filter).expect("could not set 'filter' property");
        };
    }

    pub fn text_transition_for_camera(target: &JsValue, canvas: &JsValue, text: &JsValue, camera: &JsValue, param: &JsValue){
       if Get::bool(&target,"float") {
            let distance_inv: f64 = 1.0 / std::cmp::max((Get::num(camera,"z") - Get::num(text,"z")) as i16, 1) as f64;
            let size: f64 = (Get::num(&Get::val(param,"camera"),"initialZ") - Get::num(&Get::val(param,"image"),"initialZ") ) * distance_inv;
            let left: String = (((Get::num(text,"x") - Get::num(camera,"x") - Get::num(&Get::val(param,"camera"),"vanishingX")) * Get::num(text,"z")) * distance_inv + Get::num(&Get::val(param,"camera"),"vanishingX")).to_string();
            let top: String = (((Get::num(text,"y") - Get::num(camera,"y") - Get::num(&Get::val(param,"camera"),"vanishingY")) * Get::num(text,"z")) * distance_inv + Get::num(&Get::val(param,"camera"),"vanishingY")).to_string();
            let width:String = (Get::num(text,"width") * size).to_string();
            let height: String = (Get::num(text,"width") * Get::num(text,"aspectRatio") / Get::num(canvas,"aspectRatio") * size).to_string();
            let filter:String = "blur(".to_string()+ &(Get::num(text,"blur") + (Get::num(camera,"z") - Get::num(text,"z") - Get::num(&Get::val(param,"camera"),"initialZ") + Get::num(&Get::val(param,"text"),"initialZ") ).abs() / Get::num(&Get::val(param,"camera"),"depthOfField") ).to_string() + "px) opacity("+ &Get::num(text,"opacity").to_string() +"%)";
            let declaration: CssStyleDeclaration = HtmlElement::style(&Get::element(&target));
            CssStyleDeclaration::set_property(&declaration,"left", &(left+"%")).expect("could not set 'left' property");
            CssStyleDeclaration::set_property(&declaration,"top", &(top+"%")).expect("could not set 'top' property");
            CssStyleDeclaration::set_property(&declaration,"width", &(width+"%")).expect("could not set 'width' property");
            CssStyleDeclaration::set_property(&declaration,"height", &(height+"%")).expect("could not set 'height' property");
            CssStyleDeclaration::set_property(&declaration,"filter", &filter).expect("could not set 'filter' property");
        };
    }

    pub fn image_float(canvas: &JsValue, image: &JsValue, camera: &JsValue, config: &JsValue, param: &JsValue, pointer: &str) -> String {
        let distance_inv: f64 = 1.0 / std::cmp::max((Get::num(camera,"z") - Get::num(image,"z")) as i16, 1) as f64;
        let size: f64 = (Get::num(&Get::val(param,"camera"),"initialZ") - Get::num(&Get::val(param,"image"),"initialZ") ) * distance_inv;
        return "background-image:url(".to_string() + &Get::str(config,"imageSrcUrl") + &Get::str(image,"src") + "); 
            left:" + &(((Get::num(image,"x")- Get::num(camera,"x") - Get::num(&Get::val(param,"camera"),"vanishingX")) * Get::num(image,"z")) * distance_inv + Get::num(&Get::val(param,"camera"),"vanishingX")).to_string() + "%;
            top:" + &(((Get::num(image,"y")- Get::num(camera,"y") - Get::num(&Get::val(param,"camera"),"vanishingY")) * Get::num(image,"z")) * distance_inv + Get::num(&Get::val(param,"camera"),"vanishingY")).to_string() + "%;
            z-index:"+ &(Get::num(image,"z")+ Get::num(canvas,"z")).to_string() +";
            width:"+ &(Get::num(image,"width") * size).to_string() +"%;
            height:"+ &(Get::num(image,"width") * Get::num(image,"aspectRatio") / Get::num(canvas,"aspectRatio") * size).to_string() +"%; 
            transform:rotate("+ &Get::num(image,"rotate").to_string() +"deg) scale("+ &Get::num(image,"scale").to_string() +"); 
            filter:blur("+ &(Get::num(image,"blur") + (Get::num(canvas,"z") - Get::num(image,"z") - Get::num(&Get::val(param,"camera"),"initialZ")  + Get::num(&Get::val(param,"image"),"initialZ")).abs() / Get::num(&Get::val(param,"camera"),"depthOfField")).to_string()+"px)    
            opacity("+ &Get::num(image,"opacity").to_string()+"%) 
            saturate("+ &Get::num(image,"chroma").to_string()+"%) 
            brightness("+ &Get::num(image,"light").to_string()+"%);
            pointer-events:" + &pointer.to_string() +";"+ &Get::str(image,"option");
    }

    pub fn image_fix(canvas: &JsValue, image: &JsValue, camera: &JsValue, config: &JsValue, pointer: &str) -> String {
        return "background-image:url(".to_string() + &Get::str(config,"imageSrcUrl") + &Get::str(image,"src") + "); 
            left:" + &Get::num(image,"x").to_string() + "%;
            top:" + &Get::num(image,"y").to_string() + "%;
            z-index:" + &Get::num(camera,"z").to_string() + ";
            width:" + &Get::num(image,"width").to_string() + "%;
            height:" + &(Get::num(image,"width") * Get::num(image,"aspectRatio") / Get::num(canvas,"aspectRatio") ).to_string() + "%;
            transform: rotate(" + &Get::num(image,"rotate").to_string() + "deg) scale(" + &Get::num(image,"scale").to_string() +");
            filter:blur(" + &Get::num(image,"blur").to_string() + "px) opacity(" + &Get::num(image,"opacity").to_string() + "%) saturate(" + &Get::num(image,"chroma").to_string() + "%) brightness(" + &Get::num(image,"light").to_string() +"%);
            pointer-events:" + &pointer.to_string() +";"+  &Get::str(image,"option");
    }

    pub fn text_float(canvas: &JsValue, text: &JsValue, camera: &JsValue, param: &JsValue, pointer: &str) -> String {
        let distance_inv: f64 = 1.0 / std::cmp::max((Get::num(camera,"z") - Get::num(text,"z")) as i16, 1) as f64;
        let size: f64 = (Get::num(&Get::val(param,"camera"),"initialZ") - Get::num(&Get::val(param,"text"),"initialZ") ) * distance_inv;
        return "left:".to_string() + &(((Get::num(text,"x")- Get::num(camera,"x") - Get::num(&Get::val(param,"camera"),"vanishingX")) * Get::num(text,"z")) * distance_inv + Get::num(&Get::val(param,"camera"),"vanishingX")).to_string() + "%;
            top:" + &(((Get::num(text,"y")- Get::num(camera,"y") - Get::num(&Get::val(param,"camera"),"vanishingY")) * Get::num(text,"z")) * distance_inv + Get::num(&Get::val(param,"camera"),"vanishingY")).to_string() + "%;
            z-index:"+ &(Get::num(text,"z")+ Get::num(canvas,"z")).to_string() +";
            width:"+ &(Get::num(text,"width") * size).to_string() +"%;
            height:"+ &(Get::num(text,"width") * Get::num(text,"aspectRatio") / Get::num(canvas,"aspectRatio") * size).to_string() +"%; 
            transform:rotate("+ &Get::num(text,"rotate").to_string() +"deg) scale("+ &Get::num(text,"scale").to_string() +"); 
            filter:blur("+ &(Get::num(text,"blur") + (Get::num(canvas,"z") - Get::num(text,"z") - Get::num(&Get::val(param,"camera"),"initialZ")  + Get::num(&Get::val(param,"text"),"initialZ")).abs() / Get::num(&Get::val(param,"camera"),"depthOfField")).to_string()+"px)   
            opacity("+ &Get::num(text,"opacity").to_string()+"%) 
            saturate("+ &Get::num(text,"chroma").to_string()+"%) 
            brightness("+ &Get::num(text,"light").to_string()+"%);
            pointer-events:" + &pointer.to_string() +";"+ &Get::str(text,"option");
    }

    pub fn text_fix(canvas: &JsValue, text: &JsValue, camera: &JsValue, pointer: &str) -> String {
        return "left:".to_string() + &Get::num(text,"x").to_string() + "%;
            top:" + &Get::num(text,"y").to_string() + "%;
            z-index:" + &(Get::num(camera,"z")+1.0).to_string() + ";
            width:" + &Get::num(text,"width").to_string() + "%;
            height:" + &(Get::num(text,"width") * Get::num(text,"aspectRatio") / Get::num(canvas,"aspectRatio") ).to_string() + "%;
            transform: rotate(" + &Get::num(text,"rotate").to_string() + "deg) scale(" + &Get::num(text,"scale").to_string() +");
            filter:blur(" + &Get::num(text,"blur").to_string() + "px) opacity(" + &Get::num(text,"opacity").to_string() + "%) saturate(" + &Get::num(text,"chroma").to_string() + "%) brightness(" + &Get::num(text,"light").to_string() +"%);
            pointer-events:" + &pointer.to_string() +";"+  &Get::str(text,"option");
    }
}
