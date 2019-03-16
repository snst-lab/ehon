import { DOM } from './domController';
import { param, config } from './parameter';
import { ComponentType as Component } from './component';

namespace Pallet {
	const outlineStyle: string = `outline:${config.triggerOutlineWidth} ${config.triggerOutlineStyle} ${config.triggerOutlineColor};`;
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
	export class Trigger {
		static dom = new DOM('.trigger');
		static button = new DOM('.keyframe-showtrigger');
		static show:boolean = false;

		static render(now: number, Active: Component, Components: Array<Component>): void {
			const fragment = new DOM();
			fragment.append('<div class="trigger-index">Animation Trigger</div>');
			fragment.append(`
				<div class='trigger-component'>
					<input type="checkbox" id="trigger-component0" 
					${[].indexOf.call(Active.trigger, 'scenechange' + now) > -1 ? 'checked' : ''}>
					<label class='trigger-component0 trigger-component-label' for="trigger-component0">on Scene to No.${now}</label>
				</div>
				`);
			fragment.append(`
				<div class='trigger-component'>
					<input type="checkbox" id="trigger-component1" 
					${[].indexOf.call(Active.trigger, 'scene' + now) > -1 ? 'checked' : ''}>
					<label class='trigger-component1 trigger-component-label' for="trigger-component1">on Canvas Touch</label>
				</div>
			`);
			for (let [ i, l ]: Array<number> = [ 0, Components.length ]; i < l; i++) {
				fragment.append(`
					<div class='trigger-component trigger-${Components[i].className}'>
						<input type="checkbox" id="trigger-component${i + 2}" 
						${[].indexOf.call(Active.trigger, Components[i].className) > -1 ? 'checked' : ''}>
						<label class='trigger-component${i + 2} trigger-component-label' for="trigger-component${i + 2}">${Components[i]
					.title}</label>
					</div>
					`);
			}
			Pallet.Trigger.dom.rewrite(fragment.el);
			Pallet.Trigger.eventListener(now, Active, Components);
		}

		static clear(): void {
			Pallet.Trigger.dom.rewrite('');
		}

		static eventListener(now: number, Active: Component, Components: Array<Component>): void {
			document.querySelector('.trigger-component0').addEventListener(
				'click',
				(event: PointerEvent) => {
					if ([].indexOf.call(Active.trigger, 'scenechange' + now) < 0) {
						Active.trigger.push('scenechange' + now);
					} else {
						Active.trigger = Active.trigger.filter((e) => e !== 'scenechange' + now);
					}
				},
				false
			);
			document.querySelector('.trigger-component1').addEventListener(
				'click',
				(event: PointerEvent) => {
					if ([].indexOf.call(Active.trigger, 'scene' + now) < 0) {
						Active.trigger.push('scene' + now);
					} else {
						Active.trigger = Active.trigger.filter((e) => e !== 'scene' + now);
					}
				},
				false
			);
			for (let [ i, l ]: Array<number> = [ 0, Components.length ]; i < l; i++) {
				document.querySelector('.trigger-component' + (i + 2)).addEventListener(
					'click',
					(event: PointerEvent) => {
						if ([].indexOf.call(Active.trigger, Components[i].className) < 0) {
							Active.trigger.push(Components[i].className);
						} else {
							Active.trigger = Active.trigger.filter((e) => e !== Components[i].className);
						}
					},
					false
				);
			}
			document.querySelectorAll('.trigger-component').forEach((e, i) => {
				if (i > 1) {
					e.addEventListener(
						'mouseenter',
						(event: MouseEvent) => {
							const className: string = event.srcElement.classList.item(1).replace('trigger-', '');
							const target: HTMLElement = Components.filter((e) => e.className === className)[0].element;
							if (Active.className !== className) {
								target.style.outlineWidth = config.triggerOutlineWidth;
								target.style.outlineStyle = config.triggerOutlineStyle;
								target.style.outlineColor = config.triggerOutlineColor;
							}
						},
						false
					);
					e.addEventListener(
						'mouseleave',
						(event: MouseEvent) => {
							const className: string = event.srcElement.classList.item(1).replace('trigger-', '');
							if (Active.className !== className) {
								const target: HTMLElement = Components.filter(
									(e) => e.className === className && Active.className
								)[0].element;
								target.style.outlineWidth = '';
								target.style.outlineStyle = '';
								target.style.outlineColor = '';
							}
						},
						false
					);
				}
			});
		}
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
		static showtrigger = class {
			static className: string = 'keyframe-showtrigger';
			static dom = new DOM('.keyframe-showtrigger');
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
			Keyframe.delay.dom.el.textContent = '' + Active.delay;
			Keyframe.iteration.dom.el.textContent = '' + Active.iteration;

			const fragment = new DOM();
			for (let [ i, l ]: Array<number> = [ 0, Active.state.length ]; i < l; i++) {
				fragment.append(`
                    <div class='keyframe-state ${i === l - 1 ? 'keyframe-state-current' : ''} keyframe-state${i}'>
						<div class='keyframe-state-number keyframe-state-number${i}'>State: ${i}</div>
						<div class='keyframe-state-src keyframe-state-src${i}'>${Active.state[i].src}</div>
						<div class='keyframe-state-duration keyframe-state-duration${i}'>
							<div class='keyframe-state-duration-index'>Duration:</div>
							<div class='keyframe-state-duration-value keyframe-state-duration-value${i}' contenteditable='true'>${Active
					.state[i].duration}</div>
						</div>
						<input type='file' class='keyframe-state-input${i}' style='display:none;'>
						<i class='keyframe-state-update material-icons keyframe-state-update${i}' state='${i}'>refresh</i>
						${i > 0
							? `<i class='keyframe-state-remove material-icons keyframe-state-remove${i}' state='${i}'>delete</i>`
							: ''}
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
			for (let [ i, l ]: Array<number> = [ 0, Active.state.length ]; i < l; i++) {
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
						Active.state[i].duration = Number(event.srcElement.textContent);
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
}
export const PalletCamera = Pallet.Camera;
export const PalletActive = Pallet.Active;
export const PalletKeyframe = Pallet.Keyframe;
export const PalletTrigger = Pallet.Trigger;
