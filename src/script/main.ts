import { EventListenerStart } from './eventListener';
import { RendererStart } from './renderer';

namespace Main {
	new RendererStart();
	new EventListenerStart();

	class Start {
		constructor() {	}
	}
	new Start();
}
