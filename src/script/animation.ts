import { config, param } from './setting';
import { Component } from './component';
import { Scene } from './canvas';
import { DOMType } from './domController';
// import { Play as WasmPlay } from '../wasm/pkg/wasm.js';

export namespace Animation {
	/** ### Animation.Operation
	 *   Define numerical operations of State Type
	 */
	class Operation {
		public static add(state1: Component.State, state2: Component.State): Component.State {
			return {
				'src': state1.src,
				'x': state1.x + state2.x,
				'y': state1.y + state2.y,
				'z': state1.z + state2.z,
				'width': state1.width + state2.width,
				'aspectRatio': state1.aspectRatio + state2.aspectRatio,
				'rotate': state1.rotate + state2.rotate,
				'scale': state1.scale + state2.scale,
				'blur': state1.blur + state2.blur,
				'opacity': state1.opacity + state2.opacity,
				'chroma': state1.chroma + state2.chroma,
				'light': state1.light + state2.light,
				'duration': state1.duration,
				'option': state1.option
			};
		}
		public static diff(oldState: Component.State, newState: Component.State): Component.State {
			const durInv: number = newState.duration > 0 ? 1 / newState.duration * param.animation.skipFrame : 0;

			return {
				'src': oldState.src,
				'x': (newState.x - oldState.x) * durInv,
				'y': (newState.y - oldState.y) * durInv,
				'z': (newState.z - oldState.z) * durInv,
				'width': (newState.width - oldState.width) * durInv,
				'aspectRatio': (newState.aspectRatio - oldState.aspectRatio) * durInv,
				'rotate': (newState.rotate - oldState.rotate) * durInv,
				'scale': (newState.scale - oldState.scale) * durInv,
				'blur': (newState.blur - oldState.blur) * durInv,
				'opacity': (newState.opacity - oldState.opacity) * durInv,
				'chroma': (newState.chroma - oldState.chroma) * durInv,
				'light': (newState.light - oldState.light) * durInv,
				'duration': oldState.duration,
				'option': oldState.option
			};
		}
	}
	/** ### Animation.Register
	 *   Register animation to HTML elements
	 */
	export class Register {
		constructor(target: Component.Type) {
			(Scene._[target.scene].dom as DOMType).el.addEventListener(
				'touchend',
				(event: PointerEvent) => {
					if (!(config.live as boolean)) return;
					event.preventDefault();
					if ([].indexOf.call(target.trigger, (event.srcElement as HTMLElement).classList.item(0)) as number > -1) {
						new Play(target);
					}
				},
				false
			);
			if (!(config.live as boolean)) {
				(Scene._[target.scene].dom as DOMType).el.addEventListener(
					'contextmenu',
					(event: PointerEvent) => {
						if (config.live as boolean) return;
						event.preventDefault();
						if ([].indexOf.call(target.trigger, (event.srcElement as HTMLElement).classList.item(0)) as number > -1) {
							new Play(target);
						}
					},
					false
				);
			}
		}
	}
	/** ### Animation.Play
	 *   Play animation of HTML Elements using requestAnimationFrame
	 */
	export class Play {
		// private parent: Play;
		private diff: Component.State[];
		private state_length: number;
		private iteration: number = 0;
		private target: Component.Type;
		private param: { [key: string]: { [key: string]: number } };

		constructor(target: Component.Type) {
			this.target = target;
			this.param = param;
			// this.parent = this; WasmPlay.init(this);
			this.init();
		}
		private init(): void {
			if (this.target.running) return;
			this.state_length = this.target.state.length;
			if (this.state_length < 2) return;
			this.target.running = true;
			this.target.element.style.willChange = 'left, top, width, height, transform, filter';
			this.calcDiff();
			this.delayStart(0);
		}
		private calcDiff(): void {
			this.diff = [];
			for (let [i, l]: number[] = [0, this.state_length - 1]; i < l; i++) {
				this.diff.push(Operation.diff(this.target.state[i], this.target.state[i + 1]));
			}
		}
		private delayStart(frame: number): void {
			if (this.target.running) {
				if (frame < this.target.delay) {
					window.requestAnimationFrame(
						() => this.delayStart(frame + 1)
					);
				} else {
					this.iterate();
				}
			}
		}
		private iterate(): void {
			if (this.target.iteration === 0) {
				// this.target.transition(this.target.state[0]);
				this.shift(1);
			} else {
				if (this.iteration === 0) {
					this.iteration += 1;
					this.shift(1);

				} else if (this.iteration > 0 && this.iteration < this.target.iteration) {
					this.target.transition(this.target.state[0]);
					this.iteration += 1;
					this.shift(1);

				} else {
					this.target.element.style.willChange = 'auto';
					this.target.running = false;
					this.iteration = 0;
				}
			}
		}
		private shift(endState: number): void {
			if (endState < this.state_length) {
				this.move(0, endState);
			} else {
				this.wait(0);
			}
		}
		private wait(frame: number): void {
			if (this.target.running) {
				if (frame < this.target.state[0].duration) {
					window.requestAnimationFrame(
						() => this.wait(frame + 1)
					);
				} else {
					this.iterate();
				}
			}
		}
		private move(frame: number, endState: number): void {
			if (this.target.running) {
				if (frame % this.param.animation.skipFrame === 0) {
					if (frame < this.target.state[endState].duration) {
						this.target.transition(Operation.add(this.target.now, this.diff[endState - 1]));
						window.requestAnimationFrame(
							() => this.move(frame + 1, endState)
						);
					} else {
						this.target.transition(this.target.state[endState]);
						this.shift(endState + 1);
					}
				} else {
					window.requestAnimationFrame(
						() => this.move(frame + 1, endState)
					);
				}
			}
		}
	}
}
// tslint:disable-next-line:typedef
export const AnimationRegister = Animation.Register;
// tslint:disable-next-line:typedef
export const AnimationPlay = Animation.Play;
