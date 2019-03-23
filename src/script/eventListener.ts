import { param, config, css } from './parameter';
import { Canvas, Scene } from './canvas';
import {
	PalletActive,
	PalletSceneChanger as SceneChanger,
	PalletLayer as Layer,
	PalletTrigger as Trigger,
	PalletKeyframe as Keyframe,
	PalletCamera as Cam,
	PalletLayer
} from './pallet';
import {
	Active,
	EditorSelector as selector,
	EditorTransform as transform,
	EditorEventHandler as editor
} from './editor';
import { AnimationPlay } from './animation';
import { SoundPlayerPlay } from './soundPlayer';

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
		79: 'o'
	};

	export class Start {
		constructor() {
			this.DetectKeyDown();
			this.CanvasWheel();
			this.CanvasRightClick();
			this.CanvasDoubleClick();
			// this.CanvasResize();
			this.SceneChange();
			this.CameraClick();
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
		private DetectKeyDown(): void {
			document.addEventListener(
				'keydown',
				(event: KeyboardEvent) => {
					if (keyDown === null) {
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
				event.preventDefault();
				if (Active === null) return;
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
					default:
						break;
				}
			});
		}
		private CanvasRightClick(): void {
			Scene._[Scene.now].dom.on('contextmenu', (event: PointerEvent) => {
				event.preventDefault();
				[
					Scene._[Scene.now].Camera,
					...Scene._[Scene.now].Images,
					...Scene._[Scene.now].Texts
				].forEach((c) => {
					if (c.scene === Scene.now && [].indexOf.call(c.trigger, 'canvas') > -1) {
						new AnimationPlay(c);
					}
				});
				Scene._[Scene.now].Sounds.forEach((c) => {
					if (c.scene === Scene.now && [].indexOf.call(c.trigger, 'canvas') > -1) {
						new SoundPlayerPlay(c);
					}
				});
			});
		}
		private CanvasDoubleClick(): void {
			Canvas.dom.on('dblclick', (event: PointerEvent) => {
				event.preventDefault();
				selector.release();
			});
		}
		private CanvasResize(): void {
			window.addEventListener('resize' || 'orientationchange', () => {
				new Canvas.Resize(() => {
					Canvas.aspectRatio = Canvas.element.offsetHeight / Canvas.element.offsetWidth;
					[ ...Scene._[Scene.now].Images, ...Scene._[Scene.now].Texts ].forEach((e) => {
						e.transition(e.now);
					});
				});
			});
		}
		private CanvasDrop(): void {
			Canvas.dom.on('drop', (event: DragEvent) => {
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
		private SceneChange(): void {
			document.addEventListener('sceneChange', () => {
				selector.release();
				PalletLayer.hide();

				SceneChanger.current.el.textContent = `Scene:${Scene.now}`;
				[
					Scene._[Scene.now].Camera,
					...Scene._[Scene.now].Images,
					...Scene._[Scene.now].Texts
				].forEach((c) => {
					// c.transition(c.state[0]);
					if (c.scene === Scene.now && [].indexOf.call(c.trigger, 'scenechange') > -1) {
						new AnimationPlay(c);
					}
				});
				Scene._[Scene.now].Sounds.forEach((c) => {
					if (c.scene === Scene.now && [].indexOf.call(c.trigger, 'scenechange') > -1) {
						new SoundPlayerPlay(c);
					}
				});
			});
			SceneChanger.forward.on('click', (event: PointerEvent) => {
				event.preventDefault();
				Scene.now = Math.min(Scene.now + 1, Scene._.length - 1);
				Scene.change(Scene.now);
			});
			SceneChanger.back.on('click', (event: PointerEvent) => {
				event.preventDefault();
				Scene.now = Math.max(Scene.now - 1, 0);
				Scene.change(Scene.now);
			});
			SceneChanger.remove.on('click', (event: PointerEvent) => {
				event.preventDefault();
				Scene.remove(Scene.now);
			});
			SceneChanger.add.on('click', (event: PointerEvent) => {
				event.preventDefault();
				Scene.add();
			});
		}
		private CameraClick(): void {
			Cam.dom.on('click', (event: PointerEvent) => {
				event.preventDefault();
				editor.CameraClick(Cam.className);
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
					event.preventDefault();
					editor.BaseLayerClick();
				}
			});
			Object.defineProperty(window, 'componentClick', {
				value: function(event: PointerEvent): void {
					event.preventDefault();
					const className: string = event.srcElement.classList.item(0);
					const type: string = event.srcElement.classList.item(1);
					editor.ComponentClick(className, type);
				}
			});
			Object.defineProperty(window, 'componentDoubleClick', {
				value: function(event: PointerEvent): void {
					event.preventDefault();
					// selector.release();
					// if (event.srcElement.getAttribute('contenteditable') === 'true') {
					// 	event.srcElement.setAttribute('contenteditable', 'false');
					// } else {
					// 	event.srcElement.setAttribute('contenteditable', 'true');
					// }
				}
			});
			Object.defineProperty(window, 'componentDragStart', {
				value: function(event: DragEvent): void {
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
					event.preventDefault();
					if (Active === null) return;
					const className: string = event.srcElement.classList.item(0);
					if (Active.className !== className) return;
					const distanceInv: number = 1 / Math.max(Scene._[Active.scene].Camera.now.z - Active.now.z, 1);
					const size: number = (param.camera.initialZ - param.image.initialZ) * distanceInv;
					Active.now.width = ~~(event.srcElement.clientWidth / Canvas.element.offsetWidth * 100) / size;
					Active.now.aspectRatio = event.srcElement.clientHeight / event.srcElement.clientWidth;
				}
			});
		}
	}
}
export const EventListenerStart = EventListener.Start;
