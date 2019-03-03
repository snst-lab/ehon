import { ImageCollection } from './imageCollection';

export namespace ComponentEditor {
	const image = new ImageCollection.Controller();
	const editableBorderStyle: string = '3px solid #00ffdd;';
	let keyDown: string | null = null;

	interface position {
		x: number;
		y: number;
	}

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
		constructor() {}

		public init() {
			ImageCollection.canvas.on('click', (event) => {
				event.preventDefault();
				this.releaseEditable();
				// ImageCollection.canvas.removeEventListener('click', () => false,false);
				// event.target.removeEventListener('click', () => false,false);
			});
			new detectkeyDown();
		}

		protected addEventListener(selector: ImageCollection.Selector): void {
			window.addEventListener('mousewheel', (event: WheelEvent):void => {
				event.preventDefault();
				switch (keyDown) {
					case 'x':
						new translate().x(selector, event.deltaY);
						break;
					case 'y':
						new translate().y(selector, event.deltaY);
						break;
					case 'z':
						new translate().z(selector, event.deltaY);
						break;
					default:
						break;
				}
			},false);
		}

		protected releaseEditable(): void {
			if (ImageCollection.editable !== null) {
				const element: HTMLImageElement = document.querySelector('.' + ImageCollection.editable);
				element.border = '';
				ImageCollection.editable = null;
				// window.removeEventListener('mousewheel', this.callback, true);
			}
		}
	}

	export class onRightClick extends EventHandler {
		constructor(event: any) {
			super();
			event.preventDefault();
			super.releaseEditable();
			this.setStateToEditable(event);
		}

		private setStateToEditable(event: any): void {
			const className = event.target.classList.item(0);
			if (ImageCollection.editable === className) return;

			ImageCollection.editable = className;
			ImageCollection.Image.forEach((e) => {
				const selector = image.select(e.className);
				if (e.className === className) {
					selector.element.border = editableBorderStyle;
					super.addEventListener(selector);
				} else {
					// selector.element.removeEventListener('mousewheel', ()=>console.log(123), false);
					selector.element.border = '';
				}
			});
		}
	}

	class detectkeyDown {
		constructor() {
			document.addEventListener('keydown',(event)=>{
				if (keyDown === null) {
					keyDown = keyMap[event.keyCode];
				}
			},false);
			document.addEventListener('keyup', (event) => {
				keyDown = null;
			},false);
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
