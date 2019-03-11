import { param } from './parameter';
import { Style, StyleEditor } from './style';
import { Component } from './component';

export namespace Transition {
	const style = new StyleEditor();

	export class Animation {
		register(origin: Component.Type,target: Component.Type,  eventName: string): void {
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

		play(target: Component.Type) {
			target.change(target.state[0], '');
			const styleDiff: Style = style.diff(target.state[0], target.state[1]);
			window.requestAnimationFrame(() => this.update(target, 0, 1, styleDiff));
		}

		update(target: Component.Type, frame: number, endState: number, styleDiff: Style): void {
			if (frame % param.animation.skipFrame === 0) {
				if (frame < target.state[endState].duration) {
					target.change(style.add(target.now, styleDiff), '');
					window.requestAnimationFrame(() => this.update(target, frame + 1, endState, styleDiff));
				} else {
					if (endState < target.state.length - 1) {
						const styleDiff: Style = style.diff(target.state[endState], target.state[endState + 1]);
						window.requestAnimationFrame(() => this.update(target, 0, endState + 1, styleDiff));
					} else {
						target.change(target.state[endState], '');
					}
				}
			} else {
				window.requestAnimationFrame(() => this.update(target, frame + 1, endState, styleDiff));
			}
		}
	}
}
