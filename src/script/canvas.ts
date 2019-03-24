import { DOM } from './domController';

export namespace Canvas {
	export const className: string = 'canvas';
	export const dom = new DOM('.' + className);
	export const element: HTMLElement = <HTMLElement>dom.el;
	export const z: number = Number(element.style.zIndex);
	export let aspectRatio: number = element.offsetHeight / element.offsetWidth;

	export class Resize {
		private running: boolean | number = false;
		constructor(callback: Function) {
			this.resizeEventSaver(callback);
		}
		resizeEventSaver(callback: Function): void {
			if (this.running) return;
			this.running = setTimeout(() => {
				this.running = false;
				callback();
			}, 500);
		}
	}
}

export namespace Scene {
	export interface Structure {
		className: string;
		dom: any;
		Camera: any;
		Images: Array<any>;
		Texts: Array<any>;
		Sounds: Array<any>;
	}
	export const className: string = 'scene';
	export let now: number = 0;
	export let _: Array<Structure> = [];

	export function change(num: number): void {
		Scene.now = num;
		_.forEach((scene, i) => {
			if (i === num) scene.dom.el.style.display = '';
			else scene.dom.el.style.display = 'none';
		});
		const event = document.createEvent('HTMLEvents');
		event.initEvent('sceneChange', true, false);
		document.dispatchEvent(event);
	}

	export function add(camera:any, images:any, texts:any, sounds:any): void {
		const num = _.length;
		Scene._.push({
			className: Scene.className + '' + num,
			dom: new DOM(
				`<div class='${Scene.className}${num} ${Scene.className}'><div class='base-layer' style='z-index:${Canvas.z}' onclick='baseLayerClick(event);'></div></div>`
			),
			Camera: camera,
			Images: images,
			Texts: texts,
			Sounds: sounds
		});
	}

	export function remove(num: number): void {
		if (_.length === 1) {
			return;
		} else {
			if (num > 0) change(num - 1);
			else change(num + 1);
		}

		_[num].dom.el.remove();
		_.splice(num, 1);
		_.forEach((scene, i) => {
			if (i >= num) {
				[ scene.Camera, ...scene.Images, ...scene.Texts ].forEach((e) => (e.scene = e.scene - 1));
				scene.dom.el.classList.remove('scene' + (i + 1));
				scene.dom.el.classList.add('scene' + i);
			}
		});
	}
}
