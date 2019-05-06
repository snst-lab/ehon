import { config } from './setting';
import { DOM, DOMX } from './domController';

export namespace Canvas {
	export const className: string = 'canvas';
	export const dom = new DOMX('.' + className);
	export const element: HTMLElement = <HTMLElement>dom.el;
	export const z: number = Number(element.style.zIndex);
	export let aspectRatio: number = element.offsetHeight / element.offsetWidth;
	export const paper: HTMLElement = <HTMLElement>document.querySelector('.paper');
	export const paperSound: HTMLAudioElement = <HTMLAudioElement>document.querySelector('.paper-sound');
}

export namespace Frame {
	export const header: HTMLElement = <HTMLElement>document.querySelector('header');
	export const headerTitle: HTMLElement = <HTMLElement>document.querySelector('.header-title');
	export const headerPage: HTMLElement = <HTMLElement>document.querySelector('.header-page');
	export const footer: HTMLElement = <HTMLElement>document.querySelector('footer');
	export const volume: HTMLElement = <HTMLElement>document.querySelector('.volume');

	export function show() {
		header.style.top = '0';
	}
	export function hide() {
		if (!config.live) return;
		(function update(frame: number): void {
			switch (frame) {
				case 120:
					if (!config.live) return;
					header.style.top = '-5vh';
					return;
				default:
					break;
			}
			window.requestAnimationFrame(() => update(frame + 1));
		})(0);
	}

	export function volumeOn() {
		config.volumeOn = true;
		volume.textContent = 'volume_up';
	}
	export function volumeOff() {
		config.volumeOn = false;
		volume.textContent = 'volume_off';
	}
}

export namespace Scene {
	export interface Structure {
		className: string;
		dom: any;
		Camera: any;
		Images: Array<any>;
		Texts: Array<any>;
		Sounds: Array<any>;
	}
	export const className: string = 'scene';
	export let now: number = 0;
	export let _: Array<Structure> = [];

	export function init(): void {
		_.forEach((scene, i) => {
			if (i === 0) scene.dom.el.style.display = '';
			else scene.dom.el.style.display = 'none';
		});
		Scene.now = 0;
		const event = document.createEvent('HTMLEvents');
		event.initEvent('sceneChange', true, false);
		document.dispatchEvent(event);
	}
	export function change(num: number): void {
		if (Scene.now < num && num < Scene._.length) {
			[ Scene._[num].Camera, ...Scene._[num].Images, ...Scene._[num].Texts ].forEach((c) => {
				c.transition(c.state[0]);
			});
			forwardEffect(Scene.now, num);
			Scene.now = num;
		} else if (Scene.now < num && num >= Scene._.length) {
			[ Scene._[0].Camera, ...Scene._[0].Images, ...Scene._[0].Texts ].forEach((c) => {
				c.transition(c.state[0]);
			});
			forwardEffect(Scene.now, 0);
			Scene.now = 0;
		} else if (0 <= num && num < Scene.now) {
			[ Scene._[num].Camera, ...Scene._[num].Images, ...Scene._[num].Texts ].forEach((c) => {
				c.transition(c.state[0]);
			});
			backEffect(Scene.now, num);
			Scene.now = num;
		} else if (num < 0) {
			return;
		}
		Frame.headerPage.textContent = Scene.now + '　ページ';
		Frame.show();
		Frame.hide();
	}
	export function add(camera: any, images: any, texts: any, sounds: any): void {
		const num = _.length;
		Scene._.push({
			className: Scene.className + '' + num,
			dom: new DOM(
				`<div class='${Scene.className}${num} ${Scene.className}'><div class='base-layer' style='z-index:${Canvas.z}' onclick='baseLayerClick(event);'></div></div>`
			),
			Camera: camera,
			Images: images,
			Texts: texts,
			Sounds: sounds
		});
	}

	export function remove(num: number): void {
		if (_.length === 1) {
			return;
		} else {
			if (num > 0) change(num - 1);
			else change(num + 1);
		}

		_[num].dom.el.remove();
		_.splice(num, 1);
		_.forEach((scene, i) => {
			if (i >= num) {
				[ scene.Camera, ...scene.Images, ...scene.Texts ].forEach((e) => (e.scene = e.scene - 1));
				scene.dom.el.classList.remove('scene' + (i + 1));
				scene.dom.el.classList.add('scene' + i);
			}
		});
	}

