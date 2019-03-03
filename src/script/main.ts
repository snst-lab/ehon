import { DOMController } from './domController';

namespace Main {
	const el = DOMController.Selector;

	class Start {
		private section = new el<string>('section');
		private fragment = new el<DocumentFragment>();
		private counter: number = 1;

		constructor() {
			this.initView();
			this.inifinityScroll();
		}
		initView() {
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
