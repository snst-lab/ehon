import { config, param, css } from './setting';
import { Canvas, Scene } from './canvas';
import { PalletActive, PalletKeyframe as Keyframe, PalletLayer as Layer, PalletTrigger as Trigger } from './pallet';
import {
	ComponentType as Component,
	ComponentStructure as Struct,
	ComponentState as State,
	ComponentCamera as Camera,
	ComponentImage as Image,
	ComponentText as Text,
	ComponentSound as Sound
} from './component';
import { Animation } from './animation';
import { SoundPlayer } from './soundPlayer';
import { DOMType } from './domController';

export let Active: Component | undefined;

export namespace Editor {
	/**
	 * ### Editor.CSS
	 * define active component style for edit mode
	 */
	export class CSS {
		public static setActiveStyle(c: Component): void {
			if (c.types === 3 /*sound*/) return;
			this.removeActiveStyle(c);
			c.element.style.outlineColor = css.active.outlineColor;
			c.element.style.outlineStyle = css.active.outlineStyle;
			c.element.style.outlineWidth = css.active.outlineWidth;
			if (c.types !== 0 /*not camera*/) {
				c.element.style.resize = css.resize.resize;
				c.element.style.overflow = css.resize.overflow;
				c.element.style.cursor = css.resize.cursor;
			}
			[c.now, ...c.state].forEach((e: State) => {
				e.option =
					`
					${e.option};
					outline-color:${css.active.outlineColor};
					outline-style:${css.active.outlineStyle};
					outline-width:${css.active.outlineWidth};
					resize:${css.resize.resize};
					overflow:${css.resize.overflow};
					cursor:${css.resize.cursor};
					`;
			});
		}
		public static removeActiveStyle(c: Struct): void {
			if (c.types === 3 /**sound */) return;
			c.element.style.outlineColor = '';
			c.element.style.outlineStyle = '';
			c.element.style.outlineWidth = '';
			c.element.style.resize = '';
			c.element.style.overflow = '';
			c.element.style.cursor = '';
			[c.now, ...c.state].forEach((e: State) => {
				e.option = e.option
					.replace(`outline-color:${css.active.outlineColor};`, '')
					.replace(`outline-style:${css.active.outlineStyle};`, '')
					.replace(`outline-width:${css.active.outlineWidth};`, '')
					.replace(`resize:${css.resize.resize};`, '')
					.replace(`overflow:${css.resize.overflow};`, '')
					.replace(`cursor:${css.resize.cursor};`, '');
			});
		}
	}
	/**
	 * ### Editor.Selector
	 * activate & release component in edit mode
	 */
	export class Selector {
		private type: number | null;

		public activate(className: string, type: number): void {
			if (config.live) return;

			this.type = type;
			[...Scene._[Scene.now].Images, ...Scene._[Scene.now].Texts, Scene._[Scene.now].Camera].forEach((e: Component) => {
				if (e.className !== className) {
					CSS.removeActiveStyle(e);
				}
			});
			Active = this.select(className);
			if (Active === undefined) return;
			if ((Active).types === 2 /**text */) {
				(Active).element.contentEditable = 'true';
			}
			new Promise((resolve: (value?: string | PromiseLike<string> | undefined) => void) => {
				Keyframe.render();
				Trigger.render();
				resolve();
			}).then(() => {
				if (Active !== undefined) {
					CSS.setActiveStyle((Active));
				}
			}).catch((e: Error) => console.log(e));
		}

		public release(): void {
			if (Active !== undefined) {
				// component style off
				CSS.removeActiveStyle(Active);
				// penetration
				if (Active.types === 1 /*image*/) {
					Active.element.style.pointerEvents = 'none';
					Active.pointer = 'none';
				}
				if (Active.types === 2 /*text*/) {
					Active.element.style.pointerEvents = 'none';
					Active.pointer = 'none';
					Active.element.contentEditable = 'false';
				}
				// pallet style off
				PalletActive.title.dom.el.textContent = '';
				Keyframe.delay.dom.el.textContent = '';
				Keyframe.iteration.dom.el.textContent = '';

				Active = undefined;
				Keyframe.clear();
				Trigger.hide();
				Trigger.clear();
			}
		}

