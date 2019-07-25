import { config } from './setting';
import { DOM, DOMX, DOMType, DOMExt } from './domController';
import { ComponentType } from './component';

export namespace Canvas {
	export const className: string = 'canvas';
	export const dom: DOMExt = new DOMX('.' + className);
	export const element: HTMLElement = dom.el as HTMLElement;
	export const z: number = Number(element.style.zIndex);
	export let aspectRatio: number = element.offsetHeight / element.offsetWidth;
	export const paper: HTMLElement = document.querySelector('.paper');
	export const paperSound: HTMLAudioElement = document.querySelector('.paper-sound');
}

export interface CanvasType {
	className: string;
	dom: DOMType;
	element: HTMLElement;
	z: number;
	aspectRatio: number;
	paper: HTMLElement;
	paperSound: HTMLAudioElement;
}

export namespace Frame {
	export const header: HTMLElement = document.querySelector('header');
	export const headerTitle: HTMLElement = document.querySelector('.header-title');
	export const headerPage: HTMLElement = document.querySelector('.header-page');
	export const footer: HTMLElement = document.querySelector('footer');
	export const volume: HTMLElement = document.querySelector('.volume');

	export function show(): void {
		header.style.top = '0';
	}
	export function hide(): void {
		if (!config.live) return;
		(function update(frame: number): void {
			switch (frame) {
				case 120:
					if (!config.live) return;
					header.style.top = '-5vh';
				// tslint:disable-next-line: no-switch-case-fall-through
				default:
					break;
			}
			window.requestAnimationFrame(() => update(frame + 1));
		})(0);
	}

	export function volumeOn(): void {
		config.volumeOn = true;
		volume.textContent = 'volume_up';
	}
	export function volumeOff(): void {
		config.volumeOn = false;
		volume.textContent = 'volume_off';
		for (let i: number = 0; i < Scene._.length; i++) {
			Scene._[i].Sounds.forEach((e: ComponentType) => (e.element as HTMLAudioElement).pause());
		}
	}
}

export namespace Scene {
	export interface Structure {
		className: string;
		// tslint:disable-next-line:no-any
		dom: any;
		Camera: ComponentType;
		Images: ComponentType[];
		Texts: ComponentType[];
		Sounds: ComponentType[];
	}
	export const className: string = 'scene';
	export let now: number = 0;
	export let _: Structure[] = [];

	export function init(): void {
		_.forEach((scene: Structure, i: number) => {
			// tslint:disable-next-line:prefer-conditional-expression
			if (i === 0) ((scene.dom as DOMType).el as HTMLElement).style.display = '';
			else ((scene.dom as DOMType).el as HTMLElement).style.display = 'none';
		});
		now = 0;
		const event: Event = document.createEvent('HTMLEvents');
		event.initEvent('sceneChange', true, false);
		document.dispatchEvent(event);
	}
	export function change(num: number): void {
		if (now < num && num < _.length) {
			[_[now].Camera, ..._[now].Images, ..._[now].Texts].forEach((c: ComponentType) => {
				c.running = false;
			});
			[_[num].Camera, ..._[num].Images, ..._[num].Texts].forEach((c: ComponentType) => {
				c.running = false;
				c.transition(c.state[0]);
			});
			forwardEffect(now, num);
			now = num;

		} else if (now < num && num >= _.length) {
			[_[now].Camera, ..._[now].Images, ..._[now].Texts].forEach((c: ComponentType) => {
				c.running = false;
			});
			[_[0].Camera, ..._[0].Images, ..._[0].Texts].forEach((c: ComponentType) => {
				c.transition(c.state[0]);
			});
			forwardEffect(now, 0);
			now = 0;

		} else if (num >= 0 && num < now) {
			[_[now].Camera, ..._[now].Images, ..._[now].Texts].forEach((c: ComponentType) => {
				c.running = false;
			});
			[_[num].Camera, ..._[num].Images, ..._[num].Texts].forEach((c: ComponentType) => {
				c.transition(c.state[0]);
			});
			backEffect(now, num);
			now = num;

		} else if (num < 0) {
			return;
		}
		// tslint:disable-next-line:no-irregular-whitespace
		Frame.headerPage.textContent = now as unknown as string + '　ページ';
		Frame.show();
		Frame.hide();
	}
	export function add(camera: ComponentType, images: ComponentType[], texts: ComponentType[], sounds: ComponentType[]): void {
		const num: number = _.length;
		_.push({
			'className': className + (num as unknown as string),
			'dom': new DOM(
				`<div class='${className}${num} ${className}'><div class='base-layer' style='z-index:${Canvas.z}' onclick='baseLayerClick(event);'></div></div>`
			),
			'Camera': camera,
			'Images': images,
			'Texts': texts,
			'Sounds': sounds
		});
	}