	function forwardEffect(changeFrom: number, changeTo: number) {
		const now: HTMLElement = Scene._[changeFrom].dom.el;
		const next: HTMLElement = Scene._[changeTo].dom.el;
		const nowLeft: HTMLElement = <HTMLElement>now.cloneNode(true);
		const nowRight: HTMLElement = <HTMLElement>now.cloneNode(true);
		const nextLeft: HTMLElement = <HTMLElement>next.cloneNode(true);
		const nextRight: HTMLElement = <HTMLElement>next.cloneNode(true);

		nowLeft.style.cssText = 'backface-visibility:hidden;clip-path: polygon(0 0%, 50% 0, 50% 100%, 0 100%);';
		nowRight.style.cssText =
			'backface-visibility:hidden;clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);border-right:solid 5px rgb(200,200,200);';
		nextLeft.style.cssText =
			'backface-visibility:hidden;clip-path: polygon(0 0%, 50% 0, 50% 100%, 0 100%);transform-origin:50% 50%; transform: perspective(1000px) rotateY(180deg);border-left:solid 5px rgb(200,200,200);';
		nextRight.style.cssText =
			'backface-visibility:hidden;clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);display:none;';

		Canvas.dom.el.appendChild(nextLeft);
		Canvas.dom.el.appendChild(nextRight);
		Canvas.dom.el.appendChild(nowLeft);
		Canvas.dom.el.appendChild(nowRight);
		if (config.volumeOn) Canvas.paperSound.play();
		now.style.display = 'none';
		next.style.display = 'none';

		(function update(frame: number): void {
			switch (frame) {
				case 10:
					Canvas.paper.style.cssText = 'filter:opacity(100%);z-index:' + (Canvas.z + 1);
					nowRight.style.cssText =
						'transition: 0.8s ease;backface-visibility:hidden;clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);transform-origin:0% 50%; transform: perspective(1000px) rotateY(-180deg);border-right: solid 5px rgb(200,200,200);';
					nextLeft.style.cssText =
						'transition: 0.8s ease;backface-visibility:hidden;clip-path: polygon(0 0%, 50% 0, 50% 100%, 0 100%);transform-origin:50% 50%; transform: perspective(1000px) rotateY(0deg);border-left: solid 5px rgb(200,200,200);';
					break;
				case 25:
					nowRight.remove();
					nowLeft.remove();
					nextRight.style.cssText =
						'backface-visibility:hidden;clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);display:block;';
					break;
				case 45:
					nextRight.remove();
					nextLeft.remove();
					next.style.display = 'block';
					Canvas.paper.style.cssText = 'filter:opacity(0%);z-index:' + (Canvas.z - 1);

					const event = document.createEvent('HTMLEvents');
					event.initEvent('sceneChange', true, false);
					document.dispatchEvent(event);
					return;
				default:
					break;
			}
			window.requestAnimationFrame(() => update(frame + 1));
		})(0);
	}

	function backEffect(changeFrom: number, changeTo: number) {
		const now: HTMLElement = Scene._[changeFrom].dom.el;
		const next: HTMLElement = Scene._[changeTo].dom.el;
		const nowLeft: HTMLElement = <HTMLElement>now.cloneNode(true);
		const nowRight: HTMLElement = <HTMLElement>now.cloneNode(true);
		const nextLeft: HTMLElement = <HTMLElement>next.cloneNode(true);
		const nextRight: HTMLElement = <HTMLElement>next.cloneNode(true);

		nowRight.style.cssText = 'backface-visibility:hidden;clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);';
		nowLeft.style.cssText =
			'backface-visibility:hidden;clip-path: polygon(0 0%, 50% 0, 50% 100%, 0 100%);border-left: solid 5px rgb(200,200,200);';
		nextLeft.style.cssText =
			'backface-visibility:hidden;clip-path: polygon(0 0%, 50% 0, 50% 100%, 0 100%);display:none;';
		nextRight.style.cssText =
			'backface-visibility:hidden;clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);transform-origin:50% 50%; transform: perspective(1000px) rotateY(-180deg);border-right:solid 5px rgb(200,200,200);';
		Canvas.dom.el.appendChild(nextLeft);
		Canvas.dom.el.appendChild(nextRight);
		Canvas.dom.el.appendChild(nowLeft);
		Canvas.dom.el.appendChild(nowRight);
		if (config.volumeOn) Canvas.paperSound.play();
		now.style.display = 'none';
		next.style.display = 'none';

		(function update(frame: number): void {
			switch (frame) {
				case 10:
					Canvas.paper.style.cssText = 'filter:opacity(100%);z-index:' + (Canvas.z + 1);
					nowLeft.style.cssText =
						'transition: 0.8s ease;backface-visibility:hidden;clip-path: polygon(0 0%, 50% 0, 50% 100%, 0 100%);transform-origin:0% 50%; transform: perspective(1000px) rotateY(180deg);border-left: solid 5px rgb(200,200,200);';
					nextRight.style.cssText =
						'transition: 0.8s ease;backface-visibility:hidden;clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);transform-origin:50% 50%; transform: perspective(1000px) rotateY(0deg);border-right: solid 5px rgb(200,200,200);';
					break;
				case 25:
					nowRight.remove();
					nowLeft.remove();
					nextLeft.style.cssText =
						'backface-visibility:hidden;clip-path: polygon(0 0%, 50% 0, 50% 100%, 0 100%);display:block;';
					break;
				case 45:
					nextRight.remove();
					nextLeft.remove();
					next.style.display = 'block';
					Canvas.paper.style.cssText = 'filter:opacity(0%);z-index:' + (Canvas.z - 1);

					const event = document.createEvent('HTMLEvents');
					event.initEvent('sceneChange', true, false);
					document.dispatchEvent(event);
					return;
				default:
					break;
			}
			window.requestAnimationFrame(() => update(frame + 1));
		})(0);
	}
}
