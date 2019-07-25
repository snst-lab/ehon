/**
### DOMController
	Substitute of querySelector, appendChild, prependChild, addEventListener...,etc.
*/
namespace DOMController {
	export type NodeType = Element | HTMLElement | DocumentFragment;
	export type DOMMain = Main;
	export type DOMExt = Extention;
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
		Substitute of querySelector, appendChild,addEventListener...,etc.
	#### Usage
		const p = new DOM('p');
		const fragment = new DOM();
		for(let i=0;i<10;i++) fragment.render(i);
		p.render(fragment.dom);
		p.at('click',alert('OK'));
	*/
	export class Main {
		private parser: DOMParser = new DOMParser();
		public el: NodeType;

		constructor(node?: NodeType | string) {
			if (typeof node === 'string' && !/[<>]/.test(node)) {
				this.el = document.querySelector(node) as NodeType;
			} else if (typeof node === 'string' && /[<>]/.test(node)) {
				const collection: NodeList = this.parser.parseFromString(node, 'text/html').body.childNodes;
				const doms: Element[] = [].slice.call(collection) as Element[];
				if (doms.filter((e: Element) => !(e instanceof Text)).length === 1) {
					this.el = doms[0];
				} else {
					this.el = document.createElement('div');
					const fragment: DocumentFragment = document.createDocumentFragment();
					for (let [i, l]: number[] = [0, doms.length]; i < l; i++) fragment.appendChild(doms[i]);
					this.el.appendChild(fragment);
				}
			} else if (node instanceof Element || node instanceof DocumentFragment) {
				this.el = node;
			} else {
				this.el = document.createDocumentFragment();
			}
		}
		/**
			Substitute of append - childNode:(string | Element | HTMLElement | DocumentFragment)
		*/
		public append(childNode: NodeType | string): Element | DocumentFragment | boolean {
			if (typeof childNode === 'string' && this.el) {
				const fragment: DocumentFragment = document.createDocumentFragment();
				const collection: NodeList = this.parser.parseFromString(childNode, 'text/html').body.childNodes;
				const doms: Element[] = [].slice.call(collection) as Element[];
				for (let [i, l]: number[] = [0, doms.length]; i < l; i++) fragment.appendChild(doms[i]);
				this.el.appendChild(fragment);
				return false;
			} else if (childNode instanceof Element || childNode instanceof DocumentFragment) {
				this.el.appendChild(childNode);
				return false;
			} else {
				return this.el;
			}
		}
		/**
			Substitute of prepend - childNode:(string | Element | HTMLElement | DocumentFragment)
		*/
		public prepend(childNode: NodeType | string): Element | DocumentFragment | boolean {
			if (typeof childNode === 'string') {
				const fragment: DocumentFragment = document.createDocumentFragment();
				const collection: NodeList = this.parser.parseFromString(childNode, 'text/html').body.childNodes;
				const doms: Element[] = [].slice.call(collection) as Element[];
				for (let [i, l]: number[] = [0, doms.length]; i < l; i++) fragment.appendChild(doms[i]);
				this.el.insertBefore(fragment, this.el.firstChild);
				return false;
			} else if (childNode instanceof Element || childNode instanceof DocumentFragment) {
				this.el.insertBefore(childNode, this.el.firstChild);
				return false;
			} else {
				return this.el;
			}
		}
		/**
			innerHTML like method - childNode: (string | Element | HTMLElement | DocumentFragment)
		*/
		public rewrite(childNode: NodeType | string): Element | DocumentFragment | boolean {
			if (typeof childNode === 'string') {
				const fragment: DocumentFragment = document.createDocumentFragment();
				const collection: NodeList = this.parser.parseFromString(childNode, 'text/html').body.childNodes;
				const doms: Element[] = [].slice.call(collection) as Element[];
				for (let [i, l]: number[] = [0, doms.length]; i < l; i++) fragment.appendChild(doms[i]);
				while (this.el.firstChild) this.el.removeChild(this.el.firstChild);
				this.el.appendChild(fragment);
				return false;
			} else if (childNode instanceof Element || childNode instanceof DocumentFragment) {
				while (this.el.firstChild) this.el.removeChild(this.el.firstChild);
				this.el.appendChild(childNode);
				return false;
			} else {
				return this.el;
			}
		}
		/**
		 	Substitute of document.addEventListener(eventName, callback, false)
		*/
		public on(eventName: string, callback: (e?: Event) => void | boolean): void {
			this.el.addEventListener(eventName, callback, false);
		}
		/**
		 	Substitute of document.removeEventListener(eventName, callback, false)
		*/
		public off(eventName: string, callback: (e?: Event) => void | boolean): void {
			this.el.removeEventListener(eventName, callback, false);
		}
	}
	/**
	### DOMController.Extention
		Register swipe, inview, etc event to HTMLElements.
	#### Usage
		const p = new DOM('p');
		p.swipe('top',alert('OK'),10);
		p.inview(alert('OK'));

	*/
	export class Extention extends Main {
		constructor(node?: NodeType | string) {
			super(node);
		}
		/**
		 * Touch Event Listner for Touch Devices
		 * @param sensitivity : callback when swipe length is less than screensize x 1/sensitivity
		 */
		public touch(callback: (e?: Event) => void | boolean, sensitivity?: number): void {
			const coefficient: number = typeof sensitivity !== 'undefined' ? 1 / sensitivity : 0.05;
			this.el.addEventListener(
				'touchstart',
				(event: TouchEvent) => {
					if (event.cancelable) event.preventDefault();
					this.el.removeEventListener('touchstart', () => undefined, false);
					let x: number = event.changedTouches[0].pageX;
					let y: number = event.changedTouches[0].pageY;
					this.el.addEventListener('touchend', (event: TouchEvent) => {
						this.el.removeEventListener('touchend', () => undefined, false);
						if (
							event.changedTouches[0].pageX > x - window.screen.width * coefficient &&
							event.changedTouches[0].pageX < x + window.screen.width * coefficient &&
							event.changedTouches[0].pageY > y - window.screen.height * coefficient &&
							event.changedTouches[0].pageY < y + window.screen.height * coefficient
						) {
							callback(event);
						}
						x = 0;
						y = 0;
					});
				},
				false
			);
		}
		/**
		 * Swipe Event Listner for Touch Devices
		 * @param direction :  specify the direction by string [left , right , top , bottom]
		 * @param sensitivity : callback when swipe length is more than screensize x 1/sensitivity
		 */
		public swipe(direction: string, callback: (e?: Event) => void | boolean, sensitivity?: number): void {
			const coefficient: number = typeof sensitivity !== 'undefined' ? 1 / sensitivity : 0.1;
			switch (direction) {
				case 'left':
					this.el.addEventListener(
						'touchstart',
						(event: TouchEvent) => {
							if (event.cancelable) event.preventDefault();
							this.el.removeEventListener('touchstart', () => null, false);
							let position: number = event.changedTouches[0].pageX;
							this.el.addEventListener('touchend', (event: TouchEvent) => {
								this.el.removeEventListener('touchend', () => null, false);
								if (event.changedTouches[0].pageX < position - window.screen.width * coefficient) {
									callback(event);
								}
								position = 0;
							});
						},
						false
					);
					break;
				case 'right':
					this.el.addEventListener(
						'touchstart',
						(event: TouchEvent) => {
							this.el.removeEventListener('touchstart', () => null, false);
							if (event.cancelable) event.preventDefault();
							let position: number = event.changedTouches[0].pageX;
							this.el.addEventListener('touchend', (event: TouchEvent) => {
								this.el.removeEventListener('touchend', () => null, false);
								if (event.changedTouches[0].pageX > position + window.screen.width * coefficient) {
									callback(event);
								}
								position = window.screen.width;
							});
						},
						false
					);
					break;
				case 'up':
					this.el.addEventListener(
						'touchstart',
						(event: TouchEvent) => {
							if (event.cancelable) event.preventDefault();
							this.el.removeEventListener('touchstart', () => null, false);
							let position: number = event.changedTouches[0].pageY;
							this.el.addEventListener('touchend', (event: TouchEvent) => {
								this.el.removeEventListener('touchend', () => null, false);
								if (event.changedTouches[0].pageY < position - window.screen.height * coefficient) {
									callback(event);
								}
								position = 0;
							});
						},
						false
					);
					break;
				case 'down':
					this.el.addEventListener(
						'touchstart',
						(event: TouchEvent) => {
							if (event.cancelable) event.preventDefault();
							this.el.removeEventListener('touchstart', () => null, false);
							let position: number = event.changedTouches[0].pageY;
							this.el.addEventListener('touchend', (event: TouchEvent) => {
								this.el.removeEventListener('touchend', () => null, false);
								if (event.changedTouches[0].pageY > position + window.screen.height * coefficient) {
									callback(event);
								}
								position = window.screen.height;
							});
						},
						false
					);
					break;
				default:
					return;
			}
		}
		/**
		 	Use Intersection observer to detect the intersection of an element and a visible region
		*/
		public inview(callback: (i?: IntersectEntry) => void | boolean, options?: IntersectionObserverOption): void {
			options = options || {
				'root': null,
				'rootMargin': '0%', // If you want to call the callback before the element intersects, set rootMargin to a value more than 0%
				'threshold': [0.5] // Callback is called when intersection area changes by 50%
			} as IntersectionObserverOption;
			const observer: IntersectionObserver = new IntersectionObserver((entries: IntersectEntry[]) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						const ie: IntersectEntry = e;
						ie.srcElement = e.target;
						callback(ie);
					}
				}
			}, options);
			observer.observe(this.el as unknown as Element);
		}
		/**
		 	Use Intersection observer to detect the intersection of an element and a visible region
		*/
		public outview(callback: (i?: IntersectEntry) => void | boolean, options?: IntersectionObserverOption): void {
			options = options || {
				'root': null,
				'rootMargin': '0%', // If you want to call the callback before the element intersects, set rootMargin to a value more than 0%
				'threshold': [0.5] // Callback is called when intersection area changes by 50%
			};
			const observer: IntersectionObserver = new IntersectionObserver((entries: IntersectEntry[]) => {
				for (const e of entries) {
					if (!e.isIntersecting) {
						const ie: IntersectEntry = e;
						ie.srcElement = e.target;
						callback(ie);
					}
				}
			}, options);
			observer.observe(this.el as unknown as Element);
		}
	}
}
export type NodeType = DOMController.NodeType;
export type DOMType = DOMController.DOMMain;
export type DOMExt = DOMController.DOMExt;
// tslint:disable-next-line:typedef
export const DOM = DOMController.Main;
// tslint:disable-next-line:typedef
export const DOMX = DOMController.Extention;

