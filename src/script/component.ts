import { param, config } from './parameter';
import { Canvas } from './canvas';
import { Style } from './style';

export namespace Component {
	export type Type = Image | BackgroundClass | CameraClass | null;

	export class Base {
		type: string;
		element: HTMLElement;
		className: string;
		pointer: boolean;
		state: Array<Style>;
		now: Style;
		pushState(): void {
			this.state.push(this.now);
		}
		editState(state: number): void {
			this.state[state] = this.now;
		}
	}

	export class CameraClass extends Component.Base {
		constructor() {
			super();
			this.type = 'camera';
			const style: Style = {
				src: '',
				x: param.camera.initialX,
				y: param.camera.initialY,
				z: param.camera.initialZ,
				rotate: 0,
				scale: null,
				blur: null,
				opacity: null,
				duration: param.animation.defaultDuration
			};
			this.className = 'camera';
			this.element = document.querySelector('.' + this.className);
			this.pointer = true;
			this.state = new Array<Style>();
			this.now = style;
		}
		change({ src, x, y, z, rotate, scale, blur, opacity, duration }: Style, option: string): void {
			this.now = { src, x, y, z, rotate, scale, blur, opacity, duration };

			[ ...Images, Background ].forEach((e) => {
				e.change(
					{
						src: e.now.src,
						x: e.now.x,
						y: e.now.y,
						z: e.now.z,
						rotate: e.now.rotate,
						scale: e.now.scale,
						blur: e.now.blur,
						opacity: e.now.opacity,
						duration: param.animation.defaultDuration
					},
					''
				);
			});
		}
	}
	export let Camera: CameraClass = new CameraClass();

	export class Image extends Component.Base {
		private styleFix: string = `position:absolute;transform-origin:50% 50%;background-size:contain;background-position:center;background-repeat:no-repeat;`;

		constructor(src: string, x: number, y: number) {
			super();
			this.type = 'image';
			const style: Style = {
				src: src,
				x:
					(Camera.now.z / param.image.initialZ - 1) * x +
					Camera.now.x +
					(2 - Camera.now.z / param.image.initialZ) * param.camera.vanishingX,
				y:
					(Camera.now.z / param.image.initialZ - 1) * y +
					Camera.now.y +
					(2 - Camera.now.z / param.image.initialZ) * param.camera.vanishingY,
				z: param.image.initialZ,
				rotate: 0,
				scale: 1,
				blur: 0,
				opacity: 1,
				duration: param.animation.defaultDuration
			};
			const className: string = 'img-' + Component.uniqueString();
			this.createElement(className, style);
		}
		createElement(className: string, style: Style) {
			Canvas.DOM.append(`
			<div draggable="true" 
			 ondragstart="${config.imageDragStart}(event);"
			 ondragend="${config.imageDragEnd}(event);"
			 onclick="${config.imageClick}(event);"
			 ondblclick="${config.imageDoubleClick}(event);"
			 class="${className} component-img" 
			 style="${this.cssText(style, '')}
			 "></div>
			`);
			this.element = document.querySelector('.' + className);
			this.className = className;
			this.pointer = true;
			this.state = new Array<Style>();
			this.now = style;
		}
		cssText({ src, x, y, z, rotate, scale, blur, opacity }: Style, option: string): string {
			const distanceInv: number = 1 / Math.max(Camera.now.z - z, 1);
			const size: number = (param.camera.initialZ - param.background.initialZ) * distanceInv;
			return `${this.styleFix}${option}
				background-image:url(${config.imageSrcUrl}${src});
				left:${(x - Camera.now.x - param.camera.vanishingX) * z * distanceInv + param.camera.vanishingX}%;
				top:${(y - Camera.now.y - param.camera.vanishingY) * z * distanceInv + param.camera.vanishingY}%;
				z-index:${~~z + param.canvas.Z};
				width:${param.image.defaultSize * size}%;
				height:${Canvas.Element.offsetWidth * param.image.defaultSize * 0.01 * param.image.aspectRatio * size}px;
				transform: rotate(${~~(rotate - Camera.now.rotate)}deg) scale(${scale});
				filter:blur(${~~(blur +
					Math.abs(Camera.now.z - z - param.camera.initialZ + param.image.initialZ) /
						param.camera.depthOfField)}px);
				opacity:${Camera.now.z < z ? 0 : ~~opacity || 1};
				pointer-events:${this.pointer || 'auto'};
			`;
		}
		change({ src, x, y, z, rotate, scale, blur, opacity, duration }: Style, option: string): void {
			this.now = { src, x, y, z, rotate, scale, blur, opacity, duration };
			this.element.style.cssText = this.cssText(this.now, option);
		}
	}
	export let Images: Array<Image> = new Array<Image>();

	export class BackgroundClass extends Component.Base {
		private styleFix: string = `position:absolute;transform-origin:50% 50%;background-size:contain;background-position:center;background-repeat:no-repeat;`;

		constructor() {
			super();
			this.type = 'background';
			const style: Style = {
				src: config.backgroundFile,
				x: Camera.now.x + (2 - Camera.now.z / param.background.initialZ) * param.camera.vanishingX,
				y: Camera.now.y + (2 - Camera.now.z / param.background.initialZ) * param.camera.vanishingY,
				z: param.background.initialZ,
				rotate: 0,
				scale: param.background.defaultSize * 0.01,
				blur: 0,
				opacity: 1,
				duration: param.animation.defaultDuration
			};
			this.className = 'background';
			this.element = document.querySelector('.' + this.className);
			this.pointer = true;
			this.state = new Array<Style>();
			this.now = style;
			this.element.style.cssText = this.cssText(style, '');
		}
		cssText({ src, x, y, z, rotate, scale, blur, opacity }: Style, option: string): string {
			const distanceInv: number = 1 / Math.max(Camera.now.z - z, 1);
			const size: number = (param.camera.initialZ - param.background.initialZ) * distanceInv;
			return `${this.styleFix}${option}
				background-image:url(${config.imageSrcUrl}${src});
				left:${(x - Camera.now.x - param.camera.vanishingX) * z * distanceInv + param.camera.vanishingX}%;
				top:${(y - Camera.now.y - param.camera.vanishingY) * z * distanceInv + param.camera.vanishingY}%;
				z-index:${~~z + param.canvas.Z};
				width:${100 * size}%;
				height:${Canvas.Element.offsetWidth * param.background.aspectRatio * size}px;
				transform:rotate(${~~(rotate - Camera.now.rotate)}deg) scale(${scale});
				filter:blur(${~~(blur +
					Math.abs(Camera.now.z - z - param.camera.initialZ + param.background.initialZ) /
						param.camera.depthOfField)}px);
				opacity:${opacity}||1;
				pointer-events:${this.pointer || 'auto'};
			`;
		}
		change({ src, x, y, z, rotate, scale, blur, opacity, duration }: Style, option: string): void {
			this.now = { src, x, y, z, rotate, scale, blur, opacity, duration };
			this.element.style.cssText = this.cssText(this.now, option);
		}
	}
	export let Background: Component.BackgroundClass = new Component.BackgroundClass();

	export const uniqueString = (): string =>
		new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16);
}
