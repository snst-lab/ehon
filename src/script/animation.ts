import { param } from './parameter';
import { ComponentType as Component, ComponentState as State } from './component';

namespace Animation {
	let playing: boolean = false;
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

	export class Play {
		private op = new Operation();
		register(origin: Component, target: Component, eventName: string): void {
			if (target.state.length !== 1) return;
			origin.element.addEventListener(
				eventName,
				(event: any) => {
					event.preventDefault();
					this.play(target);
				},
				false
			);
		}

		play(target: Component): void {
			// if (target.running) return;
			// target.running = true;
			if (target.state.length < 2) return;
			target.transition(target.state[0], '');
			const stateDiff: State = this.op.diff(target.state[0], target.state[1]);
			window.requestAnimationFrame(() => this.update(target, 0, 1, stateDiff));
		}

		update(target: Component, frame: number, endState: number, stateDiff: State): void {
			if (frame % param.animation.skipFrame === 0) {
				if (frame < target.state[endState].duration) {
					target.transition(this.op.add(target.now, stateDiff), '');
					window.requestAnimationFrame(() => this.update(target, frame + 1, endState, stateDiff));
				} else {
					if (endState < target.state.length - 1) {
						target.transition(target.state[endState], '');
						const stateDiff: State = this.op.diff(target.state[endState], target.state[endState + 1]);
						window.requestAnimationFrame(() => this.update(target, 0, endState + 1, stateDiff));
					} else {
						target.transition(target.state[endState], '');
						// target.running.false = false;
					}
				}
			} else {
				window.requestAnimationFrame(() => this.update(target, frame + 1, endState, stateDiff));
			}
		}
	}
}
export const AnimationPlay = Animation.Play;
