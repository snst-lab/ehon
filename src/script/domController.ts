/**
### DOMController
	Wrapper of querySelector, appendChild, prependChild, addEventListener...,etc.
*/
namespace DOMController {
	export type NodeType = Element | HTMLElement | DocumentFragment | null;
	interface IntersectEntry extends IntersectionObserverEntry {
		srcElement: Element;
	}
	interface IntersectionObserverOption {
		root: HTMLElement | null;
		rootMargin: string;
		threshold: number[];
	}
	/**
	### DOMController.Main
		Wrapper of querySelector, appendChild,addEventListener...,etc.
	#### Usage
		const p = new DOM('p');
		const fragment = new DOM();
		for(let i=0;i<10;i++) fragment.render(i); 
		p.render(fragment.dom);
		p.at('click',alert('OK'));
	*/
	export class Main {
		private parser: DOMParser = new DOMParser();
		el: NodeType = null;

		constructor(node?: NodeType | string) {
			if (typeof node === 'string' && !/[<>]/.test(node)) {
				this.el = document.querySelector(node);
			} else if (typeof node === 'string' && /[<>]/.test(node)) {
				const collection: NodeList = this.parser.parseFromString(node, 'text/html').body.childNodes;
				const doms: Element[] = [].slice.call(collection);
				if (doms.filter((e) => !(e instanceof Text)).length === 1) {
					this.el = doms[0];
				} else {
					this.el = document.createElement('div');
					const fragment: DocumentFragment = document.createDocumentFragment();
					for (let [ i, l ]: Array<number> = [ 0, doms.length ]; i < l; i++) fragment.appendChild(doms[i]);
					this.el.appendChild(fragment);
				}
			} else if (node instanceof Element || node instanceof DocumentFragment) {
				this.el = node;
			} else {
				this.el = document.createDocumentFragment();
			}
		}
		/**
			Wrapper of append - childNode:(string | Element | HTMLElement | DocumentFragment)
		*/
		append(childNode: NodeType | string): Element | DocumentFragment {
			if (typeof childNode === 'string' && this.el) {
				const fragment = document.createDocumentFragment();
				const collection: NodeList = this.parser.parseFromString(childNode, 'text/html').body.childNodes;
				const doms: Element[] = [].slice.call(collection);
				for (let [ i, l ]: Array<number> = [ 0, doms.length ]; i < l; i++) fragment.appendChild(doms[i]);
				this.el.appendChild(fragment);
			} else if (childNode instanceof Element || childNode instanceof DocumentFragment) {
				this.el.appendChild(childNode);
			} else {
				return this.el;
			}
		}
		/**
			Wrapper of prepend - childNode:(string | Element | HTMLElement | DocumentFragment)
		*/
		prepend(childNode: NodeType | string): Element | DocumentFragment {
			if (typeof childNode === 'string') {
				const fragment = document.createDocumentFragment();
				const collection: NodeList = this.parser.parseFromString(childNode, 'text/html').body.childNodes;
				const doms: Element[] = [].slice.call(collection);
				for (let [ i, l ]: Array<number> = [ 0, doms.length ]; i < l; i++) fragment.appendChild(doms[i]);
				this.el.insertBefore(fragment, this.el.firstChild);
			} else if (childNode instanceof Element || childNode instanceof DocumentFragment) {
				this.el.insertBefore(childNode, this.el.firstChild);
			} else {
				return this.el;
			}
		}
		/**
			innerHTML like method - childNode: (string | Element | HTMLElement | DocumentFragment)
		*/
		rewrite(childNode: NodeType | string): Element | DocumentFragment {
			if (typeof childNode === 'string') {
				const fragment = document.createDocumentFragment();
				const collection: NodeList = this.parser.parseFromString(childNode, 'text/html').body.childNodes;
				const doms: Element[] = [].slice.call(collection);
				for (let [ i, l ]: Array<number> = [ 0, doms.length ]; i < l; i++) fragment.appendChild(doms[i]);
				while (this.el.firstChild) this.el.removeChild(this.el.firstChild);
				this.el.appendChild(fragment);
			} else if (childNode instanceof Element || childNode instanceof DocumentFragment) {
				while (this.el.firstChild) this.el.removeChild(this.el.firstChild);
				this.el.appendChild(childNode);
			} else {
				return this.el;
			}
		}
		/**
		 	Wrapper of document.addEventListener(eventName, callback, false)
		*/
		on(eventName: string, callback: any): void {
			if (this.el !== null) this.el.addEventListener(eventName, callback, false);
			else document.addEventListener(eventName, callback, false);
		}
		/**
		 	Wrapper of document.removeEventListener(eventName, callback, false)
		*/
		off(eventName: string, callback: any): void {
			if (this.el !== null) this.el.removeEventListener(eventName, callback, false);
			else document.removeEventListener(eventName, callback, false);
		}
	}

	export class Extention extends Main {
		constructor(node?: NodeType | string) {
			super(node);
		}
		/**
		 	Use Intersection observer to detect the intersection of an element and a visible region
		*/
		inview(callback: any, options?: IntersectionObserverOption): void {
			options = options || {
				root: null,
				rootMargin: '0%', //If you want to call the callback before the element intersects, set rootMargin to a value more than 0%
				threshold: [ 0.5 ] //Callback is called when intersection area changes by 50%
			};
			const observer = new IntersectionObserver((entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						const ie: IntersectEntry = <IntersectEntry>e;
						ie.srcElement = e.target;
						callback(ie);
					}
				}
			}, options);
			observer.observe(<Element>(<unknown>this.el));
		}
		/**
		 	Use Intersection observer to detect the intersection of an element and a visible region
		*/
		outview(callback: any, options?: IntersectionObserverOption): void {
			options = options || {
				root: null,
				rootMargin: '0%', //If you want to call the callback before the element intersects, set rootMargin to a value more than 0%
				threshold: [ 0.5 ] //Callback is called when intersection area changes by 50%
			};
			const observer = new IntersectionObserver((entries) => {
				for (const e of entries) {
					if (!e.isIntersecting) {
						const ie: IntersectEntry = <IntersectEntry>e;
						ie.srcElement = e.target;
						callback(ie);
					}
				}
			}, options);
			observer.observe(<Element>(<unknown>this.el));
		}
	}
}
export type NodeType = DOMController.NodeType;
export const DOM = DOMController.Main;
export const DOMX = DOMController.Extention;
