import { param, config } from './parameter';
import { DOMController } from './domController';
import { Component } from './component';

export namespace ToolPallet {
    const el = DOMController.Elem;
    const outlineStyle: string = `outline:${config.activeOutlineWidth} ${config.activeOutlineStyle} ${config.activeOutlineColor};`;

	export class pushState {
		static ClassName: string = 'state-push';
		static DOM: DOMController.Elem = new el('.' + pushState.ClassName);
    }

	export class stateList {
		static ClassName: string = 'state-list';
		static DOM: DOMController.Elem = new el('.' + stateList.ClassName);

		static render(Active: Component.Type) {
            document.querySelector('.state-classname').textContent = Active.className;
            stateList.DOM.rewrite('');
            const fragment = new el();
			for (let i = 0; i < Active.state.length; i++) {
                fragment.append(`
                    <div class='state'>
                        <div class='state-text'>
                            <div class='state-number number${i}'>State: ${i}</div>
                            <div class='state-src src${i}'>${Active.state[i].src}</div>
                        </div>
                        <div class='state-btn'>
                            <i class='state-update material-icons update${i}' state='${i}'>refresh</i>
                            <i class='state-remove material-icons remove${i}' state='${i}'>delete</i>
                        </div>
                    </div>
                `);
			}
            stateList.DOM.append(fragment.dom);
			stateList.addEventListner(Active);
        }

        static clear(){
            stateList.DOM.rewrite('');
        }

        static addEventListner(Active:Component.Type){
			for (let i = 0; i < Active.state.length; i++) {
				document.querySelector('.number' + i).addEventListener(
					'click',
					(event: any) => {
						event.preventDefault();
						Active.now = Active.state[i];
						Active.change(Active.now, outlineStyle);
					},
					false
                );
                document.querySelector('.update' + i).addEventListener(
					'click',
					(event: any) => {
                        event.preventDefault();
                        Active.state[i] = Active.now;
                        stateList.render(Active);
					},
					false
                );
                document.querySelector('.remove' + i).addEventListener(
					'click',
					(event: any) => {
                        event.preventDefault();
                        Active.state.splice(i,1);
                        stateList.render(Active);
					},
					false
                );
            }
        }

	}

	export class state {
		static ClassName: string = 'state';
		static DOM: DOMController.Elem = new el('.' + stateList.ClassName);
	}
}
