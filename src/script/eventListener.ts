import { param, config } from './parameter';
import { Canvas } from './canvas';
import { Component } from './component';
import { Editor } from './editor';
import {  Transition } from './transition';

export namespace EventListener {
	const editor = new Editor.EventHandler();
	const trans = new Editor.Transform();
	let keyDown: string | null = null;

	const keyMap: { [key: number]: string } = {
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
			this.detectKeyDown();
			this.listenCanvasWheel();
			this.listenCanvasClick();
			this.listenCameraClick();
			this.listenCanvasDrop();
			this.listenBackgroundClick();
			this.listenBackgroundDoubleClick();
			this.listenPushStateClick();
			this.listenPlayClick();
			this.listenImageEvent();
		}

		private detectKeyDown() {
			document.addEventListener(
				'keydown',
				(event:any) => {
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

		private listenCanvasWheel(): void {
			Canvas.DOM.on('mousewheel', (event: WheelEvent): void => {
				event.preventDefault();
				if (Editor.Active === null) return;
				switch (keyDown) {
					case 'x':
						trans.translate(Editor.Active, event.deltaY * param.wheelResponse.XY, 0, 0);
						break;
					case 'y':
						trans.translate(Editor.Active, 0, event.deltaY * param.wheelResponse.XY, 0);
						break;
					case 'z':
						trans.translate(Editor.Active, 0, 0, event.deltaY * param.wheelResponse.Z);
						break;
					case 'r':
						trans.rotate(Editor.Active, event.deltaY * param.wheelResponse.rotate);
						break;
					case 's':
						trans.scale(Editor.Active, event.deltaY * param.wheelResponse.scale);
						break;
					case 'b':
						trans.blur(Editor.Active, event.deltaY * param.wheelResponse.blur);
						break;
					case 'o':
						trans.opacity(Editor.Active, event.deltaY * param.wheelResponse.opacity);
						break;
					default:
						break;
				}
			});
		}
		private listenCameraClick(): void {
			Component.Camera.element.addEventListener('click', (event:any) => {
				event.preventDefault();
				editor.CameraClick(event);
			},false);
		}
		private listenCanvasClick(): void {
			Canvas.DOM.on('click', (event:any) => {
				event.preventDefault();
				editor.CanvasClick(event);
			});
		}
		private listenBackgroundClick(): void {
			Component.Background.element.addEventListener('click', (event:any) => {
				event.preventDefault();
				editor.BackgroundClick(event);
			},false);
		}
		private listenBackgroundDoubleClick(): void {
			Component.Background.element.addEventListener('dblclick', (event:any) => {
				event.preventDefault();
				editor.BackgroundDoubleClick(event);
			},false);
		}
		private listenCanvasDrop(): void {
			Canvas.DOM.on('drop', (event:any) => {
				event.preventDefault();
				if (event.dataTransfer.items) {
					// Use DataTransferItemList interface to access the file(s)
					for (let i: number = 0; i < event.dataTransfer.items.length; i++) {
						// If dropped items aren't files, reject them
						if (event.dataTransfer.items[i].kind === 'file') {
							editor.CanvasDrop(event, event.dataTransfer.items[i].getAsFile());
						}
					}
				}
			});
		}
		private listenPushStateClick(): void {
			document.querySelector('.state-push').addEventListener('click',(event:any)=>{
				event.preventDefault();
				editor.PushStateClick(event);
			},false);
		}
		private listenPlayClick(): void {
			document.querySelector('.state-play').addEventListener(
				'click',
				(event: any) => {
					event.preventDefault();
					new Transition.Animation().play(Editor.Active);
				},
				false
			);
		}


		private listenImageEvent(): void {
			Object.defineProperty(window, config.imageClick, {
				value: function(event:any) {
					event.preventDefault();
					editor.ImageClick(event);
				}
			});
			Object.defineProperty(window, config.imageDoubleClick, {
				value: function(event:any) {
					event.preventDefault();
					editor.ImageDoubleClick(event);
				}
			});
			Object.defineProperty(window, config.imageDragStart, {
				value: function(event:any) {
					// event.preventDefault();
					editor.ImageDragStart(event);
				}
			});
			Object.defineProperty(window, config.imageDragEnd, {
				value: function(event:any) {
					event.preventDefault();
					editor.ImageDragEnd(event);
				}
			});
		}
	}
}