	export function remove(num: number): void {
		if (_.length === 1) {
			return;
		} else {
			if (num > 0) change(num - 1);
			else change(num + 1);
		}

		((_[num].dom as DOMType).el as HTMLElement).remove();
		_.splice(num, 1);
		_.forEach((scene: Structure, i: number) => {
			if (i >= num) {
				[scene.Camera, ...scene.Images, ...scene.Texts].forEach((e: ComponentType) => (e.scene = e.scene - 1));
				((scene.dom as DOMType).el as HTMLElement).classList.remove('scene' + ((i + 1) as unknown as string));
				((scene.dom as DOMType).el as HTMLElement).classList.add('scene' + (i as unknown as string));
			}
		});
	}

	function forwardEffect(changeFrom: number, changeTo: number): void {
		const now: HTMLElement = (_[changeFrom].dom as DOMType).el as HTMLElement;
		const next: HTMLElement = (_[changeTo].dom as DOMType).el as HTMLElement;
		const nowLeft: HTMLElement = now.cloneNode(true) as HTMLElement;
		const nowRight: HTMLElement = now.cloneNode(true) as HTMLElement;
		const nextLeft: HTMLElement = next.cloneNode(true) as HTMLElement;
		const nextRight: HTMLElement = next.cloneNode(true) as HTMLElement;

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
		if (config.volumeOn) Canvas.paperSound.play().catch((e: Error) => console.log(e));
		now.style.display = 'none';
		next.style.display = 'none';

		(function update(frame: number): void {
			switch (frame) {
				case 10:
					Canvas.paper.style.cssText = `filter:opacity(100%);z-index:${Canvas.z + 1}`;
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
					Canvas.paper.style.cssText = `filter:opacity(0%);z-index:${Canvas.z + 1}`;

					const event: Event = document.createEvent('HTMLEvents');
					event.initEvent('sceneChange', true, false);
					document.dispatchEvent(event);
					return;
				default:
					break;
			}
			window.requestAnimationFrame(() => update(frame + 1));
		})(0);
	}

	function backEffect(changeFrom: number, changeTo: number): void {
		const now: HTMLElement = (_[changeFrom].dom as DOMType).el as HTMLElement;
		const next: HTMLElement = (_[changeTo].dom as DOMType).el as HTMLElement;
		const nowLeft: HTMLElement = now.cloneNode(true) as HTMLElement;
		const nowRight: HTMLElement = now.cloneNode(true) as HTMLElement;
		const nextLeft: HTMLElement = next.cloneNode(true) as HTMLElement;
		const nextRight: HTMLElement = next.cloneNode(true) as HTMLElement;

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
		if (config.volumeOn) Canvas.paperSound.play().catch((e: Error) => console.log(e));
		now.style.display = 'none';
		next.style.display = 'none';

		(function update(frame: number): void {
			switch (frame) {
				case 10:
					Canvas.paper.style.cssText = `filter:opacity(100%);z-index:${Canvas.z - 1}`;
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
					Canvas.paper.style.cssText = `filter:opacity(0%);z-index:${Canvas.z - 1}`;

					const event: Event = document.createEvent('HTMLEvents');
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
