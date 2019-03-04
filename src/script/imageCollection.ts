import { Canvas } from './canvas';

export namespace ImageCollection {
	export const ImageSrcPath: string = 'assets/img/';
	export let All: Array<Component> = new Array();
	export let Active: Selector | null = null;

	export class params {
		static defaultSize: number = 50; //per canvas size
		static initialZ: number = 100; // from canvas z
		static focusZ : number = 100; // from viewer 
		static depthOfField: number = 100; 
		static vanishingPoint: number = params.initialZ + params.focusZ
	}

	export function uniqueString(): string {
		return new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16);
	}

	export interface Component {
		fileName: string;
		className: string;
		x: number;
		y: number;
		z: number;
		size: number;
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

		create(filename: string, x: number, y: number): string {
			const className = 'img-' + uniqueString();
			Canvas.DOM.append(`
			<img draggable="true" 
			 ondragstart="onDragStart(event);"
			 ondragend="onDragEnd(event);"
			 ondblclick="onDoubleClick(event);"
			 src="${ImageSrcPath}${filename}"
			 class="${className} component-img" 
			 style="position:absolute;outline:none;
			 left:${x}%;top:${y}%;
			 z-index:${params.initialZ + Canvas.Z};
			 width:${params.defaultSize}%;
			 transform-origin:50% 50%;
			 transform: scale(1);
			 transform: rotate(0deg);
			 filter:blur(0px);
			 opacity:1; 
			 ">
			`);
			let component: Component = {
				fileName: filename,
				className: className,
				x: x,
				y: y,
				z: params.initialZ +  Canvas.Z,
				size: params.defaultSize,
				rotate: 0,
				blur: 0,
				opacity: 1
			};
			All.push(component);
			return className;
		}

		select(className: string): Selector {
			return {
				element: <HTMLImageElement>document.getElementsByClassName(className)[0],
				component: All.filter((e) => e.className === className)[0]
			};
		}

		translate(selector: Selector, dx: number, dy: number, dz: number): void {
			selector.component.x += dx;
			selector.component.y += dy;
			selector.element.style.setProperty('left', `${selector.component.x}%`,'important');
			selector.element.style.setProperty('top', `${selector.component.y}%`,'important');
		}
	}
}
