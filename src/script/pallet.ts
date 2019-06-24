import { DOM } from './domController';
import { css } from './setting';
import { ComponentType as Component } from './component';
import { Scene } from './canvas';
import { Active as ActiveComponent } from './editor';

namespace Pallet {
	export const dom = <HTMLElement>document.querySelector('.pallet');

	export class LiveEditToggle {
		static className = 'live-edit-toggle';
		static dom = new DOM('.live-edit-toggle');
	}
	export class SceneChanger {
		static className = 'scene-changer';
		static forward = new DOM('.scene-changer-forward');
		static back = new DOM('.scene-changer-back');
		static current = new DOM('.scene-changer-current');
		static add = new DOM('.scene-changer-add');
		static remove = new DOM('.scene-changer-remove');
	}
	export class Camera {
		static className = 'camera';
		static dom = new DOM('.camera');
	}
	export class Save {
		static className = 'save';
		static dom = new DOM('.save');
	}
	export class Active {
		static title = class {
			static className: string = 'active-title-value';
			static dom = new DOM('.active-title-value');
		};
		static touch = class {
			static className: string = 'active-touch-switch';
			static dom = new DOM('.active-touch-switch');
		};
		static float = class {
			static className: string = 'active-float-switch';
			static dom = new DOM('.active-float-switch');
		};
	}
	export class Layer {
		static dom = new DOM('.layer');
		static button = new DOM('.showlayer');
		static opened: boolean = false;
		static show(): void {
			(<HTMLElement>Layer.dom.el).style.left = '-15vw';
			(<HTMLElement>Layer.button.el).style.color = 'rgb(0,200,180)';
			Trigger.hide();
			Layer.opened = true;
		}
		static hide(): void {
			(<HTMLElement>Layer.dom.el).style.left = '0';
			(<HTMLElement>Layer.button.el).style.color = '';
			Layer.opened = false;
		}
		static render(selector: any): void {
			const fragment = new DOM();
			fragment.append('<div class="layer-index">Layer</div>');
			fragment.append(`
			<div class='layer-component layer-component0'>
					<i class='layer-component-icon material-icons'>videocam</i>
					<div class='layer-component-title layer-component-title0'>${Scene._[Scene.now].Camera.title}</div>
			</div>
			`);
			for (let [ i, l ]: Array<number> = [ 0, Scene._[Scene.now].Images.length ]; i < l; i++) {
				fragment.append(`
					<div class='layer-component layer-component${i + 1}'>
						<i class='layer-component-icon material-icons'>insert_photo</i>
						<div class='layer-component-title layer-component-title${i + 1}'>${Scene._[Scene.now].Images[i].title}</div>
						<i class='layer-component-remove layer-component-remove${i + 1} material-icons'>delete</i>
					</div>
					`);
			}
			for (
				let [ i, j, l ]: Array<number> = [
					0,
					Scene._[Scene.now].Images.length,
					Scene._[Scene.now].Texts.length
				];
				i < l;
				i++
			) {
				fragment.append(`
					<div class='layer-component layer-component${i + 1 + j}'>
						<i class='layer-component-icon material-icons'>text_fields</i>
						<div class='layer-component-title layer-component-title${i + 1 + j}'>${Scene._[Scene.now].Texts[i].title}</div>
						<i class='layer-component-remove layer-component-remove${i + 1 + j} material-icons'>delete</i>
					</div>
					`);
			}
			for (
				let [ i, j, k, l ]: Array<number> = [
					0,
					Scene._[Scene.now].Images.length,
					Scene._[Scene.now].Texts.length,
					Scene._[Scene.now].Sounds.length
				];
				i < l;
				i++
			) {
				fragment.append(`
					<div class='layer-component layer-component${i + 1 + j + k}'>
						<i class='layer-component-icon material-icons'>music_note</i>
						<div class='layer-component-title layer-component-title${i + 1 + j + k}'>${Scene._[Scene.now].Sounds[i]
					.title}</div>
						<i class='layer-component-remove layer-component-remove${i + 1 + j + k} material-icons'>delete</i>
					</div>
					`);
			}
			Pallet.Layer.dom.rewrite(fragment.el);
			Pallet.Layer.eventListener(selector);
		}
		static clear(): void {
			Pallet.Layer.dom.rewrite('');
		}

