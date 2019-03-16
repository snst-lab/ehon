import { param } from './parameter';
import { ComponentType as Component, ComponentState as State } from './component';
import { Canvas, Scenes as scene, Now as now } from './canvas';

export namespace Animation {
	class Operation {
		add(state1: State, state2: State): State {
			return {
				src: state1.src,
				x: state1.x + state2.x,
				y: state1.y + state2.y,
				z: state1.z + state2.z,
				rotate: state1.rotate + state2.rotate,
				scale: state1.scale + state2.scale,
				blur: state1.blur + state2.blur,
				opacity: state1.opacity + state2.opacity,
				duration: state1.duration
			};
		}
		diff(oldState: State, newState: State): State {
			const durInv: number = newState.duration ? 1 / newState.duration * param.animation.skipFrame : 0;
			return {
				src: oldState.src,
				x: (newState.x - oldState.x) * durInv,
				y: (newState.y - oldState.y) * durInv,
				z: (newState.z - oldState.z) * durInv,
				rotate: (newState.rotate - oldState.rotate) * durInv,
				scale: (newState.scale - oldState.scale) * durInv,
				blur: (newState.blur - oldState.blur) * durInv,
				opacity: (newState.opacity - oldState.opacity) * durInv,
				duration: oldState.duration
			};
		}
	}

	export class Register {
		constructor(target: Component, eventName: string) {
			if (target.state.length !== 1) return;
			scene[now].dom.el.addEventListener(
				eventName,
				(event: PointerEvent) => {
					event.preventDefault();
					if (
						[].indexOf.call(target.trigger, event.srcElement.classList.item(0)) > -1 ||
						[].indexOf.call(target.trigger, 'scene' + now) > -1
					) {
						new Animation.Play(target);
					}
				},
				false
			);
			document.addEventListener(
				'sceneChange',
				(event: Event) => {
					if (
						[].indexOf.call(target.trigger, event.srcElement.classList.item(0) || 'scenechange' + now) > -1
					) {
						new Animation.Play(target);
					}
				},
				false
			);
		}
	}

	export class Play {
		private op = new Operation();
		private diff: Array<State>;
		private stateLength: number;
		private iteration: number = 0;

		constructor(target: Component) {
			if (target === null || target.running) return;
			this.stateLength = target.state.length;
			if (this.stateLength < 2) return;
			target.running = true;
			this.calcDiff(target);
			this.delayStart(target, 0);
		}
		calcDiff(target: Component): void {
			this.diff = [];
			for (let [ i, l ]: Array<number> = [ 0, this.stateLength - 1 ]; i < l; i++) {
				this.diff.push(this.op.diff(target.state[i], target.state[i + 1]));
			}
		}
		delayStart(target: Component, frame: number): void {
			if (frame < target.delay) {
				window.requestAnimationFrame(() => this.delayStart(target, frame + 1));
			} else {
				this.iterate(target);
			}
		}
		iterate(target: Component): void {
			if (this.iteration < target.iteration) {
				this.iteration += 1;
				target.transition(target.state[0], '');
				this.shift(target, 1);
			} else {
				this.iteration = 0;
				target.running = false;
			}
		}
		shift(target: Component, endState: number): void {
			if (endState < this.stateLength) {
				window.requestAnimationFrame(() => this.move(target, 0, endState));
			} else {
				this.wait(target, 0);
			}
		}
		wait(target: Component, frame: number): void {
			if (frame < target.state[0].duration) {
				window.requestAnimationFrame(() => this.wait(target, frame + 1));
			} else {
				this.iterate(target);
			}
		}
		move(target: Component, frame: number, endState: number): void {
			if (frame % param.animation.skipFrame === 0) {
				if (frame < target.state[endState].duration) {
					target.transition(this.op.add(target.now, this.diff[endState - 1]), '');
					window.requestAnimationFrame(() => this.move(target, frame + 1, endState));
				} else {
					target.transition(target.state[endState], '');
					this.shift(target, endState + 1);
				}
			} else {
				window.requestAnimationFrame(() => this.move(target, frame + 1, endState));
			}
		}
	}
}
export const AnimationRegister = Animation.Register;
export const AnimationPlay = Animation.Play;
