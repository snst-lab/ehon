import { DOMController } from './domController';

export namespace ImageCollection {
	const el = DOMController.Selector;
	export const ImageSrcPath: string = 'assets/img/';
	export const CanvasClassName: string = 'canvas';
	export const canvas: DOMController.Selector<string> = new el<string>('.' + CanvasClassName);
	export let Image: Array<Component> = new Array();
	export let editable: string | null = null;

	export function uniqueString(): string {
		return new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16);
	}

	export interface Component {
		fileName: string;
		className: string;
		x: number;
		y: number;
		z: number;
		scale: number;
		rotate: number;
		blur: number;
		opacity: number;
	}

	export interface Selector {
		element: HTMLImageElement;
		component: Component;
	}

	export class Controller {
		constructor() {}

		create(
			filename: string,
			x: number,
			y: number,
			z?: number,
			scale?: number,
			rotate?: number,
			blur?: number,
			opacity?: number
		): string {
			const className = 'img-' + uniqueString();
			canvas.append(`
			<img draggable="true" 
			 ondragstart="onDragStart(event);"
			 ondragend="onDragEnd(event);"
			 oncontextmenu="onRightClick(event);"
			 src="${ImageSrcPath}${filename}"
			 class="${className} component-img" 
			 style="position:absolute;width:30%;transform-origin:50% 50%;perspective-origin:50% 50%;
			 left:${x};top:${y};
			 transform: scale(${scale || 1},${scale ||
				1}) rotate(${rotate || 0}deg)  translate3d(0px,0px,${z || 0}px); opacity: ${opacity ||
				1} ; filter:blur(${blur || 0}px)
			 ">
			`);
			let component: Component = {
				fileName: filename,
				className: className,
				x: x,
				y: y,
				z: z,
				scale: scale,
				rotate: rotate,
				blur: blur,
				opacity: opacity
			};
			Image.push(component);
			return className;
		}

		select(className: string): Selector {
			return {
				element: <HTMLImageElement>document.getElementsByClassName(className)[0],
				component: Image.filter((e) => e.className === className)[0]
			};
		}

		translate(selector: Selector, dx: number, dy: number, dz: number): void {
			selector.element.style.left = `${selector.component.x + dx}px`;
			selector.element.style.top = `${selector.component.y + dy}px`;

			[ '', '-ms-', '-webkit-' ].forEach((prefix) => {
				selector.element.style.setProperty(
					prefix + 'transform',
					`scale(${selector.component.scale},${selector.component.scale}) rotate(${selector.component
						.rotate}deg) perspective(500px) translate3d(0px,0px,${selector.component.z + dz}px)`,
					'important'
				);
			});
			if (typeof dx === 'number') selector.component.x += dx;
			if (typeof dy === 'number') selector.component.y += dy;
			if (typeof dz === 'number') selector.component.z += dz;
		}
	}
}
