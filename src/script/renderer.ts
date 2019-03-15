import { DOM } from './domController';
import { param, config } from './parameter';
import { Canvas, SceneClass, Scenes as scene } from './canvas';
import { PalletKeyframe as Keyframe, PalletCamera as Cam } from './pallet';
import { ComponentCamera as Camera } from './component';
import { Active, EditorSelector as Selector } from './editor';

namespace Renderer {
	const selector = new Selector();
	export class Start {
		constructor() {
			for (let i = 0; i < 1; i++) {
				this.setScene(i);
				this.renderScene(i);
				this.setComponent(i);
			}
		}
		setScene(num: number) {
			scene.push({
				className: SceneClass + '' + num,
				dom: new DOM(`<div class='${SceneClass}${num} ${SceneClass}'><div class='base-layer' style='z-index:${Canvas.z}'></div></div>`),
				Camera: null,
				Images: []
			});
		}
		renderScene(num: number) {
			Canvas.dom.append(scene[num].dom.el);
		}
		setComponent(num: number) {
			scene[num].Camera = new Camera(num, null);
			selector.activate(Cam.className,'camera');
			Active.state.push(Active.now);
			Keyframe.render(Active);
			//    for(let i=0; i<images.length; i++){
			//        scene[i].Images.push(new Component.Image(num,images[i]));
			//    }
		}
		renderComponent(num: number) {
			const flag = document.createDocumentFragment();
			scene[num].Images.forEach((e) => {
				flag.appendChild(e.element);
			});
			scene[num].dom.rewrite(flag);
		}
	}
}
export const RendererStart = Renderer.Start;