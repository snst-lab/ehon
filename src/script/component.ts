import { DOM, DOMType } from './domController';
import { param, config } from './setting';
import { Canvas, Scene } from './canvas';
// import { CalcCSS } from '../wasm/pkg/wasm.js';
import { CalcCSS } from './calculation';

export namespace Component {
	export type Type = Image | Text | Camera | Sound;
	/**
	 * ### Component.Structure
	 *  Common structure of Camera, Image, Text, Sound objects
	 */
	export class Structure {
		public scene: number;
		public types: number;
		public className: string;
		public title: string;
		public touchable: boolean;
		public pointer: string;
		public float: boolean;
		public trigger: string[];
		public delay: number;
		public iteration: number;
		public state: State[];
		public now: State;
		public running: boolean;
		public element: HTMLElement | HTMLAudioElement | null;
	}

	export interface State {
		src: string;
		x: number;
		y: number;
		z: number;
		width: number;
		aspectRatio: number;
		rotate: number;
		scale: number;
		blur: number;
		opacity: number;
		chroma: number;
		light: number;
		duration: number;
		option: string;
	}
	/**
	 * ### Component.Camera
	 *  Definition of Camera component (1 camera per scene)
	 */
	export class Camera extends Structure {
		constructor(given: Structure) {
			super();
			this.scene = given.scene;
			this.types = 0;
			this.className = given.className;
			this.title = given.title;
			this.touchable = true;
			this.pointer = 'auto';
			this.float = true;
			this.title = given.title || this.className;
			this.touchable = true;
			this.float = true;
			this.trigger = given.trigger || [];
			this.iteration = given.iteration;
			this.delay = given.delay || 0;
			this.state = given.state;
			this.now = given.state[0];
			this.running = false;
			this.element = document.querySelector('.camera');
		}
		public transition({
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
			((Scene._[this.scene].dom as DOMType).el as HTMLElement).style.transform = `rotate(${rotate}deg)`;
			Scene._[this.scene].Images.forEach((e: Type) => {
				CalcCSS.image_transition_for_camera(e, Canvas, e.now, Scene._[this.scene].Camera.now, param);
			});
			Scene._[this.scene].Texts.forEach((e: Type) => {
				CalcCSS.text_transition_for_camera(e, Canvas, e.now, Scene._[this.scene].Camera.now, param);
			});
		}
	}
	/**
	 * ### Component.Image
	 *  Definition of Image component include HTMLElement
	 * The constructor generates a new image
	 */
	export class Image extends Structure {
		constructor(given: Structure, camera: State) {
			super();
			this.scene = given.scene;
			this.types = 1;
			this.className = given.className || `img${uniqueString()}`;
			this.title = given.title || this.className;
			this.touchable = given.touchable;
			this.pointer = this.touchable ? 'auto' : 'none';
			this.float = given.float;
			this.trigger = given.trigger || [];
			this.iteration = given.iteration;
			this.delay = given.delay || 0;
			this.running = false;
			this.state = given.state;
			this.now = given.state[0];
			this.createElement(this.className, given.state[0], camera);

		}
		public createElement(className: string, given: State, camera: State): void {
			this.element = new DOM(`
			<div ${!config.live
					? `draggable="true"
				 ondragstart="componentDragStart(event);"
				 ondragend="componentDragEnd(event);"
			     onclick="componentClick(event);"
			     onmouseup="componentMouseUp(event);"`
					: ''}
			 class="${className} image"
			 style="${this.float ? CalcCSS.image_float(Canvas, given, camera, config, param, this.pointer) : CalcCSS.image_fix(Canvas, given, camera, config, this.pointer)}
			 "></div>
			`).el as HTMLElement;
		}
		public transition({
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
			CalcCSS.image_transition(this, Canvas, this.now, Scene._[this.scene].Camera.now, config, param);
		}
	}
	/**
	 * ### Component.Text
	 *  Definition of Text component include HTMLElement
	 * The constructor generates a new text
	 */
	export class Text extends Structure {
		constructor(given: Structure, camera: State) {
			super();
			this.scene = given.scene;
			this.types = 2;
			this.className = given.className || `txt${uniqueString()}`;
			this.title = given.title || this.className;
			this.touchable = given.touchable;
			this.pointer = this.touchable ? 'auto' : 'none';
			this.float = given.float;
			this.trigger = given.trigger || [];
			this.iteration = given.iteration;
			this.delay = given.delay || 0;
			this.state = given.state;
			this.now = given.state[0];
			this.running = false;
			this.createElement(this.className, given.state[0], camera);
		}
		public createElement(className: string, given: State, camera: State): void {
			this.element = new DOM(`
			<div ${!config.live
					? `draggable="true" contenteditable="false"
				ondragstart="componentDragStart(event);"
				ondragend="componentDragEnd(event);"
				onclick="componentClick(event);"
				onblur="componentBlur(event);"
				onmouseup="componentMouseUp(event);"
				onresize="componentResize(event);"`
					: ''}
			 class="${className} text"
			 style="${this.float ? CalcCSS.text_float(Canvas, given, camera, param, this.pointer) : CalcCSS.text_fix(Canvas, given, camera, this.pointer)}
			 ">${given.src}</div>
			`).el as HTMLElement;
		}
		public transition({
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
			CalcCSS.text_transition(this, Canvas, this.now, Scene._[this.scene].Camera.now, param);
		}
	}
	/**
	 * ### Component.Sound
	 *  Definition of Sound component include HTMLAudioElement
	 * The constructor generates a new sound
	 */
	export class Sound extends Structure {
		constructor(given: Structure) {
			super();
			this.scene = given.scene;
			this.types = 3;
			this.className = given.className || `sound${uniqueString()}`;
			this.title = given.title || this.className;
			this.touchable = given.touchable;
			this.pointer = 'auto';
			this.float = given.float;
			this.trigger = given.trigger || [];
			this.iteration = given.iteration;
			this.delay = given.delay || 0;
			this.state = given.state;
			this.now = given.state[0];
			this.running = false;
			this.createElement(this.className);
		}
		public createElement(className: string): void {
			this.element = new Audio(config.soundSrcPath as string + this.state[0].src);
			this.element.className = className;
		}
		public transition({
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
			if (config.volumeOn) {
				const audio: HTMLAudioElement = this.element as HTMLAudioElement;
				audio.src = config.soundSrcPath as string + src;
				audio.play().catch((error: Error) => {
					console.log(error);
				});
			}
		}
	}
	const uniqueString: () => string = (): string =>
		// tslint:disable-next-line: restrict-plus-operands
		new Date().getTime().toString(16) + ~~(Math.random() * 1000).toString(16);
}
export type ComponentType = Component.Type;
export type ComponentState = Component.State;
export type ComponentStructure = Component.Structure;
// tslint:disable-next-line:typedef
export const ComponentCamera = Component.Camera;
// tslint:disable-next-line:typedef
export const ComponentImage = Component.Image;
// tslint:disable-next-line:typedef
export const ComponentText = Component.Text;
// tslint:disable-next-line:typedef
export const ComponentSound = Component.Sound;