		public recover(): void {
			[...Scene._[Scene.now].Images, ...Scene._[Scene.now].Texts, Scene._[Scene.now].Camera].forEach((e: Component) => {
				if (e.touchable) {
					e.element.style.pointerEvents = 'auto';
					e.pointer = 'auto';
				}
			});
		}
		public select(className: string): Component | undefined {
			switch (this.type) {
				case 1: // 'image'
					return Scene._[Scene.now].Images.filter((e: Component) => e.className === className)[0];
				case 2: // 'text'
					return Scene._[Scene.now].Texts.filter((e: Component) => e.className === className)[0];
				case 3: // 'sound'
					return Scene._[Scene.now].Sounds.filter((e: Component) => e.className === className)[0];
				case 0: // 'camera'
					return Scene._[Scene.now].Camera;
				default:
					return undefined;
			}
		}
	}
	/**
	 * ### Editor.Selector
	 *  transform each CSS properties such as translate, rotate, blur, etc. in edit mode
	 */
	export class Transform {
		public translate(Active: Component, dx: number, dy: number, dz: number): void {
			if (Active.types !== 3 /*not sound */) {
				const state: State = {
					'src': Active.now.src,
					'x': Active.now.x + dx,
					'y': Active.now.y + dy,
					'z': Active.now.z + ~~dz,
					'width': Active.now.width,
					'aspectRatio': Active.now.aspectRatio,
					'rotate': Active.now.rotate,
					'scale': Active.now.scale,
					'blur': Active.now.blur,
					'opacity': Active.now.opacity,
					'chroma': Active.now.chroma,
					'light': Active.now.light,
					'duration': param.animation.defaultDuration,
					'option': Active.now.option
				};
				Active.transition(state);
				console.log({ 'x': Active.now.x, 'y': Active.now.y, 'z': Active.now.z});
			}
		}

		public rotate(Active: Component, delta: number): void {
			if (Active.types !== 3 /*not sound */) {
				const state: State = {
					'src': Active.now.src,
					'x': Active.now.x,
					'y': Active.now.y,
					'z': Active.now.z,
					'width': Active.now.width,
					'aspectRatio': Active.now.aspectRatio,
					'rotate': Active.now.rotate + ~~delta,
					'scale': Active.now.scale,
					'blur': Active.now.blur,
					'opacity': Active.now.opacity,
					'chroma': Active.now.chroma,
					'light': Active.now.light,
					'duration': param.animation.defaultDuration,
					'option': Active.now.option
				};
				Active.transition(state);
				console.log({ 'rotate': Active.now.rotate});
			}
		}

		public scale(Active: Component, delta: number): void {
			if (Active.types === 1 /*image*/ || Active.types === 2 /*image*/) {
				const state: State = {
					'src': Active.now.src,
					'x': Active.now.x,
					'y': Active.now.y,
					'z': Active.now.z,
					'width': Active.now.width,
					'aspectRatio': Active.now.aspectRatio,
					'rotate': Active.now.rotate,
					'scale': Active.now.scale + delta,
					'blur': Active.now.blur,
					'opacity': Active.now.opacity,
					'chroma': Active.now.chroma,
					'light': Active.now.light,
					'duration': param.animation.defaultDuration,
					'option': Active.now.option
				};
				Active.transition(state);
				console.log({ 'scale': Active.now.scale});
			}
		}

		public blur(Active: Component, delta: number): void {
			if (Active.types === 1 /*image*/ || Active.types === 2 /*image*/) {
				const state: State = {
					'src': Active.now.src,
					'x': Active.now.x,
					'y': Active.now.y,
					'z': Active.now.z,
					'width': Active.now.width,
					'aspectRatio': Active.now.aspectRatio,
					'rotate': Active.now.rotate,
					'scale': Active.now.scale,
					'blur': Math.max(Active.now.blur + delta, 0),
					'opacity': Active.now.opacity,
					'chroma': Active.now.chroma,
					'light': Active.now.light,
					'duration': param.animation.defaultDuration,
					'option': Active.now.option
				};
				Active.transition(state);
				console.log({ 'blur': Active.now.blur});
			}
		}


		public opacity(Active: Component, delta: number): void {
			if (Active.types === 1 /*image*/ || Active.types === 2 /*image*/) {
				const state: State = {
					'src': Active.now.src,
					'x': Active.now.x,
					'y': Active.now.y,
					'z': Active.now.z,
					'width': Active.now.width,
					'aspectRatio': Active.now.aspectRatio,
					'rotate': Active.now.rotate,
					'scale': Active.now.scale,
					'blur': Active.now.blur,
					'opacity': ~~Math.max(Math.min(Active.now.opacity + delta, 100), 0),
					'chroma': Active.now.chroma,
					'light': Active.now.light,
					'duration': param.animation.defaultDuration,
					'option': Active.now.option
				};
				Active.transition(state);
				console.log({ 'opacity': Active.now.opacity});
			}
		}

		public chroma(Active: Component, delta: number): void {
			if (Active.types === 1 /*image*/ || Active.types === 2 /*image*/) {
				const state: State = {
					'src': Active.now.src,
					'x': Active.now.x,
					'y': Active.now.y,
					'z': Active.now.z,
					'width': Active.now.width,
					'aspectRatio': Active.now.aspectRatio,
					'rotate': Active.now.rotate,
					'scale': Active.now.scale,
					'blur': Active.now.blur,
					'opacity': Active.now.opacity,
					'chroma': ~~Math.max(Active.now.chroma + delta, 0),
					'light': Active.now.light,
					'duration': param.animation.defaultDuration,
					'option': Active.now.option
				};
				Active.transition(state);
				console.log({ 'chroma': Active.now.chroma});
			}
		}

