import { DOM, DOMType } from './domController';
import { css } from './setting';
import { ComponentType as Component } from './component';
import { Scene } from './canvas';
import { Active as ActiveComponent } from './editor';
import MyDocument from '../@types/MyDocument';

namespace Pallet {
	export const dom: HTMLElement = document.querySelector('.pallet');

	interface Functions {
		className: string;
		dom: DOMType;
	}
	/**
	 *  ### Pallet.LiveEditToggle
	 *   toggle between live and edit mode
	 */
	export class LiveEditToggle {
		public static className: string = 'live-edit-toggle';
		public static dom: DOMType =  new DOM('.live-edit-toggle');
	}
	/**
	 *  ### Pallet.SceneChanger
	 *   Scene changer for edit mode
	 */
	export class SceneChanger {
		public static className: string = 'scene-changer';
		public static forward: DOMType = new DOM('.scene-changer-forward');
		public static back: DOMType = new DOM('.scene-changer-back');
		public static current: DOMType = new DOM('.scene-changer-current');
		public static add: DOMType = new DOM('.scene-changer-add');
		public static remove: DOMType = new DOM('.scene-changer-remove');
	}
	/**
	 *  ### Pallet.Camera
	 *   Scene changer for edit mode
	 */
	export class Camera {
		public static className: string = 'camera';
		public static dom: DOMType =  new DOM('.camera');
	}
	/**
	 *  ### Pallet.Save
	 *   save the editing story as json file
	 */
	export class Save {
		public static className: string = 'save';
		public static dom: DOMType =  new DOM('.save');
	}
	/**
	 *  ### Pallet.Save
	 *   save the editing story as json file
	 */
	export class Active {
		public static title: Functions = class {
			public static className: string = 'active-title-value';
			public static dom: DOMType =  new DOM('.active-title-value');
		};
		public static touch: Functions = class {
			public static className: string = 'active-touch-switch';
			public static dom: DOMType =  new DOM('.active-touch-switch');
		};
		public static float: Functions = class {
			public static className: string = 'active-float-switch';
			public static dom: DOMType =  new DOM('.active-float-switch');
		};
	}
	/**
	 *  ### Pallet.Layer
	 *   layer selector for edit mode
	 */
	export class Layer {
		// tslint:disable-next-line:typedef
		public static dom: DOMType =  new DOM('.layer');
		// tslint:disable-next-line:typedef
		public static button: DOMType = new DOM('.showlayer');
		public static opened: boolean = false;
		public static show(): void {
			(Layer.dom.el as HTMLElement).style.left = '-15vw';
			(Layer.button.el as HTMLElement).style.color = 'rgb(0,200,180)';
			Trigger.hide();
			Layer.opened = true;
		}
		public static hide(): void {
			(Layer.dom.el as HTMLElement).style.left = '0';
			(Layer.button.el as HTMLElement).style.color = '';
			Layer.opened = false;
		}
		// tslint:disable-next-line:no-any
		public static render(selector: any): void {
			const fragment: DOMType = new DOM();
			fragment.append('<div class="layer-index">Layer</div>');
			fragment.append(`
			<div class='layer-component layer-component0'>
					<i class='layer-component-icon material-icons'>videocam</i>
					<div class='layer-component-title layer-component-title0'>${Scene._[Scene.now].Camera.title}</div>
			</div>
			`);
			for (let [ i, l ]: number[] = [ 0, Scene._[Scene.now].Images.length ]; i < l; i++) {
				fragment.append(`
					<div class='layer-component layer-component${i + 1}'>
						<i class='layer-component-icon material-icons'>insert_photo</i>
						<div class='layer-component-title layer-component-title${i + 1}'>${Scene._[Scene.now].Images[i].title}</div>
						<i class='layer-component-remove layer-component-remove${i + 1} material-icons'>delete</i>
					</div>
					`);
			}
			for (
				let [ i, j, l ]: number[] = [
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
				let [ i, j, k, l ]: number[] = [
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
			Layer.dom.rewrite(fragment.el);
			Layer.eventListener(selector);
		}
		public static clear(): void {
			Layer.dom.rewrite('');
		}
		// tslint:disable-next-line:no-any
		public static eventListener(selector: any): void {
			for (let [ i, l ]: number[] = [ 0, Scene._[Scene.now].Images.length ]; i < l; i++) {
				(document.querySelector(`.layer-component-remove${i + 1}`)).addEventListener(
					'click',
					(_event: PointerEvent) => {
						// tslint:disable-next-line: no-unsafe-any
						selector.release();
						Scene._[Scene.now].Images[i].element.remove();
						Scene._[Scene.now].Images.splice(i, 1);
						Layer.render(selector);
					},
					false
				);
			}
			for (
				let [ i, j, l ]: number[] = [
					0,
					Scene._[Scene.now].Images.length,
					Scene._[Scene.now].Texts.length
				];
				i < l;
				i++
			) {
				(document.querySelector(`.layer-component-remove${i + 1 + j}`)).addEventListener(
					'click',
					(_event: PointerEvent) => {
						// tslint:disable-next-line: no-unsafe-any
						selector.release();
						Scene._[Scene.now].Texts[i].element.remove();
						Scene._[Scene.now].Texts.splice(i, 1);
						Layer.render(selector);
					},
					false
				);
			}
			for (
				let [ i, j, k, l ]: number[] = [
					0,
					Scene._[Scene.now].Images.length,
					Scene._[Scene.now].Texts.length,
					Scene._[Scene.now].Sounds.length
				];
				i < l;
				i++
			) {
				(document.querySelector(`.layer-component-remove${i + 1 + j + k}`)).addEventListener(
					'click',
					(_event: PointerEvent) => {
						// tslint:disable-next-line: no-unsafe-any
						selector.release();
						Scene._[Scene.now].Sounds[i].element.remove();
						Scene._[Scene.now].Sounds.splice(i, 1);
						Layer.render(selector);
					},
					false
				);
			}
			const Components: Component[] = [
				Scene._[Scene.now].Camera,
				...Scene._[Scene.now].Images,
				...Scene._[Scene.now].Texts,
				...Scene._[Scene.now].Sounds
			];
			for (let [ i, l ]: number[] = [ 0, Components.length ]; i < l; i++) {
				(document.querySelector(`.layer-component-title${i}`)).addEventListener(
					'click',
					(_event: PointerEvent) => {
						// tslint:disable-next-line: no-unsafe-any
						selector.activate(Components[i].className, Components[i].types);
					},
					false
				);
				if (Components[i].types !== 3 /**not sound*/) {
					(document.querySelector(`.layer-component${i}`)).addEventListener(
						'mouseenter',
						(_event: MouseEvent) => {
							CSS.setOptionStyle(Components[i].element);
						},
						false
					);
					(document.querySelector(`.layer-component${i}`)).addEventListener(
						'mouseleave',
						(_event: MouseEvent) => {
							if (ActiveComponent !== undefined && (ActiveComponent).className === Components[i].className) {
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
	/**
	 *  ### Trigger
	 *   set animation trigger to components for edit mode
	 */
	export class Trigger {
		public static dom: DOMType =  new DOM('.trigger');
		public static button: DOMType = new DOM('.keyframe-showtrigger');
		public static opened: boolean = false;

		public static show(): void {
			if (ActiveComponent === undefined) return;
			(Trigger.dom.el as HTMLElement).style.left = '-15vw';
			(Trigger.button.el as HTMLElement).style.color = 'rgb(0,200,180)';
			Layer.hide();
			Trigger.opened = true;
		}

		public static hide(): void {
			(Trigger.dom.el as HTMLElement).style.left = '0';
			(Trigger.button.el as HTMLElement).style.color = '';
			Trigger.opened = false;
		}

		public static render(): void {
			const Components: Component[] = [ ...Scene._[Scene.now].Images, ...Scene._[Scene.now].Texts ];
			const fragment: DOMType = new DOM();
			fragment.append('<div class="trigger-index">Animation Trigger</div>');
			fragment.append(`
				<div class='trigger-component'>
					<input type="checkbox" id="trigger-component0"
					${[].indexOf.call((ActiveComponent).trigger, 'scenechange') as number > -1 ? 'checked' : ''}>
					<label class='trigger-component0 trigger-component-label' for="trigger-component0">Scene Change to No.${Scene.now}</label>
				</div>
				`);
			fragment.append(`
				<div class='trigger-component'>
					<input type="checkbox" id="trigger-component1"
					${[].indexOf.call((ActiveComponent).trigger, 'canvas') as number > -1 ? 'checked' : ''}>
					<label class='trigger-component1 trigger-component-label' for="trigger-component1">Canvas Touch</label>
				</div>
			`);
			for (let [ i, l ]: number[] = [ 0, Components.length ]; i < l; i++) {
				fragment.append(`
					<div class='trigger-component'>
						<input type="checkbox" id="trigger-component${i + 2}"
						${[].indexOf.call((ActiveComponent).trigger, Components[i].className) as number > -1 ? 'checked' : ''}>
						<label class='trigger-component${i + 2} trigger-component-label' for="trigger-component${i + 2}">${Components[i]
					.title}</label>
					</div>
					`);
			}
			Trigger.dom.rewrite(fragment.el);
			Trigger.eventListener(Components);
		}

		public static clear(): void {
			Trigger.dom.rewrite('');
		}

		public static eventListener(Components: Component[]): void {
			(document.querySelector('.trigger-component0')).addEventListener(
				'click',
				(_event: PointerEvent) => {
					if ([].indexOf.call((ActiveComponent).trigger, 'scenechange') as number < 0) {
						(ActiveComponent).trigger.push('scenechange');
					} else {
						(ActiveComponent).trigger = (ActiveComponent).trigger.filter((e: string) => e !== 'scenechange');
					}
				},
				false
			);
			(document.querySelector('.trigger-component1')).addEventListener(
				'click',
				(_event: PointerEvent) => {
					if ([].indexOf.call((ActiveComponent).trigger, 'canvas') as number < 0) {
						(ActiveComponent).trigger.push('canvas');
					} else {
						(ActiveComponent).trigger = (ActiveComponent).trigger.filter((e: string) => e !== 'canvas');
					}
				},
				false
			);
			for (let [ i, l ]: number[] = [ 0, Components.length ]; i < l; i++) {
				(document.querySelector(`.trigger-component${i + 2}`)) .addEventListener(
					'click',
					(_event: PointerEvent) => {
						if ([].indexOf.call((ActiveComponent).trigger, Components[i].className) as number < 0) {
							(ActiveComponent).trigger.push(Components[i].className);
						} else {
							(ActiveComponent).trigger = (ActiveComponent).trigger.filter((e: string) => e !== Components[i].className
							);
						}
					},
					false
				);
				(document.querySelector(`.trigger-component${i + 2}`)) .addEventListener(
					'mouseenter',
					(_event: MouseEvent) => {
						CSS.setOptionStyle(Components[i].element);
					},
					false
				);
				(document.querySelector(`.trigger-component${i + 2}`)) .addEventListener(
					'mouseleave',
					(_event: MouseEvent) => {
						if (ActiveComponent !== undefined && (ActiveComponent).className === Components[i].className) {
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
	/**
	 * ### Pallet.Keyframe
	 *  edit component state as keyframe in edit mode
	 */
	export class Keyframe {
		public static delay: Functions = class {
			public static className: string = 'keyframe-delay-value';
			public static dom: DOMType =  new DOM('.keyframe-delay-value');
		};
		public static iteration: Functions = class {
			public static className: string = 'keyframe-iteration-value';
			public static dom: DOMType =  new DOM('.keyframe-iteration-value');
		};
		public static pushState: Functions  = class {
			public static className: string = 'keyframe-push-state';
			public static dom: DOMType =  new DOM('.keyframe-push-state');
		};
		public static play: Functions = class {
			public static className: string = 'keyframe-play';
			public static dom: DOMType =  new DOM('.keyframe-play');
		};
		public static stateList: Functions  = class {
			public static className: string = 'keyframe-state-list';
			public static dom: DOMType =  new DOM('.keyframe-state-list');
		};
		public static cssOptionOpened: boolean = false;

		public static render(): void {
			PalletActive.title.dom.el.textContent = (ActiveComponent).title;
			Keyframe.delay.dom.el.textContent = (ActiveComponent).delay as unknown as string;
			Keyframe.iteration.dom.el.textContent = (ActiveComponent).iteration as unknown as string;
			// tslint:disable-next-line: no-unsafe-any
			(document as MyDocument).active.float.checked = (ActiveComponent).float;
			// tslint:disable-next-line: no-unsafe-any
			(document as MyDocument).active.touch.checked = (ActiveComponent).touchable;

			const fragment: DOMType = new DOM();
			for (let [ i, l ]: number[] = [ 0, (ActiveComponent).state.length ]; i < l; i++) {
				fragment.append(`
                    <div class='keyframe-state ${i === l - 1 ? 'keyframe-state-current' : ''} keyframe-state${i}'>
						<div class='keyframe-state-number${i} keyframe-state-number'>State: ${i}</div>
						<div class='keyframe-state-src${i} keyframe-state-src' ${(ActiveComponent).types === 2 /**text*/
					? "contenteditable='true'"
					: ''}>${(ActiveComponent).state[i].src}</div>
						<div class='keyframe-state-duration${i} keyframe-state-duration'>
							<div class='keyframe-state-duration-index'>Duration:</div>
							<div class='keyframe-state-duration-value${i} keyframe-state-duration-value' contenteditable='true'>${(ActiveComponent)
								.state[i].duration}</div>
						</div>
						${(ActiveComponent).types === 1 /**image */ || (ActiveComponent).types === 3 /**sound */
							? `<input type='file' class='keyframe-state-input${i}' style='display:none;'>`
							: ''}
						<div class='keyframe-state-icon'>
							<i class='keyframe-state-update${i} keyframe-state-update material-icons' state='${i}'>refresh</i>
							${i > 0
								? `<i class='keyframe-state-remove${i} keyframe-state-remove material-icons' state='${i}'>delete</i>`
								: ''}
						</div>
						${(ActiveComponent).types !== 0 /**not camera */
							? `<div class='keyframe-state-option-show${i} keyframe-state-option-show'><div class='plusminus${i} plusminus'><span></span><span></span></div></div>`
							: ''}
					</div>
					${(ActiveComponent).types !== 0 /**not camera */
						? `<div class='keyframe-state-option${i} keyframe-state-option' contenteditable='true'>/*Optional CSS*/${CSS.removeActiveStyle(
								(ActiveComponent).state[i].option
							)}</div>`
						: ''}
					`);
			}
			Keyframe.stateList.dom.rewrite(fragment.el);
			Keyframe.eventListener();
		}
		// <pre class='keyframe-state-option${i} keyframe-state-option'><code class='html hljs' contenteditable='true'> /* Optional CSS here */</code></pre>

		public static clear(): void {
			Keyframe.stateList.dom.rewrite('');
		}

		public static eventListener(): void {
			const input: HTMLInputElement = document.createElement('input');
			input.type = 'file';
			for (let [ i, l ]: number[] = [ 0, (ActiveComponent).state.length ]; i < l; i++) {
				(document.querySelector(`.keyframe-state-number${i}`)).addEventListener(
					'click',
					(_event: PointerEvent) => {
						// event.preventDefault();
						(ActiveComponent).transition((ActiveComponent).state[i]);
						const currentState: Element = document.querySelector('.keyframe-state-current');
						if (currentState) currentState.classList.remove('keyframe-state-current');
						(document.querySelector(`.keyframe-state${i}`)).classList.add('keyframe-state-current');
					},
					false
				);
				(document.querySelector(`.keyframe-state-duration-value${i}`)).addEventListener(
					'blur',
					(event: Event) => {
						event.preventDefault();
						(ActiveComponent).state[i].duration = Number((event.srcElement as HTMLElement).textContent);
					},
					false
				);
				(document.querySelector(`.keyframe-state-update${i}`)).addEventListener(
					'click',
					(event: PointerEvent) => {
						event.preventDefault();
						(ActiveComponent).state[i] = (ActiveComponent).now;
						Keyframe.render();
					},
					false
				);
				if (i > 0) {
					(document.querySelector(`.keyframe-state-remove${i}`)).addEventListener(
						'click',
						(event: PointerEvent) => {
							event.preventDefault();
							(ActiveComponent).state.splice(i, 1);
							Keyframe.render();
						},
						false
					);
				}
				if ((ActiveComponent).types === 1 /**image*/|| (ActiveComponent).types === 3 /**sound*/) {
					(document.querySelector(`.keyframe-state-input${i}`)).addEventListener(
						'change',
						(event: Event) => {
							event.preventDefault();
							const file: File = ((event.target as HTMLInputElement).files)[0];
							(document.querySelector(`.keyframe-state-src${i}`)).textContent = file.name;
							(ActiveComponent).state[i].src = file.name;
							(ActiveComponent).transition((ActiveComponent).state[i]);
						},
						false
					);
					(document.querySelector(`.keyframe-state-src${i}`)).addEventListener(
						'click',
						(event: PointerEvent) => {
							event.preventDefault();
							// tslint:disable-next-line: no-unnecessary-type-assertion
							(document.querySelector(`.keyframe-state-input${i}`) as HTMLElement).click();
						},
						false
					);
				}
				if ((ActiveComponent).types === 2 /**text*/) {
					(document.querySelector(`.keyframe-state-src${i}`)).addEventListener(
						'blur',
						(event: Event) => {
							event.preventDefault();
							(ActiveComponent).state[i].src = (event.srcElement as HTMLElement).textContent;
							(ActiveComponent).transition((ActiveComponent).state[i]);
						},
						false
					);
				}
				if ((ActiveComponent).types !== 0 /**not camera*/) {
					(document.querySelector(`.keyframe-state-option-show${i}`)).addEventListener(
						'click',
						(event: PointerEvent) => {
							event.preventDefault();
							if (!Keyframe.cssOptionOpened) {
								Keyframe.cssOptionOpened = true;
								(document.querySelector(`.plusminus${i}`)).classList.add('active');
								// tslint:disable-next-line: no-unnecessary-type-assertion
								(document.querySelector(`.keyframe-state-option${i}`) as HTMLElement).style.height =
									'10rem';
							} else {
								Keyframe.cssOptionOpened = false;
								(document.querySelector(`.plusminus${i}`)).classList.remove('active');
								// tslint:disable-next-line: no-unnecessary-type-assertion
								(document.querySelector(`.keyframe-state-option${i}`) as HTMLElement).style.height = '0';
							}
						},
						false
					);
					(document.querySelector(`.keyframe-state-option${i}`)).addEventListener(
						'blur',
						(event: Event) => {
							event.preventDefault();
							(ActiveComponent).state[i].option = ((event.srcElement as HTMLElement).textContent).replace(
								'/*Optional CSS*/',
								''
							);
							(ActiveComponent).transition((ActiveComponent).state[i]);
						},
						false
					);
				}
			}
		}
	}
	/**
	 * ### Pallet.CSS
	 *  Change the style of the component while working with layers or triggers.
	 */
	class CSS {
		public static setOptionStyle(e: HTMLElement): void {
			e.style.outlineColor = css.option.outlineColor;
			e.style.outlineStyle = css.option.outlineStyle;
			e.style.outlineWidth = css.option.outlineWidth;
		}
		public static removeOutlineStyle(e: HTMLElement): void  {
			e.style.outlineColor = '';
			e.style.outlineStyle = '';
			e.style.outlineWidth = '';
		}
		public static setActiveStyle(e: HTMLElement): void {
			e.style.outlineColor = css.active.outlineColor;
			e.style.outlineStyle = css.active.outlineStyle;
			e.style.outlineWidth = css.active.outlineWidth;
		}
		public static removeActiveStyle(option: string): string {
			return option
				.replace(`outline-color:${css.active.outlineColor};`, '')
				.replace(`outline-style:${css.active.outlineStyle};`, '')
				.replace(`outline-width:${css.active.outlineWidth};`, '')
				.replace(`resize:${css.resize.resize};`, '')
				.replace(`overflow:${css.resize.overflow};`, '')
				.replace(`cursor:${css.resize.cursor};`, '');
		}
	}
}

// tslint:disable-next-line:typedef
export const PalletDom = Pallet.dom;
// tslint:disable-next-line:typedef
export const PalletLiveEditToggle = Pallet.LiveEditToggle;
// tslint:disable-next-line:typedef
export const PalletSceneChanger = Pallet.SceneChanger;
// tslint:disable-next-line:typedef
export const PalletSave = Pallet.Save;
// tslint:disable-next-line:typedef
export const PalletCamera = Pallet.Camera;
// tslint:disable-next-line:typedef
export const PalletActive = Pallet.Active;
// tslint:disable-next-line:typedef
export const PalletKeyframe = Pallet.Keyframe;
// tslint:disable-next-line:typedef
export const PalletTrigger = Pallet.Trigger;
// tslint:disable-next-line:typedef
export const PalletLayer = Pallet.Layer;
