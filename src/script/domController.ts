/**
### DOMController
	Wrapper of querySelector, appendChild, prependChild, addEventListener...,etc.
*/
export namespace DOMController {
	type ChildNode = string | Element | DocumentFragment | null;

	interface IntersectEntry extends IntersectionObserverEntry {
		srcElement: Element;
	}
	interface IntersectionObserverOption {
		root: HTMLElement | null;
		rootMargin: string;
		threshold: number[];
	}
	/**
	### DOMController.Elem
		Wrapper of querySelector, appendChild, innerHTML,addEventListener...,etc.
	#### Usage
		const p = new DOMController.Elem('p');
		const fragment = new DOMController.Elem();
		for(let i=0;i<10;i++) fragment.render(i); 
		p.render(fragment.dom);
		p.at('click',alert('OK'));
	*/
	export class Elem {
		private parser: DOMParser = new DOMParser();
		dom: Element | DocumentFragment | null = null;

		constructor(node?: string | Element | DocumentFragment | undefined) {
			if (typeof node === 'string' && !node.match(/[<>]/)) {
				this.dom = document.querySelector(node);
			} else if (typeof node === 'string' && node.match(/[<>]/)) {
				this.dom = document.createDocumentFragment();
				const collection: NodeList = this.parser.parseFromString(node, 'text/html').body.childNodes;
				const doms: Element[] = [].slice.call(collection);
				for (let i: number = 0; i < doms.length; i++) this.dom.appendChild(doms[i]);
			} else if (node instanceof Element || node instanceof DocumentFragment) {
				this.dom = node;
			} else {
				this.dom = document.createDocumentFragment();
			}
		}
		/**
			Wrapper of append - childNode:(string | HTMLElement | DocumentFragment)
		*/
		append(childNode: ChildNode): Element | DocumentFragment {
			if (typeof childNode === 'string') {
				const fragment = document.createDocumentFragment();
				const collection: NodeList = this.parser.parseFromString(childNode, 'text/html').body.childNodes;
				const doms: Element[] = [].slice.call(collection);
				for (let i: number = 0; i < doms.length; i++) fragment.appendChild(doms[i]);
				this.dom.appendChild(fragment);
			} else if (childNode instanceof Element || childNode instanceof DocumentFragment) {
				this.dom.appendChild(childNode);
			} else {
				return this.dom;
			}
		}
		/**
			Wrapper of prepend - childNode:(string | HTMLElement | DocumentFragment)
		*/
		prepend(childNode: ChildNode): Element | DocumentFragment {
			if (typeof childNode === 'string') {
				const fragment = document.createDocumentFragment();
				const collection: NodeList = this.parser.parseFromString(childNode, 'text/html').body.childNodes;
				const doms: Element[] = [].slice.call(collection);
				for (let i: number = 0; i < doms.length; i++) fragment.appendChild(doms[i]);
				this.dom.insertBefore(fragment, this.dom.firstChild);
			} else if (childNode instanceof Element || childNode instanceof DocumentFragment) {
				this.dom.insertBefore(childNode, this.dom.firstChild);
			} else {
				return this.dom;
			}
		}
		/**
			innerHTML like method - childNode: (string | HTMLElement | DocumentFragment)
		*/
		rewrite(childNode: ChildNode): Element | DocumentFragment {
			if (typeof childNode === 'string') {
				const fragment = document.createDocumentFragment();
				const collection: NodeList = this.parser.parseFromString(childNode, 'text/html').body.childNodes;
				const doms: Element[] = [].slice.call(collection);
				for (let i: number = 0; i < doms.length; i++) fragment.appendChild(doms[i]);
				while(this.dom.firstChild) this.dom.removeChild(this.dom.firstChild);
				this.dom.appendChild(fragment);
			} else if (childNode instanceof Element || childNode instanceof DocumentFragment) {
				while(this.dom.firstChild) 	this.dom.removeChild(this.dom.firstChild);
				this.dom.appendChild(childNode);
			} else {
				return this.dom;
			}
		}
		/**
		 	Wrapper of document.addEventListener(eventName, callback, false)
		*/
		on(eventName: string, callback: any): void {
			if (this.dom !== null)
				switch (eventName) {
					case 'inview':
						this.inview(callback);
						break;
					case 'outview':
						this.outview(callback);
						break;
					default:
						this.dom.addEventListener(eventName, callback, false);
						break;
				}
			else document.addEventListener(eventName, callback, false);
		}
		/**
		 	Wrapper of document.removeEventListener(eventName, callback, false)
		*/
		off(eventName: string, callback: any): void {
			if (this.dom !== null) {
				this.dom.removeEventListener(eventName, callback, false);
			} else document.removeEventListener(eventName, callback, false);
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
			observer.observe(<Element>(<unknown>this.dom));
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
			observer.observe(<Element>(<unknown>this.dom));
		}
	}
}