		public light(Active: Component, delta: number): void {
			if (Active.types === 1 /*image*/ || Active.types === 2 /*image*/) {
				const state: State = {
					'src': Active.now.src,
					'x': Active.now.x,
					'y': Active.now.y,
					'z': Active.now.z,
					'width': Active.now.width,
					'aspectRatio': Active.now.aspectRatio,
					'rotate': Active.now.rotate,
					'scale': Active.now.scale,
					'blur': Active.now.blur,
					'opacity': Active.now.opacity,
					'chroma': Active.now.chroma,
					'light': ~~Math.max(Active.now.light + delta, 0),
					'duration': param.animation.defaultDuration,
					'option': Active.now.option
				};
				Active.transition(state);
				console.log({ 'light': Active.now.light});
			}
		}
	}
	/**
	 * ### Editor.EventHandler
	 *  event handler for edit mode unique operation
	 */
	export class EventHandler {
		public addNewScene(): void {
			const num: number = Scene._.length;
			const camera0: State = {
				'src': '',
				'x': param.camera.initialX,
				'y': param.camera.initialY,
				'z': param.camera.initialZ,
				'width': 0,
				'aspectRatio': 0,
				'rotate': 0,
				'scale': 0,
				'blur': 0,
				'opacity': 0,
				'chroma': 0,
				'light': 0,
				'duration': param.animation.defaultDuration,
				'option': ''
			};
			const camera: Component = new Camera({
				'scene': num,
				'types': 0, // camera
				'className': 'camera',
				'title': 'Camera',
				'touchable': true,
				'pointer': 'auto',
				'float': true,
				'trigger': [],
				'delay': 0,
				'iteration': 1,
				'state': [camera0],
				'now': camera0,
				'running': false,
				'element': null
			});
			Scene.add(camera, [], [], []);
			Scene.change(num);
			Canvas.dom.append((Scene._[num].dom as DOMType).el as HTMLElement);
		}
		public CanvasDrop(X: number, Y: number, file: File | null): void {
			const x: number = X / (Canvas.element.offsetWidth + Canvas.element.offsetLeft) * 100;
			const y: number = Y / (Canvas.element.offsetHeight + Canvas.element.offsetTop) * 100;
			if (file !== null) {
				if (/.png|.gif|.jpg|jpeg|.PNG|.GIF|.JPG|.JPEG|.svg|.SVG$/.test(file.name)) {
					this.CanvasDropComponent(x, y, 1, file, null);
				} else if (/.wav|.mp3|.ogg$/.test(file.name)) {
					this.CanvasDropComponent(x, y, 3, file, null);
				} else {
					this.CanvasDropComponent(x, y, 2, file, null);
				}
			}
		}
		public CanvasDropComponent(x: number, y: number, types: number, file: File | null, given: Component | null): void {
			let struct: Struct;
			let state0: State;
			let component: Component;
			if (given === null && file !== null) {
				switch (types) {
					case 1: // image
						state0 = {
							'src': (file).name,
							'x':
								(Scene._[Scene.now].Camera.now.z / param.image.initialZ - 1) *
								(x - param.image.defaultSize * 0.5) +
								Scene._[Scene.now].Camera.now.x +
								(2 - Scene._[Scene.now].Camera.now.z / param.image.initialZ) * param.camera.vanishingX,
							'y':
								(Scene._[Scene.now].Camera.now.z / param.image.initialZ - 1) *
								(y - param.image.defaultSize * param.image.aspectRatio * 0.5) +
								Scene._[Scene.now].Camera.now.y +
								(2 - Scene._[Scene.now].Camera.now.z / param.image.initialZ) * param.camera.vanishingY,
							'z': param.image.initialZ,
							'width': param.image.defaultSize,
							'aspectRatio': param.image.aspectRatio,
							'rotate': 0,
							'scale': 1,
							'blur': 0,
							'opacity': 100,
							'chroma': 100,
							'light': 100,
							'duration': param.animation.defaultDuration,
							'option': ''
						};
						break;
					case 2: // text
						state0 = {
							'src': (file).name,
							'x': x,
							'y': y,
							'z': param.text.initialZ,
							'width': param.text.defaultSize,
							'aspectRatio': param.text.aspectRatio,
							'rotate': 0,
							'scale': 1,
							'blur': 0,
							'opacity': 100,
							'chroma': 100,
							'light': 100,
							'duration': param.animation.defaultDuration,
							'option': ''
						};
						break;
					case 3: // sound
						state0 = {
							'src': (file).name,
							'x': 0,
							'y': 0,
							'z': 0,
							'width': 0,
							'aspectRatio': 0,
							'rotate': 0,
							'scale': 0,
							'blur': 0,
							'opacity': 0,
							'chroma': 0,
							'light': 0,
							'duration': param.animation.defaultDuration,
							'option': ''
						};
						break;
					default:
						return;
				}
				struct = {
					'scene': Scene.now,
					'types': types,
					'className': '',
					'title': '',
					'touchable': true,
					'pointer': 'auto',
					'float': types === 1 ? true : false,
					'trigger': [],
					'iteration': 1,
					'delay': 0,
					'state': [state0],
					'now': state0,
					'running': false,
					'element': null
				};

			} else if (given !== null) {
				state0 = {
					'src': given.now.src,
					'x': x,
					'y': y,
					'z': given.now.z,
					'width': given.now.width,
					'aspectRatio': given.now.aspectRatio,
					'rotate': given.now.rotate,
					'scale': given.now.scale,
					'blur': given.now.blur,
					'opacity': given.now.opacity,
					'chroma': given.now.chroma,
					'light': given.now.light,
					'duration': param.animation.defaultDuration,
					'option': given.now.option
				};
				struct = {
					'scene': given.scene,
					'types': types,
					'className': '',
					'title': given.title,
					'touchable': true,
					'pointer': 'auto',
					'float': given.float,
					'trigger': given.trigger,
					'iteration': given.iteration,
					'delay': given.delay,
					'state': [state0],
					'now': state0,
					'running': false,
					'element': null
				};
			}
			// tslint:disable-next-line:prefer-switch
			if (types === 1 /**image*/) {
				component = new Image(struct, Scene._[Scene.now].Camera.now);
				Scene._[Scene.now].Images.push(component);
				(Scene._[Scene.now].dom as HTMLElement).append(component.element);
				EditorSelector.activate(component.className, 1);
			} else if (types === 2 /**text*/) {
				component = new Text(struct, Scene._[Scene.now].Camera.now);
				Scene._[Scene.now].Texts.push(component);
				(Scene._[Scene.now].dom as HTMLElement).append(component.element);
				EditorSelector.activate(component.className, 2);
			} else if (types === 3 /**sound*/) {
				component = new Sound(struct);
				Scene._[Scene.now].Sounds.push(component);
				(Scene._[Scene.now].dom as HTMLElement).append(component.element);
				EditorSelector.activate(component.className, 3);
				new SoundPlayer.Register(Active);
			}
			Keyframe.render();
			Layer.render(EditorSelector);
			Trigger.render();
		}