		static eventListener(selector: any): void {
			for (let [ i, l ]: Array<number> = [ 0, Scene._[Scene.now].Images.length ]; i < l; i++) {
				document.querySelector('.layer-component-remove' + (i + 1)).addEventListener(
					'click',
					(event: PointerEvent) => {
						selector.release();
						Scene._[Scene.now].Images[i].element.remove();
						Scene._[Scene.now].Images.splice(i, 1);
						Layer.render(selector);
					},
					false
				);
			}
			for (
				let [ i, j, l ]: Array<number> = [
					0,
					Scene._[Scene.now].Images.length,
					Scene._[Scene.now].Texts.length
				];
				i < l;
				i++
			) {
				document.querySelector('.layer-component-remove' + (i + 1 + j)).addEventListener(
					'click',
					(event: PointerEvent) => {
						selector.release();
						Scene._[Scene.now].Texts[i].element.remove();
						Scene._[Scene.now].Texts.splice(i, 1);
						Layer.render(selector);
					},
					false
				);
			}
			for (
				let [ i, j, k, l ]: Array<number> = [
					0,
					Scene._[Scene.now].Images.length,
					Scene._[Scene.now].Texts.length,
					Scene._[Scene.now].Sounds.length
				];
				i < l;
				i++
			) {
				document.querySelector('.layer-component-remove' + (i + 1 + j + k)).addEventListener(
					'click',
					(event: PointerEvent) => {
						selector.release();
						Scene._[Scene.now].Sounds[i].element.remove();
						Scene._[Scene.now].Sounds.splice(i, 1);
						Layer.render(selector);
					},
					false
				);
			}
			const Components: Array<Component> = [
				Scene._[Scene.now].Camera,
				...Scene._[Scene.now].Images,
				...Scene._[Scene.now].Texts,
				...Scene._[Scene.now].Sounds
			];
			for (let [ i, l ]: Array<number> = [ 0, Components.length ]; i < l; i++) {
				document.querySelector('.layer-component-title' + i).addEventListener(
					'click',
					(event: PointerEvent) => {
						selector.activate(Components[i].className, Components[i].types);
					},
					false
				);
				if (Components[i].types !== 3 /**not sound*/) {
					document.querySelector('.layer-component' + i).addEventListener(
						'mouseenter',
						(event: MouseEvent) => {
							CSS.setOptionStyle(Components[i].element);
						},
						false
					);
					document.querySelector('.layer-component' + i).addEventListener(
						'mouseleave',
						(event: MouseEvent) => {
							if (ActiveComponent !== null && ActiveComponent.className === Components[i].className) {
								CSS.setActiveStyle(Components[i].element);
							} else {
								CSS.removeOutlineStyle(Components[i].element);
							}
						},
						false
					);
				}
			}
		}
	}
	export class Trigger {
		static dom = new DOM('.trigger');
		static button = new DOM('.keyframe-showtrigger');
		static opened: boolean = false;

		static show(): void {
			if (ActiveComponent === null) return;
			(<HTMLElement>Trigger.dom.el).style.left = '-15vw';
			(<HTMLElement>Trigger.button.el).style.color = 'rgb(0,200,180)';
			Layer.hide();
			Trigger.opened = true;
		}

		static hide(): void {
			(<HTMLElement>Trigger.dom.el).style.left = '0';
			(<HTMLElement>Trigger.button.el).style.color = '';
			Trigger.opened = false;
		}

		static render(): void {
			const Components: Array<Component> = [ ...Scene._[Scene.now].Images, ...Scene._[Scene.now].Texts ];
			const fragment = new DOM();
			fragment.append('<div class="trigger-index">Animation Trigger</div>');
			fragment.append(`
				<div class='trigger-component'>
					<input type="checkbox" id="trigger-component0" 
					${[].indexOf.call(ActiveComponent.trigger, 'scenechange') > -1 ? 'checked' : ''}>
					<label class='trigger-component0 trigger-component-label' for="trigger-component0">Scene Change to No.${Scene.now}</label>
				</div>
				`);
			fragment.append(`
				<div class='trigger-component'>
					<input type="checkbox" id="trigger-component1" 
					${[].indexOf.call(ActiveComponent.trigger, 'canvas') > -1 ? 'checked' : ''}>
					<label class='trigger-component1 trigger-component-label' for="trigger-component1">Canvas Touch</label>
				</div>
			`);
			for (let [ i, l ]: Array<number> = [ 0, Components.length ]; i < l; i++) {
				fragment.append(`
					<div class='trigger-component'>
						<input type="checkbox" id="trigger-component${i + 2}" 
						${[].indexOf.call(ActiveComponent.trigger, Components[i].className) > -1 ? 'checked' : ''}>
						<label class='trigger-component${i + 2} trigger-component-label' for="trigger-component${i + 2}">${Components[i]
					.title}</label>
					</div>
					`);
			}
			Pallet.Trigger.dom.rewrite(fragment.el);
			Pallet.Trigger.eventListener(Components);
		}

		static clear(): void {
			Pallet.Trigger.dom.rewrite('');
		}

