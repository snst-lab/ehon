import { Canvas } from './canvas';
import { ComponentManager as Component } from './componentManager';

export namespace DragEventListner {
	const component = new Component.Controll();

	interface position {
		x: number;
		y: number;
	}
	let dragstart: position = { x: 0, y: 0 };
	let dragend: position = { x: 0, y: 0 };

	export class EventHandler {
		constructor() {
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
			component.create(
				file.name,
				event.offsetX / (Canvas.Element.offsetWidth + Canvas.Element.offsetLeft) *100,
				event.offsetY /  (Canvas.Element.offsetHeight+ Canvas.Element.offsetTop) *100,
			);
		}
	}

	class onDragStart {
		constructor(event: any) {
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
			event.preventDefault();
			this.calcPosition(event);
		}
		private calcPosition(event: any): void {
			const className = event.target.classList.item(0);
			const selector = component.select(className);

			const dx: number = (event.clientX - dragstart.x)/Canvas.Element.offsetWidth*100;
			const dy: number = (event.clientY - dragstart.y)/Canvas.Element.offsetHeight*100;;
			this.translate(selector, dx, dy, 0);
		}
		private translate(selector: Component.Type, dx: number, dy: number, dz: number): void {
			selector.x += dx;
			selector.y += dy;
			selector.element.style.setProperty('left', `${selector.x}%`,'important');
			selector.element.style.setProperty('top', `${selector.y}%`,'important');
		}
	}
}
