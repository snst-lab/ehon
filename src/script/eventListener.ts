import { param, config } from './setting';
import { Frame, Canvas, Scene } from './canvas';
import { Pallet } from './pallet';
import {
	Active, Editor,
	EditorSelector as selector,
	EditorTransform as transform,
	EditorEventHandler as editor
} from './editor';
import { Animation } from './animation';
import { SoundPlayer } from './soundPlayer';
import { Component } from './component';
import MyDocument from '../@types/MyDocument';

export let keyDown: string | null = null;

export namespace EventListener {
	interface PointerPosition {
		x: number;
		y: number;
	}
	const dragStartPosition: PointerPosition = { 'x': 0, 'y': 0 };

	const keyMap: { [key: number]: string } = {
		'13': 'enter',
		'17': 'ctrl',
		'88': 'x',
		'89': 'y',
		'90': 'z',
		'83': 's',
		'82': 'r',
		'66': 'b',
		'79': 'o',
		'76': 'l',
		'67': 'c'
	};
	/**
	 * ### EventListener.Main
	 * Register EventListener to each Components & Canvas
	 */
	export class Main {
		public async start(): Promise<string> {
			return new Promise((
				resolve: (value?: string | PromiseLike<string> | undefined) => void) => {
				this.commonSetting();
				this.editModeSetting();
				Scene.init();
				resolve();
			});
		}

		private commonSetting(): void {
			this.CanvasTouch();
			this.SceneChange();
			this.PalletSceneChanger();
			this.AnimationRegister();
			this.CanvasSwipe();
			this.HoverHeader();
			this.VolumeToggle();
		}

		private editModeSetting(): void {
			this.liveEditToggle();
			this.DetectKeyDown();
			this.CanvasWheel();
			this.CanvasDoubleClick();
			this.CameraClick();
			this.SaveClick();
			this.CanvasDrop();
			this.TitleChange();
			this.SwitchFloat();
			this.SwitchTouch();
			this.DelayChange();
			this.IterationChange();
			this.PushStateClick();
			this.PlayClick();
			this.ShowLayerClick();
			this.ShowTriggerClick();
			this.ImageEvent();
		}

		private liveEditToggle(): void {
			Pallet.LiveEditToggle.dom.on('change', (event: Event) => {
				event.preventDefault();
				// tslint:disable-next-line: no-unsafe-any
				config.live = (document as MyDocument)['live-edit'].toggle.checked;
				if (config.live) {
					selector.release();
					Pallet.dom.style.display = 'none';
					Canvas.element.classList.remove('canvas-edit');
					Canvas.element.classList.add('canvas-live');
					Canvas.paper.classList.remove('paper-edit');
					Canvas.paper.classList.add('paper-live');
					Frame.header.classList.remove('header-edit');
					Frame.header.classList.add('header-live');
					Frame.footer.classList.remove('footer-edit');
					Frame.footer.classList.add('footer-live');
					Frame.headerTitle.contentEditable = 'false';
					Frame.show();
				} else {
					Pallet.dom.style.display = '';
					Canvas.element.classList.remove('canvas-live');
					Canvas.element.classList.add('canvas-edit');
					Canvas.paper.classList.remove('paper-live');
					Canvas.paper.classList.add('paper-edit');
					Frame.header.classList.remove('header-live');
					Frame.header.classList.add('header-edit');
					Frame.footer.classList.remove('footer-live');
					Frame.footer.classList.add('footer-edit');
					Frame.headerTitle.contentEditable = 'true';
				}
			});
		}
		private DetectKeyDown(): void {
			document.addEventListener(
				'keydown',
				(event: KeyboardEvent) => {
					if (keyDown === null) {
						// console.log(event.keyCode);
						keyDown = keyMap[event.keyCode];
					}
				},
				false
			);
			document.addEventListener(
				'keyup',
				() => {
					keyDown = null;
				},
				false
			);
		}
		private CanvasWheel(): void {
			Canvas.dom.on('mousewheel', (event: WheelEvent): void => {
				if (config.live || Active === undefined) return;
				event.preventDefault();
				switch (keyDown) {
					case 'x':
						transform.translate(Active, event.deltaY * param.wheelResponse.XY, 0, 0);
						break;
					case 'y':
						transform.translate(Active, 0, event.deltaY * param.wheelResponse.XY, 0);
						break;
					case 'z':
						if (Active.float) transform.translate(Active, 0, 0, event.deltaY * param.wheelResponse.Z);
						break;
					case 'r':
						transform.rotate(Active, event.deltaY * param.wheelResponse.rotate);
						break;
					case 's':
						transform.scale(Active, event.deltaY * param.wheelResponse.scale);
						break;
					case 'b':
						transform.blur(Active, event.deltaY * param.wheelResponse.blur);
						break;
					case 'o':
						transform.opacity(Active, event.deltaY * param.wheelResponse.opacity);
						break;
					case 'l':
						transform.light(Active, event.deltaY * param.wheelResponse.light);
						break;
					case 'c':
						transform.chroma(Active, event.deltaY * param.wheelResponse.chroma);
						break;
					default:
						break;
				}
			});
		}

