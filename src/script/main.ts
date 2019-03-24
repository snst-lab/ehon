import { EventListen } from './eventListener';
import { Render } from './renderer';
import { readSetting } from './setting';

namespace Main {
	class Start{
		constructor(){
			readSetting()
			.then(() => {
				return new Render().start();
			})
			.then(() => {
				new EventListen().start();
			})
			.catch((error) => {
				console.log(error);
			});
		}
	}
	new Start();
}