		public ComponentClick(className: string, type: string): void | undefined {
			switch (type) {
				case 'camera':
					EditorSelector.activate(className, 0);
					break;
				case 'image':
					EditorSelector.activate(className, 1);
					break;
				case 'text':
					EditorSelector.activate(className, 2);
					break;
				default:
					return;
			}
		}

		public CameraClick(className: string): void {
			EditorSelector.recover();
			EditorSelector.activate(className, 0);
		}

		public PushStateClick(): void {
			if (Active === undefined) return;
			if ((Active).types !== 3 /*sound*/) {
				if ((Active).state.length === 1) {
					new Animation.Register((Active));
				}
				(Active).transition((Active).now);
			}
			CSS.removeActiveStyle((Active));
			(Active).state.push((Active).now);
			Keyframe.render();
			CSS.setActiveStyle((Active));
		}

		public ShowLayerClick(): void {
			if (!Layer.opened) {
				Layer.render(EditorSelector);
				Layer.show();
			} else {
				Layer.hide();
			}
		}

		public ShowTriggerClick(): void {
			if (!Trigger.opened) {
				Trigger.show();
			} else {
				Trigger.hide();
			}
		}

		public PlayClick(): void {
			if (Active === undefined) return;
			if ((Active).types !== 3  /*sound*/) {
				new Animation.Play((Active));
			} else {
				if ((Active).running) {
					// (<HTMLAudioElement>Active.element).currentTime = 0.0;
					((Active).element as HTMLAudioElement).pause();
					(Active).running = false;
				} else {
					new SoundPlayer.Play((Active));
				}
			}
		}

		public BaseLayerClick(): void {
			EditorSelector.recover();
		}
	}
}
// tslint:disable-next-line:typedef
export const EditorCSS = Editor.CSS;
// tslint:disable-next-line:typedef
export const EditorSelector = new Editor.Selector();
// tslint:disable-next-line:typedef
export const EditorTransform = new Editor.Transform();
// tslint:disable-next-line:typedef
export const EditorEventHandler = new Editor.EventHandler();