		static eventListener(Components: Array<Component>): void {
			document.querySelector('.trigger-component0').addEventListener(
				'click',
				(event: PointerEvent) => {
					if ([].indexOf.call(ActiveComponent.trigger, 'scenechange') < 0) {
						ActiveComponent.trigger.push('scenechange');
					} else {
						ActiveComponent.trigger = ActiveComponent.trigger.filter((e) => e !== 'scenechange');
					}
				},
				false
			);
			document.querySelector('.trigger-component1').addEventListener(
				'click',
				(event: PointerEvent) => {
					if ([].indexOf.call(ActiveComponent.trigger, 'canvas') < 0) {
						ActiveComponent.trigger.push('canvas');
					} else {
						ActiveComponent.trigger = ActiveComponent.trigger.filter((e) => e !== 'canvas');
					}
				},
				false
			);
			for (let [ i, l ]: Array<number> = [ 0, Components.length ]; i < l; i++) {
				document.querySelector('.trigger-component' + (i + 2)).addEventListener(
					'click',
					(event: PointerEvent) => {
						if ([].indexOf.call(ActiveComponent.trigger, Components[i].className) < 0) {
							ActiveComponent.trigger.push(Components[i].className);
						} else {
							ActiveComponent.trigger = ActiveComponent.trigger.filter(
								(e) => e !== Components[i].className
							);
						}
					},
					false
				);
				document.querySelector('.trigger-component' + (i + 2)).addEventListener(
					'mouseenter',
					(event: MouseEvent) => {
						CSS.setOptionStyle(Components[i].element);
					},
					false
				);
				document.querySelector('.trigger-component' + (i + 2)).addEventListener(
					'mouseleave',
					(event: MouseEvent) => {
						if (ActiveComponent !== null && ActiveComponent.className === Components[i].className) {
							CSS.setActiveStyle(Components[i].element);
						} else {
							CSS.removeOutlineStyle(Components[i].element);
						}
					},
					false
				);
			}
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
		static play = class {
			static className: string = 'keyframe-play';
			static dom = new DOM('.keyframe-play');
		};
		static stateList = class {
			static className: string = 'keyframe-state-list';
			static dom = new DOM('.keyframe-state-list');
		};
		static cssOptionOpened: boolean = false;

		static render(): void {
			PalletActive.title.dom.el.textContent = ActiveComponent.title;
			Keyframe.delay.dom.el.textContent = '' + ActiveComponent.delay;
			Keyframe.iteration.dom.el.textContent = '' + ActiveComponent.iteration;
			document['active'].float.checked = ActiveComponent.float;
			document['active'].touch.checked = ActiveComponent.touchable;

			const fragment = new DOM();
			for (let [ i, l ]: Array<number> = [ 0, ActiveComponent.state.length ]; i < l; i++) {
				fragment.append(`
                    <div class='keyframe-state ${i === l - 1 ? 'keyframe-state-current' : ''} keyframe-state${i}'>
						<div class='keyframe-state-number${i} keyframe-state-number'>State: ${i}</div>
						<div class='keyframe-state-src${i} keyframe-state-src' ${ActiveComponent.types === 2 /**text*/
					? "contenteditable='true'"
					: ''}>${ActiveComponent.state[i].src}</div>
						<div class='keyframe-state-duration${i} keyframe-state-duration'>
							<div class='keyframe-state-duration-index'>Duration:</div>
							<div class='keyframe-state-duration-value${i} keyframe-state-duration-value' contenteditable='true'>${ActiveComponent
					.state[i].duration}</div>
						</div>
						${ActiveComponent.types === 1 /**image */ || ActiveComponent.types ===3 /**sound */
							? `<input type='file' class='keyframe-state-input${i}' style='display:none;'>`
							: ''}
						<div class='keyframe-state-icon'>
							<i class='keyframe-state-update${i} keyframe-state-update material-icons' state='${i}'>refresh</i>
							${i > 0
								? `<i class='keyframe-state-remove${i} keyframe-state-remove material-icons' state='${i}'>delete</i>`
								: ''}
						</div>
						${ActiveComponent.types !== 0 /**not camera */
							? `<div class='keyframe-state-option-show${i} keyframe-state-option-show'><div class='plusminus${i} plusminus'><span></span><span></span></div></div>`
							: ''}
					</div>
					${ActiveComponent.types !== 0 /**not camera */
						? `<div class='keyframe-state-option${i} keyframe-state-option' contenteditable='true'>/*Optional CSS*/${CSS.removeActiveStyle(
								ActiveComponent.state[i].option
							)}</div>`
						: ''}
					`);
			}
			Pallet.Keyframe.stateList.dom.rewrite(fragment.el);
			Pallet.Keyframe.eventListener();
		}
		// <pre class='keyframe-state-option${i} keyframe-state-option'><code class='html hljs' contenteditable='true'> /* Optional CSS here */</code></pre>

		static clear(): void {
			Pallet.Keyframe.stateList.dom.rewrite('');
		}

		static eventListener(): void {
			const input: HTMLInputElement = document.createElement('input');
			input.type = 'file';
			for (let [ i, l ]: Array<number> = [ 0, ActiveComponent.state.length ]; i < l; i++) {
				document.querySelector('.keyframe-state-number' + i).addEventListener(
					'click',
					(event: PointerEvent) => {
						// event.preventDefault();
						ActiveComponent.transition(ActiveComponent.state[i]);
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
						ActiveComponent.state[i].duration = Number((<HTMLElement>event.srcElement).textContent);
					},
					false
				);
				document.querySelector('.keyframe-state-update' + i).addEventListener(
					'click',
					(event: PointerEvent) => {
						event.preventDefault();
						ActiveComponent.state[i] = ActiveComponent.now;
						Pallet.Keyframe.render();
					},
					false
				);
				if (i > 0) {
					document.querySelector('.keyframe-state-remove' + i).addEventListener(
						'click',
						(event: PointerEvent) => {
							event.preventDefault();
							ActiveComponent.state.splice(i, 1);
							Pallet.Keyframe.render();
						},
						false
					);
				}
				if (ActiveComponent.types === 1 /**image*/|| ActiveComponent.types ===3 /**sound*/) {
					document.querySelector('.keyframe-state-input' + i).addEventListener(
						'change',
						(event: Event) => {
							event.preventDefault();
							const file: File = (<HTMLInputElement>event.target).files[0];
							(<HTMLElement>document.querySelector('.keyframe-state-src' + i)).textContent = file.name;
							ActiveComponent.state[i].src = file.name;
							ActiveComponent.transition(ActiveComponent.state[i]);
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
				if (ActiveComponent.types === 2 /**text*/) {
					document.querySelector('.keyframe-state-src' + i).addEventListener(
						'blur',
						(event: Event) => {
							event.preventDefault();
							ActiveComponent.state[i].src = (<HTMLElement>event.srcElement).textContent;
							ActiveComponent.transition(ActiveComponent.state[i]);
						},
						false
					);
				}
				if (ActiveComponent.types !== 0 /**not camera*/) {
					document.querySelector('.keyframe-state-option-show' + i).addEventListener(
						'click',
						(event: PointerEvent) => {
							event.preventDefault();
							if (!Keyframe.cssOptionOpened) {
								Keyframe.cssOptionOpened = true;
								(<HTMLElement>document.querySelector('.plusminus' + i)).classList.add('active');
								(<HTMLElement>document.querySelector('.keyframe-state-option' + i)).style.height =
									'10rem';
							} else {
								Keyframe.cssOptionOpened = false;
								(<HTMLElement>document.querySelector('.plusminus' + i)).classList.remove('active');
								(<HTMLElement>document.querySelector('.keyframe-state-option' + i)).style.height = '0';
							}
						},
						false
					);
					document.querySelector('.keyframe-state-option' + i).addEventListener(
						'blur',
						(event: Event) => {
							event.preventDefault();
							ActiveComponent.state[i].option = (<HTMLElement>event.srcElement).textContent.replace(
								'/*Optional CSS*/',
								''
							);
							ActiveComponent.transition(ActiveComponent.state[i]);
						},
						false
					);
				}
			}
		}
	}
	class CSS {
		static setOptionStyle(e: HTMLElement) {
			e.style.outlineColor = css.option.outlineColor;
			e.style.outlineStyle = css.option.outlineStyle;
			e.style.outlineWidth = css.option.outlineWidth;
		}
		static removeOutlineStyle(e: HTMLElement) {
			e.style.outlineColor = '';
			e.style.outlineStyle = '';
			e.style.outlineWidth = '';
		}
		static setActiveStyle(e: HTMLElement) {
			e.style.outlineColor = css.active.outlineColor;
			e.style.outlineStyle = css.active.outlineStyle;
			e.style.outlineWidth = css.active.outlineWidth;
		}
		static removeActiveStyle(option: string) {
			return option
				.replace('outline-color:' + css.active.outlineColor + ';', '')
				.replace('outline-style:' + css.active.outlineStyle + ';', '')
				.replace('outline-width:' + css.active.outlineWidth + ';', '')
				.replace('resize:' + css.resize.resize + ';', '')
				.replace('overflow:' + css.resize.overflow + ';', '')
				.replace('cursor:' + css.resize.cursor + ';', '');
		}
	}
}
export const PalletDom = Pallet.dom;
export const PalletLiveEditToggle = Pallet.LiveEditToggle;
export const PalletSceneChanger = Pallet.SceneChanger;
export const PalletSave = Pallet.Save;
export const PalletCamera = Pallet.Camera;
export const PalletActive = Pallet.Active;
export const PalletKeyframe = Pallet.Keyframe;
export const PalletTrigger = Pallet.Trigger;
export const PalletLayer = Pallet.Layer;
