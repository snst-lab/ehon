import { DOMController } from './domController';

export namespace Canvas {
	const el = DOMController.Selector;
	export const ClassName: string = 'canvas';
	export const DOM: DOMController.Selector<string> = new el<string>('.' + ClassName);
	export const Element: HTMLElement = document.querySelector('.'+ClassName);
	export const Z: number = Number(Element.style.zIndex);
}
