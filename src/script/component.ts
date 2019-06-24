import { DOM } from './domController';
import { param, config } from './setting';
import { Canvas, Scene } from './canvas';
import { CalcCSS } from '../wasm/pkg/wasm.js';
// import { CalcCSS } from './calculation';

namespace Component {
	export type Type = Image | Text | Camera | Sound | null;

	export class Structure {
		scene: number;
		types: number;
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
			Scene._[this.scene].Images.forEach((e) => {
				CalcCSS.image_transition_for_camera(e, Canvas, e.now, Scene._[this.scene].Camera.now, config, param);
			});
			Scene._[this.scene].Texts.forEach((e) => {
				CalcCSS.text_transition_for_camera(e, Canvas, e.now, Scene._[this.scene].Camera.now, config, param);
			});
		}
	}

	export class Image extends Component.Structure {
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
			this.iteration = given.iteration || 1;
			this.delay = given.delay || 0;
			this.running = false;
			this.state = given.state;
			this.now = given.state[0];
			this.createElement(this.className, given.state[0], camera);

		}
		createElement(className: string, given: State, camera: State): void {
			this.element = <HTMLElement>new DOM(`
			<div ${!config.live
				? `draggable="true" 
				 ondragstart="componentDragStart(event);"
				 ondragend="componentDragEnd(event);"
			     onclick="componentClick(event);"
			     onmouseup="componentMouseUp(event);"`
				: ''}
			 class="${className} image" 
			 style="${this.float ? CalcCSS.image_float(Canvas, given, camera, config, param, this.pointer) : CalcCSS.image_fix(Canvas, given, camera, config, this.pointer) }
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
			CalcCSS.image_transition(this, Canvas, this.now, Scene._[this.scene].Camera.now, config, param);
		}
	}

	export class Text extends Component.Structure {
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
			this.iteration = given.iteration || 1;
			this.delay = given.delay || 0;
			this.state = given.state;
			this.now = given.state[0];
			this.running = false;
			this.createElement(this.className, given.state[0], camera);
		}
		createElement(className: string, given: State, camera: State): void {
			this.element = <HTMLElement>new DOM(`
			<div ${!config.live
				? `draggable="true" contenteditable="false" 
				ondragstart="componentDragStart(event);"
				ondragend="componentDragEnd(event);"
				onclick="componentClick(event);"
				onblur="componentBlur(event);"
				onmouseup="componentMouseUp(event);"`
				: ''}
			 class="${className} text" 
			 style="${this.float ? CalcCSS.text_float(Canvas, given, camera, config, param, this.pointer) : CalcCSS.text_fix(Canvas, given, camera, config, this.pointer) }
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
			CalcCSS.text_transition(this, Canvas, this.now, Scene._[this.scene].Camera.now, config, param);
		}
	}

	export class Sound extends Component.Structure {
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
			if (config.volumeOn) {
				const audio = <HTMLAudioElement>this.element;
				audio.src = config.soundSrcPath + src;
				audio.play().catch((error) => {
					console.log(error);
				});
			}
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
