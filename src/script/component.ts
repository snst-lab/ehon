import { DOM } from './domController';
import { param, config } from './parameter';
import { Scene } from './canvas';
import { CalcCSS } from './calculation';

namespace Component {
	export type Type = Image | Text | Camera | Sound | null;
	const calcCSS = new CalcCSS();

	export class Structure {
		scene: number;
		type: string;
		className: string;
		title: string;
		touchable: boolean;
		float: boolean;
		trigger: Array<string>;
		delay: number;
		iteration: number;
		state: Array<State>;
		now: State;
		element: HTMLElement | HTMLAudioElement;
	}

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

	export class Camera extends Component.Structure {
		public pointer: string;
		public running: boolean;

		constructor(given: Structure) {
			super();
			this.scene = given.scene;
			this.type = 'camera';
			this.className = given.className;
			this.title = given.title;
			this.touchable = true;
			this.float = true;
			this.title = given.title || this.className;
			this.touchable = true;
			this.float = true;
			this.trigger = given.trigger || [];
			this.iteration = given.iteration || 1;
			this.delay = given.delay || 0;
			this.state = given.state || [];
			this.now = given.now;
			this.element = given.element;
			this.pointer = 'auto';
			this.running = false;
		}
		transition({ src, x, y, z, width, aspectRatio, rotate, scale, blur, opacity, duration, option }: State): void {
			this.now = { src, x, y, z, width, aspectRatio, rotate, scale, blur, opacity, duration, option };
			Scene._[this.scene].dom.el.style.transform = `rotate(${rotate}deg)`;

			[ ...Scene._[this.scene].Images, ...Scene._[this.scene].Texts ].forEach((e) => {
				e.transition({
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
				});
			});
		}
	}

	export class Image extends Component.Structure {
		public pointer: string;
		public running: boolean;

		constructor(given: Structure) {
			super();
			this.scene = given.scene;
			this.type = 'image';
			this.className = given.className || `img${uniqueString()}`;
			this.title = given.title || this.className;
			this.touchable = given.touchable || true;
			this.float = given.float || true;
			this.trigger = given.trigger || [];
			this.iteration = given.iteration || 1;
			this.delay = given.delay || 0;
			this.state = given.state || [];
			this.now = given.now;
			this.createElement(this.className, given.now);
			this.pointer = this.touchable ? 'auto' : 'none';
			this.running = false;
		}
		createElement(className: string, state: State): void {
			this.element = <HTMLElement>new DOM(`
			<div draggable="true" 
			 ondragstart="componentDragStart(event);"
			 ondragend="componentDragEnd(event);"
			 onclick="componentClick(event);"
			 onmouseup="componentMouseUp(event);"
			 class="${className} image" 
			 style="${calcCSS.imageFloat(state, Scene._[this.scene].Camera.now, this.pointer)}
			 "></div>
			`).el;
		}
		transition({ src, x, y, z, width, aspectRatio, rotate, scale, blur, opacity, duration, option }: State): void {
			this.now = { src, x, y, z, width, aspectRatio, rotate, scale, blur, opacity, duration, option };
			this.element.style.cssText = this.float
				? calcCSS.imageFloat(this.now, Scene._[this.scene].Camera.now, this.pointer)
				: calcCSS.imageFix(this.now, Scene._[this.scene].Camera.now, this.pointer);
		}
	}

	export class Text extends Component.Structure {
		public pointer: string;
		public running: boolean;

		constructor(given: Structure) {
			super();
			this.scene = given.scene;
			this.type = 'text';
			this.className = given.className || `txt${uniqueString()}`;
			this.title = given.title || this.className;
			this.touchable = given.touchable || true;
			this.float = given.float || true;
			this.trigger = given.trigger || [];
			this.iteration = given.iteration || 1;
			this.delay = given.delay || 0;
			this.state = given.state || [];
			this.now = given.now;
			this.createElement(this.className, given.now);
			this.pointer = this.touchable ? 'auto' : 'none';
			this.running = false;
		}
		createElement(className: string, state: State): void {
			this.element = <HTMLElement>new DOM(`
			<div draggable="true" contenteditable="false" 
			 ondragstart="componentDragStart(event);"
			 ondragend="componentDragEnd(event);"
			 onclick="componentClick(event);"
			 onmouseup="componentMouseUp(event);"
			 class="${className} text" 
			 style="${calcCSS.textFloat(state, Scene._[this.scene].Camera.now, this.pointer)}
			 ">${state.src}</div>
			`).el;
		}
		transition({ src, x, y, z, width, aspectRatio, rotate, scale, blur, opacity, duration, option }: State): void {
			this.now = { src, x, y, z, width, aspectRatio, rotate, scale, blur, opacity, duration, option };
			this.element.style.cssText = this.float
				? calcCSS.textFloat(this.now, Scene._[this.scene].Camera.now, this.pointer)
				: calcCSS.textFix(this.now, Scene._[this.scene].Camera.now, this.pointer);
		}
	}

	export class Sound extends Component.Structure {
		public pointer: string;
		public running: boolean;

		constructor(given: Structure) {
			super();
			this.scene = given.scene;
			this.type = 'sound';
			this.className = given.className || `sound${uniqueString()}`;
			this.title = given.title || this.className;
			this.touchable = given.touchable || true;
			this.float = given.float || true;
			this.trigger = given.trigger || [];
			this.iteration = given.iteration || 1;
			this.delay = given.delay || 0;
			this.state = given.state || [];
			this.now = given.now;
			this.element = new Audio(config.soundSrcPath + this.state[0].src);
			const self: Sound = this;
			this.element.onended = (): void => {
				self.running = false;
			};
			this.pointer = 'auto';
			this.running = false;
		}
		transition({ src, x, y, z, width, aspectRatio, rotate, scale, blur, opacity, duration, option }: State): void {
			this.now = { src, x, y, z, width, aspectRatio, rotate, scale, blur, opacity, duration, option };
			const audio = <HTMLAudioElement>this.element;
			audio.pause();
			audio.currentTime = 0.0;
			audio.src = config.soundSrcPath+src;
			audio.play();
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
export const ComponentSound = Component.Sound;
