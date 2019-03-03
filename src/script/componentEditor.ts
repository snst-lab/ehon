import { ImageCollection } from './imageCollection';

export namespace ComponentEditor {
	const image = new ImageCollection.Controller();
	const ActiveBorderStyle: string = '3px solid #00ffdd;';
	let keyDown: string | null = null;

	class activeStyle {
		static color: string = '#00ffdd';
		static style: string = 'solid';
		static width: string = '3px';
	}
	class params {
		static translateFine: number = 0.1;
		static scaleFine: number = 0.001;
		static rotateFine: number = 0.05;
		static opacityFine: number = 0.001;
		static blurFine: number = 0.005;
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
				if (ImageCollection.Active === null) return;
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
					case 's':
						new scale().change(ImageCollection.Active, event.deltaY);
						break;
					case 'r':
						new rotate().change(ImageCollection.Active, event.deltaY);
						break;
					case 'b':
						new blur().change(ImageCollection.Active, event.deltaY);
						break;
					case 'o':
						new opacity().change(ImageCollection.Active, event.deltaY);
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
			ImageCollection.Active.element.style['outline-color'] = activeStyle.color;
			ImageCollection.Active.element.style['outline-style'] = activeStyle.style;
			ImageCollection.Active.element.style['outline-width'] = activeStyle.width;

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
			selector.component.blur = Math.abs(selector.component.z + delta * params.translateFine)*params.blurFine;
			[ '', '-ms-', '-webkit-' ].forEach((prefix) => {
				selector.element.style.setProperty(
					prefix + 'filter',
					`blur(${selector.component.blur}px)`,
					'important'
				);
			});
		}
	}

	class scale {
		constructor() {}
		change(selector: ImageCollection.Selector, delta: number) {
			selector.component.scale = Math.max(selector.component.scale + delta * params.scaleFine, 0.01);

			[ '', '-ms-', '-webkit-' ].forEach((prefix) => {
				selector.element.style.setProperty(
					prefix + 'transform',
					`scale(${selector.component.scale}) rotate(${selector.component
						.rotate}deg) perspective(500px) translate3d(0px,0px,${selector.component.z}px)`,
					'important'
				);
			});
		}
	}

	class rotate {
		constructor() {}
		change(selector: ImageCollection.Selector, delta: number) {
			selector.component.rotate = (selector.component.rotate + delta * params.rotateFine) % 360;

			[ '', '-ms-', '-webkit-' ].forEach((prefix) => {
				selector.element.style.setProperty(
					prefix + 'transform',
					`scale(${selector.component.scale}) rotate(${selector.component
						.rotate}deg) perspective(500px) translate3d(0px,0px,${selector.component.z}px)`,
					'important'
				);
			});
		}
	}

	class blur {
		constructor() {}
		change(selector: ImageCollection.Selector, delta: number) {
			selector.component.blur = Math.max(selector.component.blur + delta * params.blurFine, 0);

			[ '', '-ms-', '-webkit-' ].forEach((prefix) => {
				selector.element.style.setProperty(
					prefix + 'filter',
					`blur(${selector.component.blur}px)`,
					'important'
				);
			});
		}
	}

	class opacity {
		constructor() {}
		change(selector: ImageCollection.Selector, delta: number) {
			selector.component.opacity = Math.max(selector.component.opacity + delta * params.opacityFine, 0);
			selector.component.opacity = Math.min(1, selector.component.opacity);
			selector.element.style.opacity = '' + selector.component.opacity;
		}
	}
}
