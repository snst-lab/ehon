import { param, config } from './setting';
import { ComponentStructure as Structure, ComponentType as Component, ComponentState as State, ComponentCamera as Camera } from './component';
import { Canvas, Scene } from './canvas';
import { Play as WasmPlay } from '../wasm/pkg/wasm.js';

export namespace Animation {
	class Operation {
		static add(state1: State, state2: State): State {
			return {
				src: state1.src,
				x: state1.x + state2.x,
				y: state1.y + state2.y,
				z: state1.z + state2.z,
				width: state1.width + state2.width,
				aspectRatio: state1.aspectRatio + state2.aspectRatio,
				rotate: state1.rotate + state2.rotate,
				scale: state1.scale + state2.scale,
				blur: state1.blur + state2.blur,
				opacity: state1.opacity + state2.opacity,
				chroma: state1.chroma + state2.chroma,
				light: state1.light + state2.light,
				duration: state1.duration,
				option: state1.option
			};
		}
		static diff(oldState: State, newState: State): State {
			const durInv: number = newState.duration ? 1 / newState.duration * param.animation.skipFrame : 0;
			return {
				src: oldState.src,
				x: (newState.x - oldState.x) * durInv,
				y: (newState.y - oldState.y) * durInv,
				z: (newState.z - oldState.z) * durInv,
				width: (newState.width - oldState.width) * durInv,
				aspectRatio: (newState.aspectRatio - oldState.aspectRatio) * durInv,
				rotate: (newState.rotate - oldState.rotate) * durInv,
				scale: (newState.scale - oldState.scale) * durInv,
				blur: (newState.blur - oldState.blur) * durInv,
				opacity: (newState.opacity - oldState.opacity) * durInv,
				chroma: (newState.chroma - oldState.chroma) * durInv,
				light: (newState.light - oldState.light) * durInv,
				duration: oldState.duration,
				option: oldState.option
			};
		}
	}

	export class Register {
		constructor(target: Component) {
			Scene._[target.scene].dom.el.addEventListener(
				'touchend',
				(event: PointerEvent) => {
					if (!config.live) return;
					event.preventDefault();
					if ([].indexOf.call(target.trigger, (<HTMLElement>event.srcElement).classList.item(0)) > -1) {
						new Animation.Play(target);
					}
				},
				false
			);
			if (!config.live) {
				Scene._[target.scene].dom.el.addEventListener(
					'contextmenu',
					(event: PointerEvent) => {
						if (config.live) return;
						event.preventDefault();
						if ([].indexOf.call(target.trigger, (<HTMLElement>event.srcElement).classList.item(0)) > -1) {
							new Animation.Play(target);
						}
					},
					false
				);
			}
		}
	}

	export class Play{
		private parent : Play;
		private diff: Array<State>;
		private state_length: number;
		private iteration: number = 0;
		private target : Component
		private param : any;
		private config : any;
		private canvas : any;
		// private camera : Structure;

		constructor(target: Component) {
			this.target = target;
			this.param = param;
			// this.config = config;
			// this.canvas = Canvas;
			this.parent = this;
			// this.camera = Scene._[target.scene].Camera.now;
			// if(target.types ===0){
			// }
			// Scene._[target.scene].Images.forEach(e=>{
			// 	this.images.push(e.className);
			// })
			// Scene._[target.scene].Texts.forEach(e=>{
			// 	this.texts.push(e.className);
			// })
			// WasmPlay.init(this);
			this.init(this.target);
		}
		init(target:Component){
			if (target === null || target.running) return;
			this.state_length = target.state.length;
			if (this.state_length < 2) return;
			target.running = true;
			target.transition(target.state[0]);
			this.calcDiff(target);
			this.delayStart(target, 0);
		}
		calcDiff(target: Component): void {
			this.diff = [];
			for (let [ i, l ]: Array<number> = [ 0, this.state_length - 1 ]; i < l; i++) {
				this.diff.push(Operation.diff(target.state[i], target.state[i + 1]));
			}
		}
		delayStart(target: Component, frame: number): void {
			if(target.running){
				if (frame < target.delay) {
					window.requestAnimationFrame(
						() => this.delayStart(target, frame + 1)
					);
				} else {
					this.iterate(target);
				}
			}
		}
		iterate(target: Component): void {
			if (this.iteration === 0) {
				this.iteration += 1;
				this.shift(target, 1);
			} else if (this.iteration > 0 && this.iteration < target.iteration) {
				target.transition(target.state[0]);
				this.iteration += 1;
				this.shift(target, 1);
			} else {
				this.iteration = 0;
				target.running = false;
			}
		}
		shift(target: Component, endState: number): void {
			if (endState < this.state_length) {
				this.move(target, 0, endState);
				// window.requestAnimationFrame(() => (target.running ? this.move(target, 0, endState) : null));
			} else {
				this.wait(target, 0);
			}
		}
		wait(target: Component, frame: number): void {
			if(target.running){
				if (frame < target.state[0].duration) {
					window.requestAnimationFrame(
						() => this.wait(target, frame + 1)
					);
				} else {
					this.iterate(target);
				}
			}
		}
		move(target: Component, frame: number, endState: number): void {
			if(target.running){
				if (frame % param.animation.skipFrame=== 0){
					if (frame < target.state[endState].duration) {
						target.transition(Operation.add(target.now, this.diff[endState - 1]));
						window.requestAnimationFrame(
							() => this.move(target, frame + 1, endState)
						);
					} else {
						target.transition(target.state[endState]);
						this.shift(target, endState + 1);
					}
				} else {
					window.requestAnimationFrame(
						() => this.move(target, frame + 1, endState)
					);
				}
			}
		}
	}
}
export const AnimationRegister = Animation.Register;
export const AnimationPlay = Animation.Play;
