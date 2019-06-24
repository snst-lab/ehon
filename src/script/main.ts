import { EventListen } from './eventListener';
import { Render } from './renderer';
import { readSetting } from './setting';
import { default as init ,Console } from '../wasm/pkg/wasm.js';

namespace Main {
	interface AttrJS{
		x:number,
		y:number,
		z:number
	}
	class Start{
		constructor(){
			(async()=>{
				await init('./src/wasm/pkg/wasm_bg.wasm');
				await readSetting()
				.then(() => {
					return new Render().start();
				})
				.then(() => {
					new EventListen().start();
				})
				.catch((error) => {
					console.log(error);
				});
			})();
		}
	}
	new Start();
}
