import { param, config } from './setting';
import { Frame, Canvas, Scene } from './canvas';
import {
	PalletDom,
	PalletLiveEditToggle as LiveEditToggle,
	PalletSceneChanger as SceneChanger,
	PalletActive,
	PalletLayer as Layer,
	PalletTrigger as Trigger,
	PalletKeyframe as Keyframe,
	PalletSave as Save,
	PalletCamera as CameraIcon,
	PalletLayer
} from './pallet';
import {
	Active,
	EditorCSS as CSS,
	EditorSelector as selector,
	EditorTransform as transform,
	EditorEventHandler as editor
} from './editor';
import { Animation } from './animation';
import { SoundPlayer } from './soundPlayer';

export let keyDown: string | null = null;

namespace EventListener {
	interface pointerPosition {
		x: number;
		y: number;
	}
	let dragStartPosition: pointerPosition = { x: 0, y: 0 };

	const keyMap: { [key: number]: string } = {
		13: 'enter',
		17: 'ctrl',
		88: 'x',
		89: 'y',
		90: 'z',
		83: 's',
		82: 'r',
		66: 'b',
		79: 'o',
		76: 'l',
		67: 'c'
	};
	export class EventListen {
		constructor() {}

		start(): void {
			this.CanvasTouch();
			this.SceneChange();
			this.SceneChanger();
			this.AnimationRegister();
			this.CanvasSwipe();
			this.HoverHeader();
			this.VolumeToggle();
			// Below is edit mode unique method
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
			Scene.init();
		}
		private liveEditToggle(): void {
			LiveEditToggle.dom.on('change', (event: Event) => {
				event.preventDefault();
				config.live = document['live-edit'].toggle.checked;
				if (config.live) {
					selector.release();
					PalletDom.style.display = 'none';
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
					PalletDom.style.display = '';
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
				if (config.live || Active === null) return;
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
				if (!config.live) return;
				event.preventDefault();
				[
					Scene._[Scene.now].Camera,
					...Scene._[Scene.now].Images,
					...Scene._[Scene.now].Texts
				].forEach((c) => {
					if (c.scene === Scene.now && [].indexOf.call(c.trigger, 'canvas') > -1) {
						new Animation.Play(c);
					}
				});
				Scene._[Scene.now].Sounds.forEach((c) => {
					if (c.scene === Scene.now && [].indexOf.call(c.trigger, 'canvas') > -1) {
						new SoundPlayer.Play(c);
					}
				});
			});
			if (!config.live) {
				Canvas.dom.on('contextmenu', (event: PointerEvent) => {
					if (config.live) return;
					event.preventDefault();
					[
						Scene._[Scene.now].Camera,
						...Scene._[Scene.now].Images,
						...Scene._[Scene.now].Texts
					].forEach((c) => {
						if (c.scene === Scene.now && [].indexOf.call(c.trigger, 'canvas') > -1) {
							new Animation.Play(c);
						}
					});
					Scene._[Scene.now].Sounds.forEach((c) => {
						if (c.scene === Scene.now && [].indexOf.call(c.trigger, 'canvas') > -1) {
							new SoundPlayer.Play(c);
						}
					});
				});
			}
		}
		private AnimationRegister(): void {
			for (let [ i, l ]: Array<number> = [ 0, Scene._.length ]; i < l; i++) {
				[ Scene._[i].Camera, ...Scene._[i].Images, ...Scene._[i].Texts ].forEach((c) => {
					if (c.state.length > 0) {
						new Animation.Register(c);
					}
				});
				Scene._[i].Sounds.forEach((c) => {
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
				for (let [ i, l ]: Array<number> = [ 0, Scene._.length ]; i < l; i++) {
					[ Scene._[i].Camera, ...Scene._[i].Images, ...Scene._[i].Texts ].forEach((c) => {
						if (c.scene === Scene.now && [].indexOf.call(c.trigger, 'scenechange') > -1) {
							new Animation.Play(c);
						} else if (i !== Scene.now) {
							c.running = false;
						}
					});
				}
				Scene._[Scene.now].Sounds.forEach((c) => {
					if ([].indexOf.call(c.trigger, 'scenechange') > -1) {
						for (let [ i, l ]: Array<number> = [ 0, Scene._.length ]; i < l; i++) {
							if (i !== Scene.now){
								Scene._[i].Sounds.forEach((d) => {
									d.element.pause();
								});
							}
						}
						new SoundPlayer.Play(c);
					}
				});


			});
		}
		private SceneChanger(): void {
			SceneChanger.forward.on('click', (event: PointerEvent) => {
				event.preventDefault();
				Scene.change(Scene.now + 1);
				SceneChanger.current.el.textContent = 'Scene:' + Scene.now;
				selector.release();
				PalletLayer.hide();
			});
			SceneChanger.back.on('click', (event: PointerEvent) => {
				event.preventDefault();
				Scene.change(Scene.now - 1);
				SceneChanger.current.el.textContent = 'Scene:' + Scene.now;
				selector.release();
				PalletLayer.hide();
			});
			SceneChanger.remove.on('click', (event: PointerEvent) => {
				event.preventDefault();
				Scene.remove(Scene.now);
				SceneChanger.current.el.textContent = 'Scene:' + Scene.now;
				selector.release();
				PalletLayer.hide();
			});
			SceneChanger.add.on('click', (event: PointerEvent) => {
				event.preventDefault();
				editor.addNewScene();
				SceneChanger.current.el.textContent = 'Scene:' + Scene.now;
				selector.release();
				PalletLayer.hide();
			});
		}
		private CanvasSwipe(): void {
			Canvas.dom.swipe('left', (event: TouchEvent) => {
				event.preventDefault();
				Scene.change(Scene.now + 1);
				SceneChanger.current.el.textContent = 'Scene:' + Scene.now;
				selector.release();
				PalletLayer.hide();
			});
			Canvas.dom.swipe('right', (event: TouchEvent) => {
				event.preventDefault();
				Scene.change(Scene.now - 1);
				SceneChanger.current.el.textContent = 'Scene:' + Scene.now;
				selector.release();
				PalletLayer.hide();
			});
		}
		private CanvasDoubleClick(): void {
			Canvas.dom.on('dblclick', (event: PointerEvent) => {
				event.preventDefault();
				selector.release();
			});
		}
		private CanvasResize(): void {
			class Resize {
				private running: boolean | number = false;
				constructor(callback: Function) {
					window.addEventListener('resize' || 'orientationchange', this.resizeEventSaver(callback));
				}
				resizeEventSaver(callback: Function): EventListenerOrEventListenerObject {
					if (this.running) return;
					this.running = setTimeout(() => {
						this.running = false;
						callback();
					}, 500);
				}
			}
			new Resize(() => {
				Canvas.aspectRatio = Canvas.element.offsetHeight / Canvas.element.offsetWidth;
				[ ...Scene._[Scene.now].Images, ...Scene._[Scene.now].Texts ].forEach((e) => {
					e.transition(e.now);
				});
			});
		}
		private CanvasDrop(): void {
			Canvas.dom.on('drop', (event: DragEvent) => {
				if (config.live) return;
				event.preventDefault();
				if (event.dataTransfer.items) {
					// Use DataTransferItemList interface to access the file(s)
					for (let i: number = 0; i < event.dataTransfer.items.length; i++) {
						// If dropped items aren't files, reject them
						if (event.dataTransfer.items[i].kind === 'file') {
							editor.CanvasDrop(event.clientX, event.clientY, event.dataTransfer.items[i].getAsFile());
						}
					}
				}
			});
		}
		private CameraClick(): void {
			CameraIcon.dom.on('click', (event: PointerEvent) => {
				event.preventDefault();
				editor.CameraClick(CameraIcon.className);
			});
		}
		private SaveClick(): void {
			Save.dom.append(`<a id="save" href="" download="story.json" style="display:none;"></a>`);

			const anchor = <HTMLAnchorElement>document.querySelector('#save');
			Save.dom.on('click', () => {
				if (Active !== null) CSS.removeActiveStyle(Active);

				const json = JSON.stringify({
					title: Frame.headerTitle.textContent,
					scenes: Scene._
				});
				const blob = new Blob([ json ], { type: 'application/json' });
				anchor.href = window.URL.createObjectURL(blob);
				anchor.click();
			});
		}
		private TitleChange(): void {
			PalletActive.title.dom.on('blur', (event: Event) => {
				if (Active === null) return;
				event.preventDefault();
				Active.title = PalletActive.title.dom.el.textContent;
			});
		}
		private SwitchTouch(): void {
			PalletActive.touch.dom.on('change', (event: Event) => {
				if (Active === null) return;
				event.preventDefault();
				Active.touchable = document['active'].touch.checked;
				Active.pointer = Active.touchable ? 'auto' : 'none';
				Active.element.style.pointerEvents = Active.touchable ? 'auto' : 'none';
			});
		}
		private SwitchFloat(): void {
			PalletActive.float.dom.on('change', (event: Event) => {
				if (Active === null) return;
				event.preventDefault();
				Active.float = document['active'].float.checked;
				Active.now.x = 50 - 0.5 * Active.now.width;
				Active.now.y = 50 - 0.5 * Active.now.width * Active.now.aspectRatio;
				Active.transition(Active.now);
			});
		}
		private DelayChange(): void {
			Keyframe.delay.dom.on('blur', (event: Event) => {
				if (Active === null) return;
				event.preventDefault();
				Active.delay = Number(Keyframe.delay.dom.el.textContent);
			});
		}
		private IterationChange(): void {
			Keyframe.iteration.dom.on('blur', (event: Event) => {
				if (Active === null) return;
				event.preventDefault();
				Active.iteration = Number(Keyframe.iteration.dom.el.textContent);
			});
		}
		private ShowTriggerClick(): void {
			Trigger.button.on('click', (event: PointerEvent) => {
				if (Active === null) return;
				event.preventDefault();
				editor.ShowTriggerClick();
			});
		}
		private PlayClick(): void {
			Keyframe.play.dom.on('click', (event: PointerEvent) => {
				if (Active === null) return;
				event.preventDefault();
				editor.PlayClick();
			});
		}
		private PushStateClick(): void {
			Keyframe.pushState.dom.on('click', (event: PointerEvent) => {
				if (Active === null) return;
				event.preventDefault();
				editor.PushStateClick();
			});
		}
		private ShowLayerClick(): void {
			Layer.button.on('click', (event: PointerEvent) => {
				event.preventDefault();
				editor.ShowLayerClick();
			});
		}

		private ImageEvent(): void {
			Object.defineProperty(window, 'baseLayerClick', {
				value: function(event: PointerEvent): void {
					if (config.live) return;
					event.preventDefault();
					editor.BaseLayerClick();
				}
			});
			Object.defineProperty(window, 'componentClick', {
				value: function(event: PointerEvent): void {
					if (config.live) return;
					event.preventDefault();
					const className: string = event.srcElement.classList.item(0);
					const type: string = event.srcElement.classList.item(1);
					editor.ComponentClick(className, type);
				}
			});
			Object.defineProperty(window, 'componentBlur', {
				value: function(event: PointerEvent): void {
					if (config.live || Active.type !== 'text') return;
					event.preventDefault();
					Active.now.src = event.srcElement.textContent;
					Active.transition(Active.now);
				}
			});
			Object.defineProperty(window, 'componentDragStart', {
				value: function(event: DragEvent): void {
					if (config.live) return;
					// event.preventDefault();
					if (Active === null || event.srcElement === null) return;
					const className: string = event.srcElement.classList.item(0);
					if (Active.className !== className) return;
					dragStartPosition.x = event.clientX;
					dragStartPosition.y = event.clientY;
				}
			});
			Object.defineProperty(window, 'componentDragEnd', {
				value: function(event: DragEvent): void {
					if (config.live) return;
					event.preventDefault();
					if (Active === null || event.srcElement === null) return;
					const className: string = event.srcElement.classList.item(0);
					if (Active.className !== className) return;
					const correctXY: number = Active.float
						? (Scene._[Active.scene].Camera.now.z - Active.now.z) / Active.now.z
						: 1;
					const dx: number =
						(event.clientX - dragStartPosition.x) * 100 / Canvas.element.offsetWidth * correctXY;
					const dy: number =
						(event.clientY - dragStartPosition.y) * 100 / Canvas.element.offsetHeight * correctXY;

					if (keyDown === 'ctrl') {
						editor.CanvasDropComponent(Active.now.x + dx, Active.now.y + dy, Active.type, null, Active);
					} else {
						transform.translate(Active, dx, dy, 0);
					}
				}
			});
			Object.defineProperty(window, 'componentMouseUp', {
				value: function(event: PointerEvent): void {
					if (config.live) return;
					event.preventDefault();
					if (Active === null) return;
					const className: string = event.srcElement.classList.item(0);
					if (Active.className !== className) return;
					const distanceInv: number = 1 / Math.max(Scene._[Active.scene].Camera.now.z - Active.now.z, 1);
					const size: number = (param.camera.initialZ - param.image.initialZ) * distanceInv;
					Active.now.width = ~~(event.srcElement.clientWidth / Canvas.element.clientWidth * 100) / size;
					Active.now.aspectRatio = event.srcElement.clientHeight / event.srcElement.clientWidth;
				}
			});
		}
	}
}
export const EventListen = EventListener.EventListen;
