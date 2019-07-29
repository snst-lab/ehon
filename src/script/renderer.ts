import { fileReader } from './fileManager';
import { config } from './setting';
import { Canvas, Scene, Frame } from './canvas';
import { Component } from './component';
import { EditorEventHandler as editor } from './editor';
import { DOMExt } from './domController';

export namespace Renderer {
	/**
	 *  ### Renderer.Main
	 *   render all components in main view
	 */
	export class Main {
		private scene: Scene.Structure[] = [];
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
			const camera: Component.Type = new Component.Camera(this.scene[num].Camera);
			const images: Component.Type[] = [];
			this.scene[num].Images.forEach((e: Component.Type) => {
				images.push(new Component.Image(e, camera.state[0]));
			});
			const texts: Component.Type[] = [];
			this.scene[num].Texts.forEach((e: Component.Type) => {
				texts.push(new Component.Text(e, camera.state[0]));
			});
			const sounds: Component.Type[] = [];
			this.scene[num].Sounds.forEach((e: Component.Type) => {
				sounds.push(new Component.Sound(e));
			});
			Scene.add(camera, images, texts, sounds);
		}

		private renderScene(num: number): void {
			Canvas.dom.append((Scene._[num].dom as DOMExt).el as HTMLElement);

			const flag: DocumentFragment = document.createDocumentFragment();
			Scene._[num].Images.forEach((e: Component.Type) => {
				flag.appendChild(e.element);
			});
			Scene._[num].Texts.forEach((e: Component.Type) => {
				flag.appendChild(e.element);
			});
			Scene._[num].Sounds.forEach((e: Component.Type) => {
				flag.appendChild(e.element);
			});
			(Scene._[num].dom as DOMExt).append(flag);
		}
	}
}
