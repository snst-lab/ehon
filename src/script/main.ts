import { DOMController } from './domController';
import { ComponentManager } from './componentManager';
import { DragEventListner } from './dragEventListner';
import { ComponentEditor } from './componentEditor';
import { Canvas } from './canvas';

namespace Main {
	const el = DOMController.Elem;

	new ComponentEditor.EventHandler();
	new DragEventListner.EventHandler();

	class Start {
		private section = new el('section');
		private canvas = new el('.canvas');
		private pse = new el('<div>TEST</div>');
		private fragment = new el();
		private counter: number = 1;

		constructor() {
			this.init();
			this.inifinityScroll();
			this.canvas.render(this.pse.dom);
		}
		init() {
			for (let i = 1; i <= 3; i++) {
				this.fragment.render(`
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
			new el('footer').inview(() => {
				setTimeout(() => {
					this.section.render(`
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
