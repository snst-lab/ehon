import { DOMController } from './domController';
import { EventListener } from './eventListener';

namespace Main {
	const el = DOMController.Elem;

	new EventListener.Start();

	class Start {
		constructor() {	}
	}
	new Start();
}
