import { DOM } from './domController';

export namespace Canvas {
	export const className: string = 'canvas';
	export const dom = new DOM('.' + className);
	export const element: HTMLElement = <HTMLElement>dom.el;
	export const z: number = Number(element.style.zIndex);
	export let aspectRatio: number = element.offsetHeight / element.offsetWidth;

	export class Resize {
		private running: boolean | number = false;
		constructor(callback) {
			this.resizeEventSaver(callback);
		}
		resizeEventSaver(callback: Function): void {
			if (this.running) return;
			this.running = setTimeout(function() {
				this.running = false;
				callback();
			}, 500);
		}
	}
}

namespace Scene {
	export interface Scene {
		className: string;
		dom: any;
		Camera: any;
		Images: Array<any>;
	}
	export const className: string = 'scene';
	export let now: number = 0;
	export let Scenes: Array<Scene> = [];
	export function change(num: number): void {
		Scene.now = num;
	}
}
export type Scene = Scene.Scene;
export const SceneClass = Scene.className;
export const SceneChange = Scene.change;
export let Scenes = Scene.Scenes;
export let Now = Scene.now;
