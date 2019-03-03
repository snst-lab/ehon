import { ImageCollection } from './imageCollection';

export namespace ComponentEditor {
	const image = new ImageCollection.Controller();
	const ActiveBorderStyle: string = '3px solid #00ffdd;';
	let keyDown: string | null = null;

	class params {
		static translateFine: number = 0.1;
		static blurFine: number = 1;
	}

	const keyMap: { [key: number]: string } = {
		88: 'x',
		89: 'y',
		90: 'z',
		83: 's',
		82: 'r',
		66: 'b',
		79: 'o'
	};

	export class EventHandler {
		constructor() {
			new detectkeyDown();
			this.defineProperty();
			this.listenCanvasWheel();
			this.listenCanvasClick();
		}

		private listenCanvasWheel(): void {
			ImageCollection.canvas.on('mousewheel', (event: WheelEvent): void => {
				event.preventDefault();
				switch (keyDown) {
					case 'x':
						new translate().x(ImageCollection.Active, event.deltaY);
						break;
					case 'y':
						new translate().y(ImageCollection.Active, event.deltaY);
						break;
					case 'z':
						new translate().z(ImageCollection.Active, event.deltaY);
						break;
					default:
						break;
				}
			});
		}

		private listenCanvasClick(): void {
			ImageCollection.canvas.on('click', (event) => {
				event.preventDefault();
				this.releaseActivate();
			});
		}

		private releaseActivate(): void {
			if (ImageCollection.Active !== null) {
				ImageCollection.Active.element.border = '';
				ImageCollection.Active = null;
			}
		}

		private defineProperty(): void {
			Object.defineProperty(window, 'onRightClick', {
				value: function(event) {
					new onRightClick(event);
				}
			});
		}
	}

	export class onRightClick {
		constructor(event: any) {
			event.preventDefault();
			this.activate(event);
		}

		private activate(event: any): void {
			const className = event.target.classList.item(0);
			if (ImageCollection.Active !== null && ImageCollection.Active.element.className === className) return;

			ImageCollection.Active = image.select(className);
			ImageCollection.Active.element.border = ActiveBorderStyle;

			ImageCollection.All.forEach((e) => {
				if (e.className !== className) {
					const deactive: HTMLImageElement = document.querySelector('.' + e.className);
					deactive.border = '';
				}
			});
		}
	}

	class detectkeyDown {
		constructor() {
			document.addEventListener(
				'keydown',
				(event) => {
					if (keyDown === null) {
						keyDown = keyMap[event.keyCode];
					}
				},
				false
			);
			document.addEventListener(
				'keyup',
				(event) => {
					keyDown = null;
				},
				false
			);
		}
	}

	class translate {
		constructor() {}
		x(selector: ImageCollection.Selector, delta: number) {
			image.translate(selector, delta * params.translateFine, 0, 0);
		}
		y(selector: ImageCollection.Selector, delta: number) {
			image.translate(selector, 0, delta * params.translateFine, 0);
		}
		z(selector: ImageCollection.Selector, delta: number) {
			image.translate(selector, 0, 0, delta * params.translateFine);
		}
	}
}
