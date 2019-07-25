import { fileReader } from './fileManager';
import { config } from './setting';
import { Canvas, Scene, Frame } from './canvas';
import {
	ComponentType as Type,
	ComponentCamera as Camera,
	ComponentImage as Image,
	ComponentText as Text,
	ComponentSound as Sound
} from './component';
import { EditorEventHandler as editor } from './editor';
import { DOMExt } from './domController';

namespace Renderer {
	/**
	 *  ### Renderer.Main
	 *   render all components in main view
	 */
	export class Main {
		private scene: Scene.Structure[] = [];
		constructor() {
			this.start().catch((e: Error) => console.log(e));
		}
		public async start(): Promise<string> {
			return new Promise((
				resolve: (value?: string | PromiseLike<string> | undefined) => void) => {
				this.clearCanvas();
				this.loadFile(config.storyPath as string)
					.then(() => {
						for (let [i, l]: number[] = [0, this.scene.length]; i < l; i++) {
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
		private async loadFile(storyPath: string): Promise<string> {
			return new Promise((
				resolve: (value?: string | PromiseLike<string> | undefined) => void,
				reject: (value?: string | PromiseLike<string> | undefined) => void) => {
				fileReader({ 'url': storyPath, 'type': 'GET', 'async': true, 'data': '' })
					.then((data: XMLHttpRequest) => {
						// tslint:disable-next-line:no-any
						const json: any = JSON.parse(data.responseText);
						// tslint:disable-next-line: no-unsafe-any
						Frame.headerTitle.textContent = json.title;
						// tslint:disable-next-line: no-unsafe-any
						this.scene = json.scenes;
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
			const camera: Type = new Camera(this.scene[num].Camera);
			const images: Type[] = [];
			this.scene[num].Images.forEach((e: Type) => {
				images.push(new Image(e, camera.state[0]));
			});
			const texts: Type[] = [];
			this.scene[num].Texts.forEach((e: Type) => {
				texts.push(new Text(e, camera.state[0]));
			});
			const sounds: Type[] = [];
			this.scene[num].Sounds.forEach((e: Type) => {
				sounds.push(new Sound(e));
			});
			Scene.add(camera, images, texts, sounds);
		}

		private renderScene(num: number): void {
			Canvas.dom.append((Scene._[num].dom as DOMExt).el as HTMLElement);

			const flag: DocumentFragment = document.createDocumentFragment();
			Scene._[num].Images.forEach((e: Type) => {
				flag.appendChild(e.element);
			});
			Scene._[num].Texts.forEach((e: Type) => {
				flag.appendChild(e.element);
			});
			Scene._[num].Sounds.forEach((e: Type) => {
				flag.appendChild(e.element);
			});
			(Scene._[num].dom as DOMExt).append(flag);
		}
	}
}
// tslint:disable-next-line:typedef
export const Render = Renderer.Main;
