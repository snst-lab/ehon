import { Canvas } from './canvas';
import { ComponentManager as Component } from './componentManager';

export namespace ComponentEditor {
	const component = new Component.Controll();
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
				if (Component.Active === null) return;
				switch (keyDown) {
					case 'x':
						new translate().x(Component.Active, event.deltaY * params.translateXYFine);
						break;
					case 'y':
						new translate().y(Component.Active, event.deltaY * params.translateXYFine);
						break;
					case 'z':
						new translate().z(Component.Active, event.deltaY * params.translateZFine);
						break;
					case 's':
						new size().change(Component.Active, event.deltaY * params.sizeFine);
						break;
					case 'r':
						new rotate().change(Component.Active, event.deltaY * params.rotateFine);
						break;
					case 'b':
						new blur().change(Component.Active, event.deltaY * params.blurFine);
						break;
					case 'o':
						new opacity().change(Component.Active, event.deltaY * params.opacityFine);
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
			if (Component.Active !== null) {
				//penetration
				Component.All.forEach((e) => {
					if (e.className === Component.Active.className) {
						e.element.style.pointerEvents = 'none';
						e.pointer = false;
					} else {
						e.element.style.pointerEvents = 'auto';
						e.pointer = true;
					}
				});
				//style off
				Component.Active.element.style.outlineColor = '';
				Component.Active.element.style.outlineStyle = '';
				Component.Active.element.style.outlineWidth = '';
				Component.Active = null;
			}
		}

		private defineProperty(): void {
			Object.defineProperty(window, 'onClick', {
				value: function(event) {
					new onClick(event);
				}
			});
			Object.defineProperty(window, 'onDoubleClick', {
				value: function(event) {
					new onDoubleClick(event);
				}
			});
		}
	}

	export class onClick {
		constructor(event: any) {}
	}

	export class onDoubleClick {
		constructor(event: any) {
			event.preventDefault();
			this.activate(event);
		}

		private activate(event: any): void {
			const className: string = event.target.classList.item(0);

			if (Component.Active !== null && Component.Active.className === className) return;

			Component.Active = component.select(className);
			Component.Active.element.style.outlineColor = activeStyle.color;
			Component.Active.element.style.outlineStyle = activeStyle.style;
			Component.Active.element.style.outlineWidth = activeStyle.width;

			Component.All.forEach((e) => {
				if (e.className !== className) {
					e.element.style.outlineColor = '';
					e.element.style.outlineStyle = '';
					e.element.style.outlineWidth = '';
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
		x(selector: Component.Type, delta: number) {
			selector.x += delta * selector.z / Component.params.vanishingPoint;
			selector.element.style.setProperty('left', `${selector.x}%`, 'important');
		}
		y(selector: Component.Type, delta: number) {
			selector.y += delta * selector.z / Component.params.vanishingPoint;

			selector.element.style.setProperty('top', `${selector.y}%`, 'important');
		}
		z(selector: Component.Type, delta: number) {
			selector.z = Math.max(selector.z + delta, Canvas.Z);
			selector.element.style.setProperty('z-index', `${selector.z}`, 'important');

			const scaleByZtrans: number = (selector.z - Canvas.Z) / (Component.params.initialZ - Canvas.Z);
			const blurByZtrans: number =
				Math.abs(selector.z - Component.params.initialZ) / Component.params.depthOfField;
			[ '', '-webkit-' ].forEach((prefix) => {
				selector.element.style.setProperty(prefix + 'transform', `scale(${scaleByZtrans})`, 'important');
				selector.element.style.setProperty(
					prefix + 'filter',
					`blur(${selector.blur + blurByZtrans}px)`,
					'important'
				);
			});
		}
	}

	class size {
		constructor() {}
		change(selector: Component.Type, delta: number) {
			selector.size = Math.max(selector.size + delta, 0.01);
			selector.element.style.setProperty('width', `${selector.size}%`, 'important');
		}
	}

	class rotate {
		constructor() {}
		change(selector: Component.Type, delta: number) {
			selector.rotate = (selector.rotate + delta) % 360;
			[ '', '-webkit-' ].forEach((prefix) => {
				selector.element.style.setProperty(prefix + 'transform', `rotate(${selector.rotate}deg)`, 'important');
			});
		}
	}

	class blur {
		constructor() {}
		change(selector: Component.Type, delta: number) {
			selector.blur = Math.max(selector.blur + delta, 0);
			const blurByZtrans: number =
				Math.abs(selector.z - Component.params.initialZ) / Component.params.depthOfField;
			[ '', '-webkit-' ].forEach((prefix) => {
				selector.element.style.setProperty(
					prefix + 'filter',
					`blur(${selector.blur + blurByZtrans}px)`,
					'important'
				);
			});
		}
	}

	class opacity {
		constructor() {}
		change(selector: Component.Type, delta: number) {
			selector.opacity = Math.max(selector.opacity + delta, 0);
			selector.opacity = Math.min(1, selector.opacity);
			selector.element.style.setProperty('opacity', `${selector.opacity}`, 'important');
		}
	}
}
