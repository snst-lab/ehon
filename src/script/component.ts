import { DOM } from './domController';
import { param, config } from './parameter';
import { Scenes as scene } from './canvas';
import { PalletCamera as Cam } from './pallet';
import { CalcCSS } from './calculation';

namespace Component {
	export type Type = Image | Camera | null;
	const calcCSS = new CalcCSS();

	export interface State {
		src: string | null;
		x: number | null;
		y: number | null;
		z: number | null;
		rotate: number | null;
		scale: number | null;
		blur: number | null;
		opacity: number | null;
		duration: number | null;
	}

	export class Structure {
		type: string;
		className: string;
		title: string;
		touchable: boolean;
		trigger:Array<string>;
		delay:number;
		iteration:number;
		running:boolean;
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
			this.pointer = 'auto';
			this.running = false;
			if (given !== null && given.state && given.trigger && given.iteration && given.delay) {
				this.trigger = given.trigger || [];
				this.iteration = given.iteration || 1;
				this.delay = given.delay || 0;
				const state0: State = {
					src: '',
					x: given.state[0].x || param.given.initialX,
					y: given.state[0].y || param.given.initialY,
					z: given.state[0].z || param.given.initialZ,
					rotate: given.state[0].rotate || 0,
					scale: null,
					blur: null,
					opacity: null,
					duration: param.animation.defaultDuration
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
					rotate: 0,
					scale: null,
					blur: null,
					opacity: null,
					duration: param.animation.defaultDuration
				};
				this.state = [];
				this.now = state0;
			}
			this.element = <HTMLElement>Cam.dom.el;
		}
		transition({ src, x, y, z, rotate, scale, blur, opacity, duration }: State, option: string): void {
			this.now = { src, x, y, z, rotate, scale, blur, opacity, duration };

			scene[this.scene].Images.forEach((e) => {
				e.transition(
					{
						src: e.now.src,
						x: e.now.x,
						y: e.now.y,
						z: e.now.z,
						rotate: e.now.rotate,
						scale: e.now.scale,
						blur: e.now.blur,
						opacity: e.now.opacity,
						duration: param.animation.defaultDuration
					},
					''
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
					z: given.state[0].z || param.given.initialZ,
					rotate: given.state[0].rotate || 0,
					scale: given.state[0].scale || 1,
					blur: given.state[0].blur || 0,
					opacity: given.state[0].opacity || 1,
					duration: param.animation.defaultDuration
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
			 ondragstart="${config.imageDragStart}(event);"
			 ondragend="${config.imageDragEnd}(event);"
			 onclick="${config.imageClick}(event);"
			 ondblclick="${config.imageDoubleClick}(event);"
			 class="${className} component-img" 
			 style="${calcCSS.image(state, scene[this.scene].Camera.now, this.pointer, '')}
			 "></div>
			`).el;
		}
		transition({ src, x, y, z, rotate, scale, blur, opacity, duration }: State, option: string): void {
			this.now = { src, x, y, z, rotate, scale, blur, opacity, duration };
			this.element.style.cssText = calcCSS.image(
				this.now,
				scene[this.scene].Camera.now,
				this.pointer,
				option
			);
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
