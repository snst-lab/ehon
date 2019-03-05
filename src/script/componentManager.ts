import { Canvas } from './canvas';

export namespace ComponentManager {
	export const ImageSrcPath: string = 'assets/img/';
	export let All: Array<Type> = new Array();
	export let Active: Type | null = null;

	function uniqueString(): string {
		return new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16);
	}

	export class params {
		static defaultSize: number = 50; //per canvas size
		static initialZ: number = 100; // from canvas z
		static focusZ : number = 100; // from viewer 
		static depthOfField: number = 100; 
		static vanishingPoint: number = params.initialZ + params.focusZ
	}

	export interface Type {
		element: HTMLElement;
		fileName: string;
		className: string;
		x: number;
		y: number;
		z: number;
		size: number;
		rotate: number;
		blur: number;
		opacity: number;
		pointer: boolean;
	}


	export class Controll {
		constructor() {}

		create(filename: string, x: number, y: number): string {
			const className = 'img-' + uniqueString();
			Canvas.DOM.render(`
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
			 pointer-events:auto;
			 ">
			`);
			let component: Type = {
				element: document.querySelector('.'+className),
				fileName: filename,
				className: className,
				x: x,
				y: y,
				z: params.initialZ +  Canvas.Z,
				size: params.defaultSize,
				rotate: 0,
				blur: 0,
				opacity: 1,
				pointer:true
			};
			All.push(component);
			return className;
		}

		select(className: string): Type {
			return All.filter((e) => e.className === className)[0]
		}
	}

}
