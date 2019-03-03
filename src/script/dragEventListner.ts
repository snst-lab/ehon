import { ImageCollection } from './imageCollection';

export namespace DragEventListner {
	const image = new ImageCollection.Controller();

	interface position {
		x: number;
		y: number;
	}
	let dragstart: position = { x: 0, y: 0 };
	let dragend: position = { x: 0, y: 0 };

	export class EventHandler{
		constructor(){
			Object.defineProperty(window, 'onDrop', {
				value: function(event) {
					new onDrop(event);
				}
			});
			Object.defineProperty(window, 'onDragStart', {
				value: function(event) {
					new onDragStart(event);
				}
			});
			Object.defineProperty(window, 'onDragEnd', {
				value: function(event) {
					new onDragEnd(event);
				}
			});
		}
	}

	class onDrop {
		constructor(event: any) {
			// console.log(event);
			event.preventDefault();
			this.drop(event);
		}

		private drop(event: any): void {
			if (event.dataTransfer.items) {
				// Use DataTransferItemList interface to access the file(s)
				for (let i: number = 0; i < event.dataTransfer.items.length; i++) {
					// If dropped items aren't files, reject them
					if (event.dataTransfer.items[i].kind === 'file') {
						this.createElement(event, event.dataTransfer.items[i].getAsFile());
					}
				}
			}
		}

		private createElement(event: any, file: File): void {
			const className: string = image.create(file.name, event.offsetX, event.offsetY, 0, 1, 0, 0, 1);
		}
	}

	class onDragStart {
		constructor(event: any) {
			// console.log(event);
			// event.preventDefault();
			this.dragStart(event);
		}

		private dragStart(event: any): void {
			dragstart.x = event.clientX;
			dragstart.y = event.clientY;
		}
	}
	class onDragEnd {
		constructor(event: any) {
			// console.log(event);
			// event.preventDefault();
			this.translate(event);
		}
		private translate(event: any): void {

			const className = event.target.classList.item(0);
			const selector = image.select(className);
			const dx: number = event.clientX - dragstart.x;
			const dy: number = event.clientY - dragstart.y;

			image.translate(selector, dx, dy, 0);
		}
	}
}
