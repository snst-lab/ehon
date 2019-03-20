import { DOM } from './domController';
import { param, config } from './parameter';
import { Scenes as scene } from './canvas';
import { PalletCamera as Cam } from './pallet';
import { CalcCSS } from './calculation';

namespace Component {
	export type Type = Image | Text | Camera | null;
	const calcCSS = new CalcCSS();

	export interface State {
		src: string | null;
		x: number | null;
		y: number | null;
		z: number | null;
		width: number | null;
		aspectRatio: number | null;
		rotate: number | null;
		scale: number | null;
		blur: number | null;
		opacity: number | null;
		duration: number | null;
		option: string | null;
	}

	export class Structure {
		type: string;
		className: string;
		title: string;
		touchable: boolean;
		float: boolean;
		trigger: Array<string>;
		delay: number;
		iteration: number;
		running: boolean;
		state: Array<State>;
		now: State;
		element: HTMLElement;
	}

	export class Camera extends Component.Structure {
		private scene: number;
		public pointer: string;

		constructor(SceneNum: number, given: Structure) {
			super();
			this.scene = SceneNum;
			this.type = 'camera';
			this.className = Cam.className;
			this.title = 'Camera';
			this.touchable = true;
			this.float = true;
			this.pointer = 'auto';
			this.running = false;
			if (given !== null && given.state && given.trigger && given.iteration && given.delay) {
				this.trigger = given.trigger || [];
				this.iteration = given.iteration || 1;
				this.delay = given.delay || 0;
				const state0: State = {
					src: '',
					x: given.state[0].x || param.camera.initialX,
					y: given.state[0].y || param.camera.initialY,
					z: given.state[0].z || param.camera.initialZ,
					width: null,
					aspectRatio: null,
					rotate: given.state[0].rotate || 0,
					scale: null,
					blur: null,
					opacity: null,
					duration: param.animation.defaultDuration,
					option: ''
				};
				this.state = given.state;
				this.now = state0;
			} else {
				this.trigger = [];
				this.iteration = 1;
				this.delay = 0;
				const state0: State = {
					src: '',
					x: param.camera.initialX,
					y: param.camera.initialY,
					z: param.camera.initialZ,
					width: null,
					aspectRatio: null,
					rotate: 0,
					scale: null,
					blur: null,
					opacity: null,
					duration: param.animation.defaultDuration,
					option: ''
				};
				this.state = [];
				this.now = state0;
			}
			this.element = <HTMLElement>Cam.dom.el;
		}
		transition({ src, x, y, z, width, aspectRatio, rotate, scale, blur, opacity, duration, option }: State): void {
			this.now = { src, x, y, z, width, aspectRatio, rotate , scale, blur, opacity, duration, option };
			scene[this.scene].dom.el.style.transform = `rotate(${rotate}deg)`;

			[ ...scene[this.scene].Images, ...scene[this.scene].Texts ].forEach((e) => {
				e.transition(
					{
						src: e.now.src,
						x: e.now.x,
						y: e.now.y,
						z: e.now.z,
						width: e.now.width,
						aspectRatio: e.now.aspectRatio,
						rotate: e.now.rotate,
						scale: e.now.scale,
						blur: e.now.blur,
						opacity: e.now.opacity,
						duration: param.animation.defaultDuration,
						option: e.now.option
					}
				);
			});
		}
	}

	export class Image extends Component.Structure {
		private scene: number;
		public pointer: string;

