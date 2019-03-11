import { DOMController } from './domController';

export namespace Canvas {
	const el = DOMController.Elem;
	export const ClassName: string = 'canvas';
	export const DOM: DOMController.Elem= new el('.' + ClassName);
	export const Element: HTMLElement = <HTMLElement>DOM.dom;
	export const Z: number = Number(Element.style.zIndex);
}
