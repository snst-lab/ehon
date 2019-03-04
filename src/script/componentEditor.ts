import { Canvas } from './canvas';
import { ImageCollection } from './imageCollection';

export namespace ComponentEditor {
	const image = new ImageCollection.Controller();
	let keyDown: string | null = null;

	class activeStyle {
		static color: string = '#00ffdd';
		static style: string = 'solid';
		static width: string = '3px';
	}
	class params {
		static translateXYFine: number = 0.01;
		static translateZFine: number = 0.03;
		static sizeFine: number = 0.01;
		static rotateFine: number = 0.05;
		static opacityFine: number = 0.001;
		static blurFine: number = 0.01;
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
			Canvas.DOM.on('mousewheel', (event: WheelEvent): void => {
				event.preventDefault();
				if (ImageCollection.Active === null) return;
				switch (keyDown) {
					case 'x':
						new translate().x(ImageCollection.Active, event.deltaY * params.translateXYFine);
						break;
					case 'y':
						new translate().y(ImageCollection.Active, event.deltaY * params.translateXYFine);
						break;
					case 'z':
						new translate().z(ImageCollection.Active, event.deltaY * params.translateZFine);
						break;
					case 's':
						new size().change(ImageCollection.Active, event.deltaY * params.sizeFine);
						break;
					case 'r':
						new rotate().change(ImageCollection.Active, event.deltaY * params.rotateFine);
						break;
					case 'b':
						new blur().change(ImageCollection.Active, event.deltaY * params.blurFine);
						break;
					case 'o':
						new opacity().change(ImageCollection.Active, event.deltaY * params.opacityFine);
						break;
					default:
						break;
				}
			});
		}

		private listenCanvasClick(): void {
			Canvas.DOM.on('click', (event) => {
				event.preventDefault();
				this.releaseActivate();
			});
		}

		private releaseActivate(): void {
			if (ImageCollection.Active !== null) {
				ImageCollection.Active.element.style['outline-color'] = '';
				ImageCollection.Active.element.style['outline-style'] = '';
				ImageCollection.Active.element.style['outline-width'] = '';
				ImageCollection.Active = null;
			}
		}

		private defineProperty(): void {
			Object.defineProperty(window, 'onDoubleClick', {
				value: function(event) {
					new onDoubleClick(event);
				}
			});
		}
	}

	export class onDoubleClick {
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
					deactive.style['outline-color'] = '';
					deactive.style['outline-style'] = '';
					deactive.style['outline-width'] = '';
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
			selector.component.x += delta * selector.component.z / ImageCollection.params.vanishingPoint;
			selector.element.style.setProperty('left', `${selector.component.x}%`, 'important');
		}
		y(selector: ImageCollection.Selector, delta: number) {
			selector.component.y += delta * selector.component.z / ImageCollection.params.vanishingPoint;

			selector.element.style.setProperty('top', `${selector.component.y}%`, 'important');
		}
		z(selector: ImageCollection.Selector, delta: number) {
			selector.component.z = Math.max(selector.component.z + delta, Canvas.Z);
			selector.element.style.setProperty('z-index', `${selector.component.z}`, 'important');

			const scaleByZtrans: number =
				(selector.component.z - Canvas.Z) / (ImageCollection.params.initialZ - Canvas.Z);
			const blurByZtrans: number =
				Math.abs(selector.component.z - ImageCollection.params.initialZ) / ImageCollection.params.depthOfField;
			[ '', '-webkit-' ].forEach((prefix) => {
				selector.element.style.setProperty(prefix + 'transform', `scale(${scaleByZtrans})`, 'important');
				selector.element.style.setProperty(
					prefix + 'filter',
					`blur(${selector.component.blur + blurByZtrans}px)`,
					'important'
				);
			});
		}
	}

	class size {
		constructor() {}
		change(selector: ImageCollection.Selector, delta: number) {
			selector.component.size = Math.max(selector.component.size + delta, 0.01);
			selector.element.style.setProperty('width', `${selector.component.size}%`, 'important');
		}
	}

	class rotate {
		constructor() {}
		change(selector: ImageCollection.Selector, delta: number) {
			selector.component.rotate = (selector.component.rotate + delta) % 360;
			[ '', '-webkit-' ].forEach((prefix) => {
				selector.element.style.setProperty(
					prefix + 'transform',
					`rotate(${selector.component.rotate}deg)`,
					'important'
				);
			});
		}
	}

	class blur {
		constructor() {}
		change(selector: ImageCollection.Selector, delta: number) {
			selector.component.blur = Math.max(selector.component.blur + delta, 0);
			const blurByZtrans: number =
				Math.abs(selector.component.z - ImageCollection.params.initialZ) / ImageCollection.params.depthOfField;
			[ '', '-webkit-' ].forEach((prefix) => {
				selector.element.style.setProperty(
					prefix + 'filter',
					`blur(${selector.component.blur + blurByZtrans}px)`,
					'important'
				);
			});
		}
	}

	class opacity {
		constructor() {}
		change(selector: ImageCollection.Selector, delta: number) {
			selector.component.opacity = Math.max(selector.component.opacity + delta, 0);
			selector.component.opacity = Math.min(1, selector.component.opacity);
			selector.element.style.setProperty('opacity', `${selector.component.opacity}`, 'important');
		}
	}
}
