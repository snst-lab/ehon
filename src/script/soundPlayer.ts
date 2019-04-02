import { param, config } from './setting';
import { ComponentType as Component } from './component';
import { Scene } from './canvas';

export namespace SoundPlayer {
	export class Register {
		constructor(target: Component) {
			Scene._[target.scene].dom.el.addEventListener(
				'touchend',
				(event: PointerEvent) => {
					if (!config.live) return;
					event.preventDefault();
					if ([].indexOf.call(target.trigger, event.srcElement.classList.item(0)) > -1) {
						new SoundPlayer.Play(target);
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
						if ([].indexOf.call(target.trigger, event.srcElement.classList.item(0)) > -1) {
							new SoundPlayer.Play(target);
						}
					},
					false
				);
			}
		}
	}

	export class Play {
		private stateLength: number;
		private iteration: number = 0;

		constructor(target: Component) {
			if (target === null) return;
			this.stateLength = target.state.length;
			if (this.stateLength < 1) return;
			this.delayStart(target, 0);
		}
		delayStart(target: Component, frame: number): void {
			if (frame < target.delay) {
				window.requestAnimationFrame(() => this.delayStart(target, frame + 1));
			} else {
				this.iterate(target);
				target.element.onended = (): void => {
					this.wait(target,0);
				};
			}
		}
		iterate(target: Component): void {
			if (this.iteration < target.iteration) {
				this.iteration += 1;
				target.transition(target.state[0]);
				this.shift(target, 1);
			} else {
				this.iteration = 0;
			}
		}
		shift(target: Component, endState: number): void {
			if (endState < this.stateLength) {
				window.requestAnimationFrame(() => this.move(target, 0, endState));
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
			if (frame < target.state[endState].duration) {
				window.requestAnimationFrame(() => this.move(target, frame + 1, endState));
			} else {
				target.transition(target.state[endState]);
				this.shift(target, endState + 1);
			}
		}
	}
}
export const SoundPlayerRegister = SoundPlayer.Register;
export const SoundPlayerPlay = SoundPlayer.Play;
