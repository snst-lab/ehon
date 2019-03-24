import { DOM } from './domController';
import { param, config } from './setting';
import { Scene } from './canvas';
import { calcCSS } from './calculation';

namespace Component {
	export type Type = Image | Text | Camera | Sound | null;

	export class Structure {
		scene: number;
		type: string;
		className: string;
		title: string;
		touchable: boolean;
		pointer: string;
		float: boolean;
		trigger: Array<string>;
		delay: number;
		iteration: number;
		state: Array<State>;
		now: State;
		running: boolean;
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
		chroma: number | null;
		light: number | null;
		duration: number | null;
		option: string | null;
	}

	export class Camera extends Component.Structure {
		constructor(given: Structure) {
			super();
			this.scene = given.scene;
			this.type = 'camera';
			this.className = given.className;
			this.title = given.title;
			this.touchable = true;
			this.pointer = 'auto';
			this.float = true;
			this.title = given.title || this.className;
			this.touchable = true;
			this.float = true;
			this.trigger = given.trigger || [];
			this.iteration = given.iteration || 1;
			this.delay = given.delay || 0;
			this.state = given.state;
			this.now = given.state[0];
			this.running = false;
			this.element = document.querySelector('.camera');
		}
		transition({
			src,
			x,
			y,
			z,
			width,
			aspectRatio,
			rotate,
			scale,
			blur,
			opacity,
			chroma,
			light,
			duration,
			option
		}: State): void {
			this.now = {
				src,
				x,
				y,
				z,
				width,
				aspectRatio,
				rotate,
				scale,
				blur,
				opacity,
				chroma,
				light,
				duration,
				option
			};
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
					chroma: e.now.chroma,
					light: e.now.light,
					duration: param.animation.defaultDuration,
					option: e.now.option
				});
			});
		}
	}

	export class Image extends Component.Structure {
		constructor(given: Structure, camera: State) {
			super();
			this.scene = given.scene;
			this.type = 'image';
			this.className = given.className || `img${uniqueString()}`;
			this.title = given.title || this.className;
			this.touchable = given.touchable;
			this.pointer = this.touchable ? 'auto' : 'none';
			this.float = given.float;
			this.trigger = given.trigger || [];
			this.iteration = given.iteration || 1;
			this.delay = given.delay || 0;
			this.state = given.state;
			this.now = given.state[0];
			this.running = false;
			this.createElement(this.className, given.state[0], camera);
		}
		createElement(className: string, given: State, camera: State): void {
			this.element = <HTMLElement>new DOM(`
			<div draggable="true" 
			 ondragstart="componentDragStart(event);"
			 ondragend="componentDragEnd(event);"
			 onclick="componentClick(event);"
			 onmouseup="componentMouseUp(event);"
			 class="${className} image" 
			 style="${calcCSS.imageFloat(given, camera, this.pointer)}
			 "></div>
			`).el;
		}
		transition({
			src,
			x,
			y,
			z,
			width,
			aspectRatio,
			rotate,
			scale,
			blur,
			opacity,
			chroma,
			light,
			duration,
			option
		}: State): void {
			this.now = {
				src,
				x,
				y,
				z,
				width,
				aspectRatio,
				rotate,
				scale,
				blur,
				opacity,
				chroma,
				light,
				duration,
				option
			};
			this.element.style.cssText = this.float
				? calcCSS.imageFloat(this.now, Scene._[this.scene].Camera.now, this.pointer)
				: calcCSS.imageFix(this.now, Scene._[this.scene].Camera.now, this.pointer);
		}
	}

	export class Text extends Component.Structure {
		constructor(given: Structure, camera: State) {
			super();
			this.scene = given.scene;
			this.type = 'text';
			this.className = given.className || `txt${uniqueString()}`;
			this.title = given.title || this.className;
			this.touchable = given.touchable;
			this.pointer = this.touchable ? 'auto' : 'none';
			this.float = given.float;
			this.trigger = given.trigger || [];
			this.iteration = given.iteration || 1;
			this.delay = given.delay || 0;
			this.state = given.state;
			this.now = given.state[0];
			this.running = false;
			this.createElement(this.className, given.state[0], camera);
		}
		createElement(className: string, given: State, camera: State): void {
			this.element = <HTMLElement>new DOM(`
			<div draggable="true" contenteditable="false" 
			 ondragstart="componentDragStart(event);"
			 ondragend="componentDragEnd(event);"
			 onclick="componentClick(event);"
			 onmouseup="componentMouseUp(event);"
			 class="${className} text" 
			 style="${calcCSS.textFloat(given, camera, this.pointer)}
			 ">${given.src}</div>
			`).el;
		}
		transition({
			src,
			x,
			y,
			z,
			width,
			aspectRatio,
			rotate,
			scale,
			blur,
			opacity,
			chroma,
			light,
			duration,
			option
		}: State): void {
			this.now = {
				src,
				x,
				y,
				z,
				width,
				aspectRatio,
				rotate,
				scale,
				blur,
				opacity,
				chroma,
				light,
				duration,
				option
			};
			this.element.style.cssText = this.float
				? calcCSS.textFloat(this.now, Scene._[this.scene].Camera.now, this.pointer)
				: calcCSS.textFix(this.now, Scene._[this.scene].Camera.now, this.pointer);
		}
	}

	export class Sound extends Component.Structure {
		constructor(given: Structure) {
			super();
			this.scene = given.scene;
			this.type = 'sound';
			this.className = given.className || `sound${uniqueString()}`;
			this.title = given.title || this.className;
			this.touchable = given.touchable;
			this.pointer = 'auto';
			this.float = given.float;
			this.trigger = given.trigger || [];
			this.iteration = given.iteration || 1;
			this.delay = given.delay || 0;
			this.state = given.state;
			this.now = given.state[0];
			this.running = false;
			this.createElement(this.className);
		}
		createElement(className: string): void {
			this.element = new Audio(config.soundSrcPath + this.state[0].src);
			this.element.className = className;
			const self: Sound = this;
			this.element.onended = (): void => {
				self.running = false;
			};
		}
		transition({
			src,
			x,
			y,
			z,
			width,
			aspectRatio,
			rotate,
			scale,
			blur,
			opacity,
			chroma,
			light,
			duration,
			option
		}: State): void {
			this.now = {
				src,
				x,
				y,
				z,
				width,
				aspectRatio,
				rotate,
				scale,
				blur,
				opacity,
				chroma,
				light,
				duration,
				option
			};
			const audio = <HTMLAudioElement>this.element;
			audio.src = config.soundSrcPath + src;
			audio.play().catch((error) => {
				console.log(error);
			});
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