		private CanvasTouch(): void {
			Canvas.dom.touch((event: TouchEvent) => {
				if (config.live) {
					event.preventDefault();
					[
						Scene._[Scene.now].Camera,
						...Scene._[Scene.now].Images,
						...Scene._[Scene.now].Texts
					].forEach((c: Component.Type) => {
						if (c.scene === Scene.now && [].indexOf.call(c.trigger, 'canvas') as number > -1) {
							new Animation.Play(c);
						}
					});
					Scene._[Scene.now].Sounds.forEach((c: Component.Type) => {
						if (c.scene === Scene.now && [].indexOf.call(c.trigger, 'canvas') as number > -1) {
							new SoundPlayer.Play(c);
						}
					});
				}
			});
			if (!config.live) {
				Canvas.dom.on('contextmenu', (event: PointerEvent) => {
					if (!config.live) {
						event.preventDefault();
						[
							Scene._[Scene.now].Camera,
							...Scene._[Scene.now].Images,
							...Scene._[Scene.now].Texts
						].forEach((c: Component.Type) => {
							if (c.scene === Scene.now && [].indexOf.call(c.trigger, 'canvas') as number > -1) {
								new Animation.Play(c);
							}
						});
						Scene._[Scene.now].Sounds.forEach((c: Component.Type) => {
							if (c.scene === Scene.now && [].indexOf.call(c.trigger, 'canvas') as number > -1) {
								new SoundPlayer.Play(c);
							}
						});
					}
				});
			}
		}
		private AnimationRegister(): void {
			for (let [i, l]: number[] = [0, Scene._.length]; i < l; i++) {
				[Scene._[i].Camera, ...Scene._[i].Images, ...Scene._[i].Texts].forEach((c: Component.Type) => {
					if (c.state.length > 0) {
						new Animation.Register(c);
					}
				});
				Scene._[i].Sounds.forEach((c: Component.Type) => {
					new SoundPlayer.Register(c);
				});
			}
		}
		private VolumeToggle(): void {
			Frame.volume.addEventListener(
				'click',
				() => {
					if (config.volumeOn) {
						Frame.volumeOff();
					} else {
						Frame.volumeOn();
					}
				},
				false
			);
		}
		private HoverHeader(): void {
			Frame.header.addEventListener(
				'mouseenter',
				() => {
					Frame.show();
				},
				false
			);
			Frame.header.addEventListener(
				'mouseleave',
				() => {
					Frame.hide();
				},
				false
			);
		}
		private SceneChange(): void {
			document.addEventListener('sceneChange', () => {
				for (let [i, l]: number[] = [0, Scene._.length]; i < l; i++) {
					[Scene._[i].Camera, ...Scene._[i].Images, ...Scene._[i].Texts].forEach((c: Component.Type) => {
						if (c.scene === Scene.now && [].indexOf.call(c.trigger, 'scenechange') as number > -1) {
							new Animation.Play(c);
						} else if (i !== Scene.now) {
							c.running = false;
						}
					});
				}
				Scene._[Scene.now].Sounds.forEach((c: Component.Type) => {
					if ([].indexOf.call(c.trigger, 'scenechange') as number > -1) {
						for (let [i, l]: number[] = [0, Scene._.length]; i < l; i++) {
							if (i !== Scene.now) {
								Scene._[i].Sounds.forEach((d: Component.Type) => {
									(d.element as HTMLAudioElement).pause();
								});
							}
						}
						new SoundPlayer.Play(c);
					}
				});
			});
		}
		private PalletSceneChanger(): void {
			Pallet.SceneChanger.forward.on('click', (event: PointerEvent) => {
				event.preventDefault();
				Scene.change(Scene.now + 1);
				Pallet.SceneChanger.current.el.textContent = `Scene:${Scene.now}`;
				selector.release();
				Pallet.Layer.hide();
			});
			Pallet.SceneChanger.back.on('click', (event: PointerEvent) => {
				event.preventDefault();
				Scene.change(Scene.now - 1);
				Pallet.SceneChanger.current.el.textContent = `Scene:${Scene.now}`;
				selector.release();
				Pallet.Layer.hide();
			});
			Pallet.SceneChanger.remove.on('click', (event: PointerEvent) => {
				event.preventDefault();
				Scene.remove(Scene.now);
				Pallet.SceneChanger.current.el.textContent = `Scene:${Scene.now}`;
				selector.release();
				Pallet.Layer.hide();
			});
			Pallet.SceneChanger.add.on('click', (event: PointerEvent) => {
				event.preventDefault();
				editor.addNewScene();
				Pallet.SceneChanger.current.el.textContent = `Scene:${Scene.now}`;
				selector.release();
				Pallet.Layer.hide();
			});
		}
		private CanvasSwipe(): void {
			Canvas.dom.swipe('left', (event: TouchEvent) => {
				event.preventDefault();
				Scene.change(Scene.now + 1);
				Pallet.SceneChanger.current.el.textContent = `Scene:${Scene.now}`;
				selector.release();
				Pallet.Layer.hide();
			});
			Canvas.dom.swipe('right', (event: TouchEvent) => {
				event.preventDefault();
				Scene.change(Scene.now - 1);
				Pallet.SceneChanger.current.el.textContent = `Scene:${Scene.now}`;
				selector.release();
				Pallet.Layer.hide();
			});
		}
		private CanvasDoubleClick(): void {
			Canvas.dom.on('dblclick', (event: PointerEvent) => {
				event.preventDefault();
				selector.release();
			});
		}
		// private CanvasResize(): void {
		// 	/** ### Resize
		// 	 * resize or orientation change event listner
		// 	 */
		// 	class Resize {
		// 		private running: boolean | number = false;
		// 		constructor(callback: () => void) {
		// 			window.addEventListener('resize' || 'orientationchange', this.resizeEventSaver(callback) as EventListenerOrEventListenerObject);
		// 		}
		// 		// tslint:disable-next-line: no-any
		// 		public resizeEventSaver(callback: () => void): any {
		// 			if (this.running) return;
		// 			this.running = setTimeout(() => {
		// 				this.running = false;
		// 				callback();
		// 				return;
		// 			}, 500);
		// 		}
		// 	}
		// 	new Resize(() => {
		// 		Canvas.aspectRatio = Canvas.element.offsetHeight / Canvas.element.offsetWidth;
		// 		[...Scene._[Scene.now].Images, ...Scene._[Scene.now].Texts].forEach((e) => {
		// 			e.transition(e.now);
		// 		});
		// 	});
		// }
		private CanvasDrop(): void {
			Canvas.dom.on('drop', (event: DragEvent) => {
				event.preventDefault();
				if (!config.live) {
					if (event.dataTransfer !== undefined) {
						// Use DataTransferItemList interface to access the file(s)
						for (let i: number = 0; i < event.dataTransfer.items.length; i++) {
							// If dropped items aren't files, reject them
							if (event.dataTransfer.items[i].kind === 'file') {
								editor.CanvasDrop(event.clientX, event.clientY, event.dataTransfer.items[i].getAsFile());
							}
						}
					}
				}
			});
		}
		private CameraClick(): void {
			Pallet.Camera.dom.on('click', (event: PointerEvent) => {
				event.preventDefault();
				editor.CameraClick(Pallet.Camera.className);
			});
		}
		private SaveClick(): void {
			Pallet.Save.dom.append('<a id="save" href="" download="story.json" style="display:none;"></a>');

			const anchor: HTMLAnchorElement = document.querySelector('#save');
			Pallet.Save.dom.on('click', () => {
				if (Active !== undefined) Editor.CSS.removeActiveStyle(Active);

				const json: string = JSON.stringify({
					'title': Frame.headerTitle.textContent,
					'scenes': Scene._
				});
				const blob: Blob = new Blob([json], { 'type': 'application/json' });
				anchor.href = window.URL.createObjectURL(blob);
				anchor.click();
				console.log(Scene._);
			});
		}
		private TitleChange(): void {
			Pallet.Active.title.dom.on('blur', (event: Event) => {
				if (Active !== undefined) {
					event.preventDefault();
					Active.title = Pallet.Active.title.dom.el.textContent;
				}
			});
		}
		private SwitchTouch(): void {
			Pallet.Active.touch.dom.on('change', (event: Event) => {
				if (Active !== undefined) {
					event.preventDefault();
					// tslint:disable-next-line: no-unsafe-any
					Active.touchable = (document as MyDocument).active.touch.checked;
					Active.pointer = Active.touchable ? 'auto' : 'none';
					Active.element.style.pointerEvents = Active.touchable ? 'auto' : 'none';
				}
			});
		}
		private SwitchFloat(): void {
			Pallet.Active.float.dom.on('change', (event: Event) => {
				if (Active !== undefined) {
					event.preventDefault();
					// tslint:disable-next-line: no-unsafe-any
					Active.float = (document as MyDocument).active.float.checked;
					Active.now.x = 50 - 0.5 * Active.now.width;
					Active.now.y = 50 - 0.5 * Active.now.width * Active.now.aspectRatio;
					Active.transition(Active.now);
				}
			});
		}
		private DelayChange(): void {
			Pallet.Keyframe.delay.dom.on('blur', (event: Event) => {
				if (Active !== undefined) {
					event.preventDefault();
					Active.delay = Number(Pallet.Keyframe.delay.dom.el.textContent);
				}
			});
		}
		private IterationChange(): void {
			Pallet.Keyframe.iteration.dom.on('blur', (event: Event) => {
				if (Active !== undefined) {
					event.preventDefault();
					Active.iteration = Number(Pallet.Keyframe.iteration.dom.el.textContent);
				}
			});
		}
		private ShowTriggerClick(): void {
			Pallet.Trigger.button.on('click', (event: PointerEvent) => {
				if (Active !== undefined) {
					event.preventDefault();
					editor.ShowTriggerClick();
				}
			});
		}
		private PlayClick(): void {
			Pallet.Keyframe.play.dom.on('click', (event: PointerEvent) => {
				if (Active !== undefined) {
					event.preventDefault();
					editor.PlayClick();
				}
			});
		}
		private PushStateClick(): void {
			Pallet.Keyframe.pushState.dom.on('click', (event: PointerEvent) => {
				if (Active !== undefined) {
					event.preventDefault();
					editor.PushStateClick();
				}
			});
		}
		private ShowLayerClick(): void {
			Pallet.Layer.button.on('click', (event: PointerEvent) => {
				event.preventDefault();
				editor.ShowLayerClick();
			});
		}

