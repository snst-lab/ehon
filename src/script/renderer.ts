import { DOM } from './domController';
import { fileReader } from './fileManager';
import { config } from './setting';
import { Canvas, Scene, Frame } from './canvas';
import {
	ComponentStructure as Struct,
	ComponentCamera as Camera,
	ComponentImage as Image,
	ComponentText as Text,
	ComponentSound as Sound
} from './component';
import { EditorEventHandler as editor } from './editor';

namespace Renderer {
	export class Render {
		private scene: Array<Scene.Structure> = [];
		constructor() {}

		start(): Promise<void> {
			return new Promise((resolve) => {
				this.clearCanvas();
				this.loadFile(config.storyPath)
					.then(() => {
						for (let [ i, l ]: Array<number> = [ 0, this.scene.length ]; i < l; i++) {
							this.setScene(i);
							this.renderScene(i);
						}
						this.scene = [];
						resolve();
					})
					.catch(() => {
						editor.addNewScene();
						resolve();
					});
			});
		}
		private loadFile(storyPath: string): Promise<void> {
			return new Promise((resolve, reject) => {
				fileReader({ url: storyPath, type: 'GET', async: true })
					.then((data: XMLHttpRequest) => {
						const json = JSON.parse(data.responseText); 
						Frame.headerTitle.textContent = json['title'];
						this.scene = json['scenes'];
						if (this.scene.length > 0) resolve();
						else reject();
					})
					.catch(() => {
						reject();
					});
			});
		}
		private clearCanvas(): void {
			Scene._ = [];
			Canvas.dom.rewrite('');
		}
		private setScene(num: number): void {
			let camera: Struct = new Camera(this.scene[num].Camera);
			let images: Array<Struct> = [];
			this.scene[num].Images.forEach((e) => {
				images.push(new Image(e, camera.state[0]));
			});
			let texts: Array<Struct> = [];
			this.scene[num].Texts.forEach((e) => {
				texts.push(new Text(e, camera.state[0]));
			});
			let sounds: Array<Struct> = [];
			this.scene[num].Sounds.forEach((e) => {
				sounds.push(new Sound(e));
			});
			Scene.add(camera, images, texts, sounds);
		}
		private renderScene(num: number) {
			Canvas.dom.append(Scene._[num].dom.el);

			const flag = document.createDocumentFragment();
			Scene._[num].Images.forEach((e) => {
				flag.appendChild(e.element);
			});
			Scene._[num].Texts.forEach((e) => {
				flag.appendChild(e.element);
			});
			Scene._[num].Sounds.forEach((e) => {
				flag.appendChild(e.element);
			});
			Scene._[num].dom.append(flag);
		}
	}
}
export const Render = Renderer.Render;
