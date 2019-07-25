extern crate js_sys;
extern crate web_sys;
extern crate wasm_bindgen;

use std::cell::RefCell;
use std::rc::Rc;
use web_sys::{HtmlElement,CssStyleDeclaration} ;
use wasm_bindgen::{prelude::*, JsCast};

pub mod operation;
use operation::Operation;

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
    #[wasm_bindgen(method, getter)]  pub fn iteration(this: &JsPlay) -> i8;
    #[wasm_bindgen(method, getter)]  pub fn target(this: &JsPlay) -> JsStructure;
    #[wasm_bindgen(method, getter)]  pub fn param(this: &JsPlay) -> JsValue;
    #[wasm_bindgen(method, getter)]  pub fn config(this: &JsPlay) -> JsValue;
    #[wasm_bindgen(method, getter)]  pub fn canvas(this: &JsPlay) -> JsValue;
    #[wasm_bindgen(method, getter)]  pub fn camera(this: &JsPlay) -> JsValue;
    #[wasm_bindgen(method, getter)]  pub fn images(this: &JsPlay) -> Vec<JsValue>;
    #[wasm_bindgen(method, getter)]  pub fn texts(this: &JsPlay) -> Vec<JsValue>;
    #[wasm_bindgen(method, setter)]  pub fn set_diff(this: &JsPlay, val:Vec<JsValue>);
    #[wasm_bindgen(method, setter)]  pub fn set_state_length(this: &JsPlay, val:usize);
    #[wasm_bindgen(method, setter)]  pub fn set_iteration(this: &JsPlay, val:i8);
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
        
        } else if play.iteration()  < 0 {
            play.target().transition(&(play.target().state()[0]));
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
        let duration = Get::num(&(play.target().state()[0]),"duration") as usize;
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
        let skip_frame = Get::num(&Get::val(&play.param(),"animation"),"skipFrame") as usize;
        let target = play.target();
        let diff = play.diff();
        let duration = Get::num(&(play.target().state()[end_state]),"duration") as usize;
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