import { DOMController } from './domController';
import { ImageCollection } from './imageCollection';
import { DragEventListner } from './dragEventListner';
import { ComponentEditor } from './componentEditor';

namespace Main {
	const el = DOMController.Selector;

	new ComponentEditor.EventHandler();
	new DragEventListner.EventHandler();

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
                        <p>その${this.counter}</p>
                    </article>
                `);
				this.counter += 1;
			}
			this.section.render(this.fragment.dom);
			this.section.on('click', (e) => {
				alert(e.srcElement.textContent);
			});
		}
		inifinityScroll() {
			new el<string>('footer').inview(() => {
				setTimeout(() => {
					this.section.append(`
                        <article class='fadein'>
                            <h1>Hello World!</h1>
                            <p>その${this.counter}</p>
                        </article>
                    `);
					this.counter += 1;
				}, 1000);
			});
		}
	}
	new Start();
}
