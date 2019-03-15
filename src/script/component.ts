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
		touchable: boolean;
		state: Array<State>;
		now: State;
		element: HTMLElement;
	}

	export class Camera extends Component.Structure {
		private scene: number;
		public pointer: string;

		constructor(SceneNum: number, camera: Structure) {
			super();
			this.scene = SceneNum;
			this.type = 'camera';
			this.className = Cam.className;
			this.touchable = true;
			if (camera !== null && camera.state) {
				const state0: State = {
					src: '',
					x: camera.state[0].x || param.camera.initialX,
					y: camera.state[0].y || param.camera.initialY,
					z: camera.state[0].z || param.camera.initialZ,
					rotate: camera.state[0].rotate || 0,
					scale: null,
					blur: null,
					opacity: null,
					duration: param.animation.defaultDuration
				};
				this.state = camera.state;
				this.now = state0;
			} else {
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

		constructor(SceneNum: number, image: Structure) {
			super();
			this.scene = SceneNum;
			this.type = 'image';
			this.className = `scene${this.scene}-img${uniqueString()}`;
			this.touchable = image.touchable || true;
			this.pointer = this.touchable ? 'auto' : 'none';
			if (image.state) {
				this.state = image.state;
				const state0: State = {
					src: image.state[0].src,
					x: image.state[0].x || 50,
					y: image.state[0].y || 50,
					z: image.state[0].z || param.image.initialZ,
					rotate: image.state[0].rotate || 0,
					scale: image.state[0].scale || 1,
					blur: image.state[0].blur || 0,
					opacity: image.state[0].opacity || 1,
					duration: param.animation.defaultDuration
				};
				this.now = state0;
				this.createElement(this.className, state0);
			} else {
				this.state = [];
				this.now = image.now;
				this.createElement(this.className, image.now);
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
