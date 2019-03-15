import { param, config } from './parameter';
import { Canvas, Scenes as scene, Now as now } from './canvas';
import { PalletActive, PalletKeyframe as Keyframe, PalletCamera as Cam } from './pallet';
import { Active, EditorTransform, EditorEventHandler } from './editor';

export let keyDown: string | null = null;

namespace EventListener {
	const transform = new EditorTransform();
	const editor = new EditorEventHandler();

	let dragstart: pointerPosition = { x: 0, y: 0 };

	const keyMap: { [key: number]: string } = {
		13: 'enter',
		88: 'x',
		89: 'y',
		90: 'z',
		83: 's',
		82: 'r',
		66: 'b',
		79: 'o'
	};

	interface pointerPosition {
		x: number;
		y: number;
	}

	export class Start {
		constructor() {
			this.detectKeyDown();
			this.CanvasWheel();
			this.CanvasClick();
			this.CanvasResize();
			this.CameraClick();
			this.CanvasDrop();
			this.BaseLayerClick();
			this.TitleChange();
			this.DelayChange();
			this.IterationChange();
			this.PushStateClick();
			this.PlayClick();
			this.ImageEvent();
		}

		private detectKeyDown(): void {
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
						transform.translate(Active, 0, 0, event.deltaY * param.wheelResponse.Z);
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
		private CameraClick(): void {
			Cam.dom.on('click', (event: PointerEvent) => {
				event.preventDefault();
				editor.CameraClick(Cam.className);
			});
		}
		private CanvasClick(): void {
			Canvas.dom.on('click', (event: PointerEvent) => {
				event.preventDefault();
			});
		}
		private BaseLayerClick(): void {
			scene[now].dom.el.firstChild.addEventListener('click', (event: PointerEvent) => {
				event.preventDefault();
				editor.BaseLayerClick();
			},false);
		}
		private CanvasResize():void{
			window.addEventListener('resize'||'orientationchange', editor.CanvasResize);
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
		private TitleChange(): void {
			PalletActive.title.dom.on('blur', (event: Event) => {
				event.preventDefault();
				Active.title = PalletActive.title.dom.el.textContent;
			});
		}
		private DelayChange(): void {
			Keyframe.delay.dom.on('blur', (event: Event) => {
				event.preventDefault();
				Active.delay = Number(Keyframe.delay.dom.el.textContent);
			});
		}
		private IterationChange(): void {
			Keyframe.iteration.dom.on('blur', (event: Event) => {
				event.preventDefault();
				Active.iteration = Number(Keyframe.iteration.dom.el.textContent);
			});
		}
		private PushStateClick(): void {
			Keyframe.pushState.dom.on('click', (event: PointerEvent) => {
				event.preventDefault();
				editor.PushStateClick();
			});
		}
		private PlayClick(): void {
			Keyframe.play.dom.on('click', (event: PointerEvent) => {
				event.preventDefault();
				editor.PlayClick();
			});
		}


		private ImageEvent(): void {
			Object.defineProperty(window, config.imageClick, {
				value: function(event: PointerEvent): void {
					event.preventDefault();
					const className: string = (<Element>event.target).classList.item(0);
					editor.ImageClick(className);
				}
			});
			Object.defineProperty(window, config.imageDoubleClick, {
				value: function(event: PointerEvent): void {
					event.preventDefault();
				}
			});
			Object.defineProperty(window, config.imageDragStart, {
				value: function(event: DragEvent): void {
					// event.preventDefault();
					if (Active === null) return;
					const className: string = (<Element>event.target).classList.item(0);
					if (Active.className !== className) return;
					dragstart.x = event.clientX;
					dragstart.y = event.clientY;
				}
			});
			Object.defineProperty(window, config.imageDragEnd, {
				value: function(event: DragEvent): void {
					event.preventDefault();
					if (Active === null) return;
					const className: string = (<Element>event.target).classList.item(0);
					if (Active.className !== className) return;
					const correctXY: number = (scene[now].Camera.now.z - Active.now.z) / Active.now.z;
					const dx: number = (event.clientX - dragstart.x) * 100 / Canvas.element.offsetWidth * correctXY;
					const dy: number = (event.clientY - dragstart.y) * 100 / Canvas.element.offsetHeight * correctXY;
					transform.translate(Active, dx, dy, 0);
				}
			});
		}
	}
}
export const EventListenerStart = EventListener.Start;
