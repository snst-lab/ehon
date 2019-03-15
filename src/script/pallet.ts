import { DOM } from './domController';
import { param, config } from './parameter';
import { ComponentType as Component } from './component';
import { keyDown } from './eventListener';

namespace Pallet {
	const outlineStyle: string = `outline:${config.activeOutlineWidth} ${config.activeOutlineStyle} ${config.activeOutlineColor};`;
	export class Camera {
		static className = 'component-camera';
		static dom = new DOM('.component-camera');
	}
	export class Active {
		static title = class {
			static className: string = 'active-title-value';
			static dom = new DOM('.active-title-value');
		};
	}

	export class Keyframe {
		static delay = class {
			static className: string = 'keyframe-delay-value';
			static dom = new DOM('.keyframe-delay-value');
		};
		static iteration = class {
			static className: string = 'keyframe-iteration-value';
			static dom = new DOM('.keyframe-iteration-value');
		};
		static pushState = class {
			static className: string = 'keyframe-push-state';
			static dom = new DOM('.keyframe-push-state');
		};
		static play = class {
			static className: string = 'keyframe-play';
			static dom = new DOM('.keyframe-play');
		};
		static stateList = class {
			static className: string = 'keyframe-state-list';
			static dom = new DOM('.keyframe-state-list');
		};

		static render(Active: Component): void {
			PalletActive.title.dom.el.textContent = Active.title;
			Keyframe.delay.dom.el.textContent = ''+Active.delay;
			Keyframe.iteration.dom.el.textContent = ''+Active.iteration;

			const fragment = new DOM();
			for (let [ i, l ]: Array<number> = [ 0, Active.state.length ]; i < l; i++) {
				fragment.append(`
                    <div class='keyframe-state ${i === l - 1 ? 'keyframe-state-current' : ''} keyframe-state${i}'>
                        <div class='keyframe-state-text'>
							<div class='keyframe-state-number keyframe-state-number${i}'>State: ${i}</div>
							<div class='keyframe-state-src keyframe-state-src${i}'>${Active.state[i].src}</div>
							<div class='keyframe-state-duration keyframe-state-duration${i}'>
								<div class='keyframe-state-duration-index'>Duration:</div>
								<div class='keyframe-state-duration-value keyframe-state-duration-value${i}' contenteditable='true'>${Active.state[i].duration}</div>
							</div>
							<input type='file' class='keyframe-state-input${i}' style='display:none;'>
						</div>
                        <div class='keyframe-state-btn'>
							<i class='keyframe-state-update material-icons keyframe-state-update${i}' state='${i}'>refresh</i>
							${i > 0
								? `<i class='keyframe-state-remove material-icons keyframe-state-remove${i}' state='${i}'>delete</i>`
								: ''}
                        </div>
                    </div>
					`);
			}

			Pallet.Keyframe.stateList.dom.rewrite(fragment.el);
			Pallet.Keyframe.eventListener(Active);
		}

		static clear(): void {
			Pallet.Keyframe.stateList.dom.rewrite('');
		}

		static eventListener(Active: Component): void {
			const input: HTMLInputElement = document.createElement('input');
			input.type = 'file';
			for (let i = 0; i < Active.state.length; i++) {
				document.querySelector('.keyframe-state-number' + i).addEventListener(
					'click',
					(event: PointerEvent) => {
						// event.preventDefault();
						Active.transition(Active.state[i], outlineStyle);
						const currentState: Element = document.querySelector('.keyframe-state-current');
						if (currentState) currentState.classList.remove('keyframe-state-current');
						document.querySelector('.keyframe-state' + i).classList.add('keyframe-state-current');
					},
					false
				);
				document.querySelector('.keyframe-state-duration-value' + i).addEventListener(
					'blur',
					(event: Event) => {
						event.preventDefault();
						Active.state[i].duration = Number(
							(<HTMLInputElement>event.target).textContent
						);
					},
					false
				);
				document.querySelector('.keyframe-state-update' + i).addEventListener(
					'click',
					(event: PointerEvent) => {
						event.preventDefault();
						Active.state[i] = Active.now;
						Pallet.Keyframe.render(Active);
					},
					false
				);
				if (i > 0) {
					document.querySelector('.keyframe-state-remove' + i).addEventListener(
						'click',
						(event: PointerEvent) => {
							event.preventDefault();
							Active.state.splice(i, 1);
							Pallet.Keyframe.render(Active);
						},
						false
					);
				}
				if (Active.type !== 'camera') {
					document.querySelector('.keyframe-state-input' + i).addEventListener(
						'change',
						(event: Event) => {
							event.preventDefault();
							const file: File = (<HTMLInputElement>event.target).files[0];
							(<HTMLElement>document.querySelector('.keyframe-state-src' + i)).textContent = file.name;
							Active.state[i].src = file.name;
							Active.transition(Active.state[i], outlineStyle);

							// console.log(Active.state);
						},
						false
					);
					document.querySelector('.keyframe-state-src' + i).addEventListener(
						'click',
						(event: PointerEvent) => {
							event.preventDefault();
							(<HTMLElement>document.querySelector('.keyframe-state-input' + i)).click();
						},
						false
					);
				}
			}
		}
	}
	// document.addEventListener(
	// 	'keydown',
	// 	(event: KeyboardEvent) => {
	// 		if (event.keyCode === 13) (<HTMLElement>document.querySelector('.keyframe-state-duration-value')).blur();
	// 	},
	// 	false
	// );
}
export const PalletCamera = Pallet.Camera;
export const PalletActive = Pallet.Active;
export const PalletKeyframe = Pallet.Keyframe;