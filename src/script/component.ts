import { param, config } from './parameter';
import { Canvas } from './canvas';

export namespace Component {
	export type Type = Image | BackgroundClass | CameraClass | null;

	export interface Style {
		src: string | null;
		x: number | null;
		y: number | null;
		z: number | null;
		rotate: number | null;
		scale: number | null;
		blur: number | null;
		opacity: number | null;
	}

	export class Base {
		type: string;
		element: HTMLElement;
		className: string;
		pointer: boolean;
		frame: Array<Style>;
		now: Style;
		pushFrame(): void {
			this.frame.push(this.now);
		}
		insertFrame(frame: number): void {
			this.frame[frame] = this.now;
		}
	}

	export class CameraClass extends Component.Base {
		constructor() {
			super();
			this.type = 'camera';
			const style: Component.Style = {
				src: null,
				x: param.camera.initialX,
				y: param.camera.initialY,
				z: param.camera.initialZ,
				rotate: 0,
				scale: null,
				blur: null,
				opacity: null
			};
			this.className = 'component-camera';
			this.element = document.querySelector('.' + this.className);
			this.pointer = true;
			this.frame = new Array<Style>();
			this.frame.push(style);
			this.now = style;
		}
		change({ src, x, y, z, rotate, scale, blur, opacity }: Component.Style, option: string): void {
			const style = { src, x, y, z, rotate, scale, blur, opacity };
			this.now = style;

			[ ...Component.Images, Component.Background ].forEach((e) => {
				e.change(
					{
						src: e.now.src,
						x: e.now.x,
						y: e.now.y,
						z: e.now.z,
						rotate: e.now.rotate,
						scale: e.now.scale,
						blur: e.now.blur,
						opacity: e.now.opacity
					},
					option
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
			const style: Component.Style = {
				src: src,
				x: (Camera.now.z/param.image.initialZ-1)*x + Camera.now.x + (2 - Camera.now.z / param.image.initialZ) * param.camera.vanishingX,
				y: (Camera.now.z/param.image.initialZ-1)*y + Camera.now.y + (2 - Camera.now.z / param.image.initialZ) * param.camera.vanishingY,
				z: param.image.initialZ,
				rotate: 0,
				scale: 1,
				blur: 0,
				opacity: 1
			};
			const className: string = 'img-' + Component.uniqueString();
			this.createElement(className, style);
		}
		createElement(className: string, style: Component.Style) {
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
			this.frame = new Array<Style>();
			this.frame.push(style);
			this.now = style;
		}
		cssText({ src, x, y, z, rotate, scale, blur, opacity }: Component.Style, option: string): string {
			const distanceInverse: number = 1 / Math.max(Camera.now.z - z, 1);
			const size: number = (param.camera.initialZ - param.background.initialZ) * distanceInverse;
			return `${this.styleFix}${option}
				background-image:url(${config.imageSrcUrl}${src});
				left:${(x - Camera.now.x - param.camera.vanishingX) * z * distanceInverse + param.camera.vanishingX}%;
				top:${(y - Camera.now.y - param.camera.vanishingY) * z * distanceInverse + param.camera.vanishingY}%;
				z-index:${z + param.canvas.Z};
				width:${param.image.defaultSize * size}%;
				height:${Canvas.Element.offsetWidth * param.image.defaultSize * 0.01 * param.image.aspectRatio * size}px;
				transform: rotate(${rotate - Camera.now.rotate}deg) scale(${scale});
				filter:blur(${blur +
					Math.abs(Camera.now.z - z - param.camera.initialZ + param.image.initialZ) /
						param.camera.depthOfField}px);
				opacity:${Camera.now.z < z ? 0 : opacity || 1};
				pointer-events:${this.pointer || 'auto'};
			`;
		}
		change({ src, x, y, z, rotate, scale, blur, opacity }: Component.Style, option: string): void {
			const style = { src, x, y, z, rotate, scale, blur, opacity };
			this.now = style;
			this.element.style.cssText = this.cssText(style, option);
		}
	}
	export let Images: Array<Image> = new Array<Image>();


	export class BackgroundClass extends Component.Base {
		private styleFix: string = `position:absolute;transform-origin:50% 50%;background-size:contain;background-position:center;background-repeat:no-repeat;`;

		constructor() {
			super();
			this.type = 'background';
			const style: Component.Style = {
				src: config.backgroundFile,
				x: Camera.now.x + (2 - Camera.now.z / param.background.initialZ) * param.camera.vanishingX,
				y: Camera.now.y + (2 - Camera.now.z / param.background.initialZ) * param.camera.vanishingY,
				z: param.background.initialZ,
				rotate: 0,
				scale: param.background.defaultSize*0.01,
				blur: 0,
				opacity: 1
			};
			this.className = 'component-background';
			this.element = document.querySelector('.' + this.className);
			this.element.setAttribute('src', config.imageSrcPath + config.backgroundFile);
			this.pointer = true;
			this.frame = new Array<Style>();
			this.frame.push(style);
			this.now = style;
			this.element.style.cssText = this.cssText(style, '');
		}
		cssText({ src, x, y, z, rotate, scale, blur, opacity }: Component.Style, option: string): string {
			const distanceInverse: number = 1 / Math.max(Camera.now.z - z, 1);
			const size: number = (param.camera.initialZ - param.background.initialZ) * distanceInverse;
			return `${this.styleFix}${option}
				background-image:url(${config.imageSrcUrl}${src});
				left:${(x - Camera.now.x - param.camera.vanishingX) * z * distanceInverse + param.camera.vanishingX}%;
				top:${(y - Camera.now.y - param.camera.vanishingY) * z * distanceInverse + param.camera.vanishingY}%;
				z-index:${z + param.canvas.Z};
				width:${100 * size}%;
				height:${Canvas.Element.offsetWidth * param.background.aspectRatio * size}px;
				transform:rotate(${rotate - Camera.now.rotate}deg) scale(${scale});
				filter:blur(${blur +
					Math.abs(Camera.now.z - z - param.camera.initialZ + param.background.initialZ) /
						param.camera.depthOfField}px);
				opacity:${opacity}||1;
				pointer-events:${this.pointer || 'auto'};
			`;
		}
		change({ src, x, y, z, rotate, scale, blur, opacity }: Component.Style, option: string): void {
			const style = { src, x, y, z, rotate, scale, blur, opacity };
			this.now = style;
			this.element.style.cssText = this.cssText(style, option);
		}
	}
	export let Background: Component.BackgroundClass = new Component.BackgroundClass();

	export const uniqueString = (): string =>
		new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16);
}
