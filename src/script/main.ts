// import '@babel/polyfill';
import { EventListener } from './eventListener';
import { Renderer } from './renderer';
import { readSetting } from './setting';
import { default as init } from '../wasm/pkg/wasm.js';

(async() => {
	await init('./src/wasm/pkg/wasm_bg.wasm');
	await readSetting()
		.then(async() => {
			await new Renderer.Main().start().catch((error: Error) => console.log(error));
		}).then(async() => {
			await new EventListener.Main().start().catch((error: Error) => console.log(error));
		})
		.catch((error: Error) => {
			console.log(error);
		});
})().catch((error: Error) => console.log(error));

