/**
### DOMController
	Wrapper of querySelector, appendChild, innerHTML,addEventListener...,etc.
*/
export namespace DOMController {
	type DOM = Element | HTMLElement | DocumentFragment | null;
	type RenderChild = string | Element | HTMLElement | DocumentFragment | null;

	interface IntersectEntry extends IntersectionObserverEntry {
		srcElement: Element;
	}
	interface IntersectionObserverOption {
		root: HTMLElement | null;
		rootMargin: string;
		threshold: number[];
	}
	interface _Selector {
		dom: DOM;
		render: (childStr: RenderChild) => DOM;
		append: (childStr: RenderChild, rewrite?: boolean) => DOM;
		prepend: (childStr: RenderChild, rewrite?: boolean) => DOM;
		on: (eventName: string, callback: any) => void;
		inview: (callback: any, options?: IntersectionObserverOption) => void;
		outview: (callback: any, options?: IntersectionObserverOption) => void;
	}
	/**
	### DOMController.Selector
		Wrapper of querySelector, appendChild, innerHTML,addEventListener...,etc.
	#### Usage
		const p = new DOMController.Selector<string>('p');
		const fragment = new DOMController.Selector<DocumentFragment>();
		for(let i=0;i<10;i++) fragment.render(i); 
		p.render(fragment.dom);
		p.at('click',alert('OK'));
	*/
	export class Selector<T> implements _Selector {
		private parser: DOMParser = new DOMParser();
		dom: DOM = null;
		
		constructor(el?: T) {
			if (typeof el === 'string') {
				this.dom = document.querySelector(el);
			} else {
				this.dom = document.createDocumentFragment();
			}
		}
		/**
			Wrapper of innerHTML = (string | HTMLElement | DocumentFragment)
		*/
		render(childStr: RenderChild):DOM{
			return this.append(childStr,true);
		}
		/**
			Wrapper of appendChild(string | HTMLElement | DocumentFragment)
		*/
		append(childStr: RenderChild, rewrite?: boolean): DOM {
			if (typeof childStr === 'undefined') return this.dom;

			if (rewrite && this.dom instanceof HTMLElement) {
				this.dom.removeChild(this.dom.firstChild);
				this.dom.appendChild(<Node>childStr);
				return this.dom;
			}

			if (typeof childStr === 'string') {
				const fragment = document.createDocumentFragment();
				const collection: NodeList = this.parser.parseFromString(childStr, 'text/html').body.childNodes;
				const doms: DOM[] = [].slice.call(collection);
				for (let i: number = 0; i < doms.length; i++) fragment.appendChild(doms[i]);
				if (rewrite) this.dom = fragment;
				else this.dom.appendChild(fragment);
			} else {
				if (rewrite) this.dom = childStr;
				else this.dom.appendChild(childStr);
			}
			return this.dom;
		}
		/**
			Wrapper of appendChild(string | Element | DocumentFragment)
		*/
		prepend(childStr: RenderChild, rewrite?: boolean): DOM {
			if (typeof childStr === 'undefined') return this.dom;

			if (rewrite && this.dom instanceof Element) {
				this.dom.removeChild(this.dom.firstChild);
				this.dom.appendChild(<Node>childStr);
				return this.dom;
			}

			if (typeof childStr === 'string') {
				const fragment = document.createDocumentFragment();
				const collection: NodeList = this.parser.parseFromString(childStr, 'text/html').body.childNodes;
				const doms: DOM[] = [].slice.call(collection);
				for (let i: number = 0; i < doms.length; i++) fragment.insertBefore(doms[i], fragment.firstChild);
				if (rewrite) this.dom = fragment;
				else this.dom.insertBefore(fragment, this.dom.firstChild);
			} else {
				if (rewrite) this.dom = childStr;
				else this.dom.insertBefore(childStr, this.dom.firstChild);
			}
			return this.dom;
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
			if (this.dom !== null){
				this.dom.removeEventListener(eventName, callback, false);
			}
			else document.removeEventListener(eventName, callback, false);
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
			observer.observe(<Element>this.dom);
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
			observer.observe(<Element>this.dom);
		}
	}
}