		private ImageEvent(): void {
			Object.defineProperty(window, 'baseLayerClick', {
				'value'(event: PointerEvent): void {
					if (!config.live) {
						event.preventDefault();
						editor.BaseLayerClick();
					}
				}
			});
			Object.defineProperty(window, 'componentClick', {
				'value'(event: PointerEvent): void {
					event.preventDefault();
					if (!config.live) {
						const className: string = (event.srcElement as HTMLElement).classList.item(0);
						const type: string = (event.srcElement as HTMLElement).classList.item(1);
						editor.ComponentClick(className, type);
					}
				}
			});
			Object.defineProperty(window, 'componentBlur', {
				'value'(event: PointerEvent): void {
					if (!config.live && Active !== undefined) {
						if (Active.types !== 2 /**not text*/) return;
						event.preventDefault();
						Active.now.src = (event.srcElement as HTMLElement).textContent;
						Active.transition(Active.now);
					}
				}
			});
			Object.defineProperty(window, 'componentDragStart', {
				'value'(event: DragEvent): void {
					if (!config.live) {
						// event.preventDefault();
						if (Active === undefined || event.srcElement === undefined) return;
						const className: string = (event.srcElement as HTMLElement).classList.item(0);
						if (Active.className !== className) return;
						dragStartPosition.x = event.clientX;
						dragStartPosition.y = event.clientY;
					}
				}
			});
			Object.defineProperty(window, 'componentDragEnd', {
				'value'(event: DragEvent): void {
					event.preventDefault();
					if (config.live) return;
					if (Active === undefined || event.srcElement === undefined) return;
					const className: string = (event.srcElement as HTMLElement).classList.item(0);
					if (Active.className !== className) return;
					const correctXY: number = Active.float
						? (Scene._[Active.scene].Camera.now.z - Active.now.z) / Active.now.z
						: 1;
					const dx: number =
						(event.clientX - dragStartPosition.x) * 100 / Canvas.element.offsetWidth * correctXY;
					const dy: number =
						(event.clientY - dragStartPosition.y) * 100 / Canvas.element.offsetHeight * correctXY;

					if (keyDown === 'ctrl') {
						editor.CanvasDropComponent(Active.now.x + dx, Active.now.y + dy, Active.types, null, Active);
					} else {
						transform.translate(Active, dx, dy, 0);
					}
				}
			});
			Object.defineProperty(window, 'componentMouseUp', {
				'value'(event: PointerEvent): void {
					event.preventDefault();
					if (config.live) return;
					if (Active === undefined) return;
					const className: string = (event.srcElement as HTMLElement).classList.item(0);
					if (Active.className !== className) return;
					const distanceInv: number = 1 / Math.max(Scene._[Active.scene].Camera.now.z - Active.now.z, 1);
					const size: number = Active.float ? (param.camera.initialZ - param.image.initialZ) * distanceInv : 1;
					Active.now.width = ~~((event.srcElement as HTMLElement).clientWidth / Canvas.element.clientWidth * 100) / size;
					Active.now.aspectRatio = (event.srcElement as HTMLElement).clientHeight / (event.srcElement as HTMLElement).clientWidth;
				}
			});
			Object.defineProperty(window, 'componentResize', {
				'value'(event: Event): void {
					event.preventDefault();
					if (!config.live && Active !== undefined) {
						if (Active.types !== 2 /**not text*/) return;
						const distanceInv: number = 1 / Math.max(Scene._[Active.scene].Camera.now.z - Active.now.z, 1);
						const size: number = Active.float ? (param.camera.initialZ - param.image.initialZ) * distanceInv : 1;
						Active.now.width = ~~((event.srcElement as HTMLElement).clientWidth / Canvas.element.clientWidth * 100) / size;
						Active.now.aspectRatio = (event.srcElement as HTMLElement).clientHeight / (event.srcElement as HTMLElement).clientWidth;
					}
				}
			});
		}
	}
}
