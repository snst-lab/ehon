pub struct NextTick {
    inner: JsFuture,
}
impl NextTick {
    /// Construct a new `NextTick` future.
    pub fn new() -> NextTick {
        // Create a resolved promise that will run its callbacks on the next
        // tick of the micro task queue.
        let promise = js_sys::Promise::resolve(&JsValue::NULL);
        // Convert the promise into a `JsFuture`.
        let inner = JsFuture::from(promise);
        NextTick { inner }
    }
}
impl Future for NextTick {
    type Item = ();
    type Error = ();

    fn poll(&mut self) -> Poll<(), ()> {
        // Polling a `NextTick` just forwards to polling if the inner promise is
        // ready.
        match self.inner.poll() {
            Ok(Async::Ready(_)) => Ok(Async::Ready(())),
            Ok(Async::NotReady) => Ok(Async::NotReady),
            Err(_) => unreachable!(
                "We only create NextTick with a resolved inner promise, never \
                 a rejected one, so we can't get an error here"
            ),
        }
    }
}
/// Export a function to JavaScript that does some work in the next tick of the
/// micro task queue!
#[wasm_bindgen]
pub fn next_tick() -> js_sys::Promise {
    let future = NextTick::new()
        // Do some work...
        .and_then(|_| {
            Ok(42)
        })
        // And then convert the `Item` and `Error` into `JsValue`.
        .map(|result| {
            JsValue::from(result)
        })
        .map_err(|error| {
            let js_error = js_sys::Error::new(&format!("uh oh! {:?}", error));
            JsValue::from(js_error)
        });
    // Convert the `Future<Item = JsValue, Error = JsValue>` into a JavaScript
    // `Promise`!
    future_to_promise(future)
}





 #[wasm_bindgen]
 extern "C" {
     fn requestAnimationFrame(closure: &Closure<FnMut()>) -> u32;
     fn cancelAnimationFrame(id: u32);
 }

 #[wasm_bindgen]
 pub struct AnimationFrameHandle {
     animation_id: u32,
     _closure: Closure<FnMut()>,
 }

 impl Drop for AnimationFrameHandle {
     fn drop(&mut self) {
         cancelAnimationFrame(self.animation_id);
     }
 }

 struct LogOnDrop(&'static str);
 impl Drop for LogOnDrop {
     fn drop(&mut self) {
         log(self.0);
     }
 }

 #[wasm_bindgen]
 pub fn run() -> AnimationFrameHandle {
    let cb = Closure::once(move || log("run2"));
     log("run1");
     let animation_id = requestAnimationFrame(&cb);

     AnimationFrameHandle {
         animation_id,
         _closure: cb,
     }
 }

 
// #[wasm_bindgen]
// extern "C" {
//     pub type Config;
//     #[wasm_bindgen(method, getter)]
//     pub fn imageSrcUrl(this: &Config) -> String;
// }

// #[wasm_bindgen]
// extern "C" {
//     pub type Param;
//     #[wasm_bindgen(method, getter)]  pub fn image(this: &Param) -> ParamContent;
//     #[wasm_bindgen(method, getter)]  pub fn text(this: &Param) -> ParamContent;
//     #[wasm_bindgen(method, getter)]  pub fn camera(this: &Param) -> Paramcamera;
//     #[wasm_bindgen(method, getter)]  pub fn animation(this: &Param) -> ParamAnimation;
// }

// #[wasm_bindgen]
// extern "C" {
//     pub type ParamContent;
//     #[wasm_bindgen(method, getter)]  pub fn initialZ(this: &ParamContent) -> i32;
//     #[wasm_bindgen(method, getter)]  pub fn defaultSize(this: &ParamContent) -> u16;
//     #[wasm_bindgen(method, getter)]  pub fn aspectRatio(this: &ParamContent) -> f32;
// }

// #[wasm_bindgen]
// extern "C" {
//     pub type Paramcamera;
//     #[wasm_bindgen(method, getter)]  pub fn initialX(this: &Paramcamera) -> i32;
//     #[wasm_bindgen(method, getter)]  pub fn initialY(this: &Paramcamera) -> i32;
//     #[wasm_bindgen(method, getter)]  pub fn initialZ(this: &Paramcamera) -> i32;
//     #[wasm_bindgen(method, getter)]  pub fn depthOfField(this: &Paramcamera) -> u16;
//     #[wasm_bindgen(method, getter)]  pub fn vanishingX(this: &Paramcamera) -> i32;
//     #[wasm_bindgen(method, getter)]  pub fn vanishingY(this: &Paramcamera) -> i32;
// }

// #[wasm_bindgen]
// extern "C" {
//     pub type ParamAnimation;
//     #[wasm_bindgen(method, getter)]  pub fn skipFrame(this: &ParamAnimation) ->u8;
// }


// #[wasm_bindgen]
// extern "C" {
//     pub type canvas;
//     #[wasm_bindgen(method, getter)]  pub fn z(this: &canvas) -> i32;
//     #[wasm_bindgen(method, getter)]  pub fn width(this: &canvas) -> i32;
//     #[wasm_bindgen(method, getter)]  pub fn height(this: &canvas) -> i32;
//     #[wasm_bindgen(method, getter)]  pub fn aspectRatio(this: &canvas) -> f32;
// }

// #[wasm_bindgen]
// extern "C" {
//     pub type States;
//     #[wasm_bindgen(method, getter)]  pub fn src(this: &States) -> String;
//     #[wasm_bindgen(method, getter)]  pub fn x(this: &States) -> i32;
//     #[wasm_bindgen(method, getter)]  pub fn y(this: &States) -> i32;
//     #[wasm_bindgen(method, getter)]  pub fn z(this: &States) -> i32;
//     #[wasm_bindgen(method, getter)]  pub fn width(this: &States) -> i32;
//     #[wasm_bindgen(method, getter)]  pub fn aspectRatio(this: &States) -> f32;
//     #[wasm_bindgen(method, getter)]  pub fn rotate(this: &States) -> i32;
//     #[wasm_bindgen(method, getter)]  pub fn scale(this: &States) -> f32;
//     #[wasm_bindgen(method, getter)]  pub fn blur(this: &States) -> f32;
//     #[wasm_bindgen(method, getter)]  pub fn opacity(this: &States) -> u8;
//     #[wasm_bindgen(method, getter)]  pub fn chroma(this: &States) -> u8;
//     #[wasm_bindgen(method, getter)]  pub fn light(this: &States) -> u8;
//     #[wasm_bindgen(method, getter)]  pub fn duration(this: &States) -> u32;
//     #[wasm_bindgen(method, getter)]  pub fn option(this: &States) -> String;
// }


fn document() -> web_sys::Document {
    web_sys::window().unwrap().document().unwrap()
}

pub fn camera_transition(target: &JsStructure, canvas: &JsValue, camera: &JsValue, images: &Vec<JsValue>,texts: &Vec<JsValue>, config: &JsValue, param: &JsValue) {
    let document = web_sys::window().unwrap().document().unwrap();
    target.set_now(camera);
    for i in 0..(images.len()-1) {
        let element:HtmlElement = document.query_selector(&get_str(&images[i],"className")).unwrap().unwrap().dyn_into::<web_sys::HtmlElement>().unwrap();
        // CalcCSS::image_transition_for_camera(get_bool(&images[i],"float"), &element, &canvas, &get_val(&images[i],"now"), &camera, &config, &param);
    }
    let element = document.query_selector(&get_str(&images[0],"className")).unwrap().unwrap().dyn_into::<web_sys::HtmlElement>();
}

    pub fn moving(play: &JsPlay, end_state: usize) -> Result<(), JsValue>{
        let skip_frame = get_num(&get_val(&play.param(),"animation"),"skipFrame") as usize;
        let target = play.target();
        let diff = play.diff();
        let duration = get_num(&(play.target().state()[end_state]),"duration") as usize;
        // let types = play.target().types();
        // let canvas = play.canvas();
        // let param = play.param();
        // let config = play.config();
        // let images = play.images();
        // let texts = play.texts();
        let play_clone= Rc::new(RefCell::new(play.parent())).clone();

        let f = Rc::new(RefCell::new(None));
        let g = f.clone();

        let mut frame = 0;
        *g.borrow_mut() = Some(Closure::wrap(Box::new(move || {
            if frame % skip_frame== 0 {
                if frame < duration  {
                    target.transition(
                            &Operation::add(
                                &(target.now()),
                                &(diff[end_state - 1])
                            )
                    );
                    // if types==0 {
                    //     // camera_transition(
                    //     //     &target,
                    //     //     &canvas, 
                    //     //     &Operation::add(
                    //     //         &(target.now()),
                    //     //         &(diff[end_state - 1])
                    //     //     ),
                    //     //     &images,
                    //     //     &texts,
                    //     //     &config, 
                    //     //     &param);
                    // }
                    // else if types==1  {
                    //     CalcCSS::image_transition(
                    //         &target,
                    //         &canvas, 
                    //         &Operation::add(
                    //             &(target.now()),
                    //             &(diff[end_state - 1])
                    //         ),
                    //         &(*play_clone.borrow_mut()).camera(),
                    //         &config, 
                    //         &param);
                    // }
                    // else if types==2 {
                    //     CalcCSS::text_transition(
                    //         &target,
                    //         &canvas, 
                    //         &Operation::add(
                    //             &(target.now()),
                    //             &(diff[end_state - 1])
                    //         ),
                    //         &(*play_clone.borrow_mut()).camera(),
                    //         &config, 
                    //         &param);
                    // }
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
        }) as Box<FnMut()>));
        request_animation_frame(g.borrow().as_ref().unwrap());
        Ok(())
    }
}




