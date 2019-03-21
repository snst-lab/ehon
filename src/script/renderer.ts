import { param, config } from './parameter';
import { Canvas, Scene } from './canvas';

namespace Renderer {
	export class Start {
		constructor() {
			if (config.mode==='edit') {
				Scene.add();
			} else {
				for (let i = 0; i < 2; i++) {
					this.setScene(i);
					this.renderScene(i);
					// this.setComponent(i);
				}
			}
		}
		setScene(num: number) {}
		renderScene(num: number) {
			Canvas.dom.append(Scene._[num].dom.el);
		}
		setComponent(num: number) {
			//    for(let i=0; i<images.length; i++){
			//        scene[i].Images.push(new Component.Image(num,images[i]));
			//    }
		}
		renderComponent(num: number) {
			const flag = document.createDocumentFragment();
			Scene._[num].Images.forEach((e) => {
				flag.appendChild(e.element);
			});
			Scene._[num].Texts.forEach((e) => {
				flag.appendChild(e.element);
			});
			Scene._[num].dom.rewrite(flag);
		}
	}
}
export const RendererStart = Renderer.Start;