		constructor(SceneNum: number, given: Structure) {
			super();
			this.scene = SceneNum;
			this.type = 'image';
			this.className = given.className || `scene${this.scene}-img${uniqueString()}`;
			this.title = given.title || this.className;
			this.touchable = given.touchable || true;
			this.float = given.float || true;
			this.pointer = this.touchable ? 'auto' : 'none';
			this.trigger = given.trigger || [];
			this.iteration = given.iteration || 1;
			this.delay = given.delay || 0;
			this.running = false;

			if (given.state) {
				this.state = given.state;
				const state0: State = {
					src: given.state[0].src,
					x: given.state[0].x || 50,
					y: given.state[0].y || 50,
					z: given.state[0].z || param.image.initialZ,
					width: given.state[0].width || param.image.defaultSize,
					aspectRatio: given.state[0].aspectRatio || param.image.aspectRatio,
					rotate: given.state[0].rotate || 0,
					scale: given.state[0].scale || 1,
					blur: given.state[0].blur || 0,
					opacity: given.state[0].opacity || 1,
					duration: param.animation.defaultDuration,
					option: ''
				};
				this.now = state0;
				this.createElement(this.className, state0);
			} else {
				this.state = [];
				this.now = given.now;
				this.createElement(this.className, given.now);
			}
		}
		createElement(className: string, state: State): void {
			this.element = <HTMLElement>new DOM(`
			<div draggable="true" 
			 ondragstart="componentDragStart(event);"
			 ondragend="componentDragEnd(event);"
			 onclick="componentClick(event);"
			 onmouseup="componentMouseUp(event);"
			 class="${className} image" 
			 style="${calcCSS.imageFloat(state, scene[this.scene].Camera.now, this.pointer)}
			 "></div>
			`).el;
		}
		transition({ src, x, y, z, width, aspectRatio, rotate, scale, blur, opacity, duration, option }: State): void {
			this.now = { src, x, y, z, width, aspectRatio, rotate, scale, blur, opacity, duration, option };
			this.element.style.cssText = this.float
				? calcCSS.imageFloat(this.now, scene[this.scene].Camera.now, this.pointer)
				: calcCSS.imageFix(this.now, scene[this.scene].Camera.now, this.pointer);
		}
	}

	export class Text extends Component.Structure {
		private scene: number;
		public pointer: string;

		constructor(SceneNum: number, given: Structure) {
			super();
			this.scene = SceneNum;
			this.type = 'text';
			this.className = given.className || `scene${this.scene}-txt${uniqueString()}`;
			this.title = given.title || this.className;
			this.touchable = given.touchable || true;
			this.float = given.float || true;
			this.pointer = this.touchable ? 'auto' : 'none';
			this.trigger = given.trigger || [];
			this.iteration = given.iteration || 1;
			this.delay = given.delay || 0;
			this.running = false;

			if (given.state) {
				this.state = given.state;
				const state0: State = {
					src: given.state[0].src,
					x: given.state[0].x || 50,
					y: given.state[0].y || 50,
					z: given.state[0].z || param.text.initialZ,
					width: given.state[0].width || param.text.defaultSize,
					aspectRatio: given.state[0].aspectRatio || param.text.aspectRatio,
					rotate: given.state[0].rotate || 0,
					scale: given.state[0].scale || 1,
					blur: given.state[0].blur || 0,
					opacity: given.state[0].opacity || 1,
					duration: param.animation.defaultDuration,
					option: ''
				};
				this.now = state0;
				this.createElement(this.className, state0);
			} else {
				this.state = [];
				this.now = given.now;
				this.createElement(this.className, given.now);
			}
			this.addEventListner();
		}
		createElement(className: string, state: State): void {
			this.element = <HTMLElement>new DOM(`
			<div draggable="true" 
			 ondragstart="componentDragStart(event);"
			 ondragend="componentDragEnd(event);"
			 onclick="componentClick(event);"
			 ondblclick="componentDoubleClick(event);"
			 onmouseup="componentMouseUp(event);"
			 contenteditable="true" 
			 class="${className} text" 
			 style="${calcCSS.textFloat(state, scene[this.scene].Camera.now, this.pointer)};"
			 >${state.src}</div>
			`).el;
		}
		addEventListner(): void {
			this.element.addEventListener('blur', () => {
				this.now.src = this.element.textContent;
			});
		}
		transition({ src, x, y, z, width, aspectRatio, rotate, scale, blur, opacity, duration, option }: State): void {
			this.now = { src, x, y, z, width, aspectRatio, rotate, scale, blur, opacity, duration, option };
			this.element.textContent = this.now.src;
			this.element.style.cssText = this.float
				? calcCSS.textFloat(this.now, scene[this.scene].Camera.now, this.pointer)
				: calcCSS.textFix(this.now, scene[this.scene].Camera.now, this.pointer);
		}
	}

	const uniqueString = (): string =>
		new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16);
}
export type ComponentType = Component.Type;
export type ComponentState = Component.State;
export type ComponentStructure = Component.Structure;
export const ComponentCamera = Component.Camera;
export const ComponentImage = Component.Image;
export const ComponentText = Component.Text;
