import { DOMController } from './domController';
import { ImageCollection } from './imageCollection';
import { DragEventListner } from './dragEventListner';

namespace Main {
	const el = DOMController.Selector;

	Object.defineProperty(window, 'onDrop', {
		value: function(event) {
			new DragEventListner.onDrop(event);
		}
	});
	Object.defineProperty(window, 'onDragStart', {
		value: function(event) {
			new DragEventListner.onDragStart(event);
		}
	});
	Object.defineProperty(window, 'onDragEnd', {
		value: function(event) {
			new DragEventListner.onDragEnd(event);
		}
	});
	
	class Start {
		private section = new el<string>('section');
		private fragment = new el<DocumentFragment>();
		private counter: number = 1;

		constructor() {
			this.init();
			this.inifinityScroll();
		}
		init() {
			for (let i = 1; i <= 3; i++) {
				this.fragment.append(`
                    <article>
                        <h1>Hello World!</h1>
                        <p>����${this.counter}</p>
                    </article>
                `);
				this.counter += 1;
			}
			this.section.render(this.fragment.dom);
			this.section.at('click', (e) => {
				alert(e.srcElement.textContent);
			});
		}
		inifinityScroll() {
			new el<string>('footer').inview(() => {
				setTimeout(() => {
					this.section.append(`
                        <article class='fadein'>
                            <h1>Hello World!</h1>
                            <p>����${this.counter}</p>
                        </article>
                    `);
					this.counter += 1;
				}, 1000);
			});
		}
	}
	new Start();
}
