import { config } from './setting';
import { ComponentType as Component } from './component';
import { Scene } from './canvas';
import { DOMType } from './domController';

export namespace SoundPlayer {
	/**
	 * ### SoundPlayer.Register
	 *   Register sound player to HTMLAudioElements
	 */
	export class Register {
		constructor(target: Component) {
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
			if (!config.live) {
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
	/**
	 * ### SoundPlayer.Play
	 *   Play sound of HTMLAudioElements
	 */
	export class Play {
		private stateLength: number;
		private iteration: number = 0;

		constructor(target: Component) {
			this.stateLength = target.state.length;
			if (this.stateLength < 1) return;
			this.delayStart(target, 0);
		}
		private delayStart(target: Component, frame: number): void {
			if (frame < target.delay) {
				window.requestAnimationFrame(() => this.delayStart(target, frame + 1));
			} else {
				this.iterate(target);
				target.element.onended = (): void => {
					this.wait(target, 0);
				};
			}
		}
		private iterate(target: Component): void {
			if (target.iteration === 0) {
				target.transition(target.state[0]);
				this.shift(target, 1);
			} else {
				if (this.iteration < target.iteration) {
					this.iteration += 1;
					target.transition(target.state[0]);
					this.shift(target, 1);
				} else {
					this.iteration = 0;
				}
			}
		}
		private shift(target: Component, endState: number): void {
			if (endState < this.stateLength) {
				this.move(target, 0, endState);
			}
		}
		private wait(target: Component, frame: number): void {
			if (frame < target.state[0].duration) {
				window.requestAnimationFrame(() => this.wait(target, frame + 1));
			} else {
				this.iterate(target);
			}
		}
		private move(target: Component, frame: number, endState: number): void {
			if (frame < target.state[endState].duration) {
				window.requestAnimationFrame(() => this.move(target, frame + 1, endState));
			} else {
				target.transition(target.state[endState]);
				this.shift(target, endState + 1);
			}
		}
	}
}
// tslint:disable-next-line:typedef
export const SoundPlayerRegister = SoundPlayer.Register;
// tslint:disable-next-line:typedef
export const SoundPlayerPlay = SoundPlayer.Play;
