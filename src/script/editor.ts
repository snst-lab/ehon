import { config,param, css } from './setting';
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

export let Active: Component = null;

export namespace Editor {
	export class CSS {
		static setActiveStyle(c: Component): void {
			if (c.type === 'sound') return;
			this.removeActiveStyle(c);
			c.element.style.outlineColor = css.active.outlineColor;
			c.element.style.outlineStyle = css.active.outlineStyle;
			c.element.style.outlineWidth = css.active.outlineWidth;
			if (c.type !== 'camera') {
				c.element.style.resize = css.resize.resize;
				c.element.style.overflow = css.resize.overflow;
				c.element.style.cursor = css.resize.cursor;
			}
			[ c.now, ...c.state ].forEach((e) => {
				e.option =
					e.option +
					'outline-color:' +
					css.active.outlineColor +
					';' +
					'outline-style:' +
					css.active.outlineStyle +
					';' +
					'outline-width:' +
					css.active.outlineWidth +
					';' +
					'resize:' +
					css.resize.resize +
					';' +
					'overflow:' +
					css.resize.overflow +
					';' +
					'cursor:' +
					css.resize.cursor +
					';';
			});
		}
		static removeActiveStyle(c: Component): void {
			if (c.type === 'sound') return;
			c.element.style.outlineColor = '';
			c.element.style.outlineStyle = '';
			c.element.style.outlineWidth = '';
			c.element.style.resize = '';
			c.element.style.overflow = '';
			c.element.style.cursor = '';
			[ c.now, ...c.state ].forEach((e) => {
				e.option = e.option
					.replace('outline-color:' + css.active.outlineColor + ';', '')
					.replace('outline-style:' + css.active.outlineStyle + ';', '')
					.replace('outline-width:' + css.active.outlineWidth + ';', '')
					.replace('resize:' + css.resize.resize + ';', '')
					.replace('overflow:' + css.resize.overflow + ';', '')
					.replace('cursor:' + css.resize.cursor + ';', '');
			});
		}
	}

	export class Selector {
		private type: string | null;

		activate(className: string, type: string): void {
			if (config.live) return;

			this.type = type;
			[ ...Scene._[Scene.now].Images, ...Scene._[Scene.now].Texts, Scene._[Scene.now].Camera ].forEach((e) => {
				if (e.className !== className) {
					CSS.removeActiveStyle(e);
				}
			});
			Active = this.select(className);
			if (Active.type === 'text') {
				Active.element.contentEditable = 'true';
			}
			new Promise((resolve) => {
				Keyframe.render();
				Trigger.render();
				resolve();
			}).then(() => {
				CSS.setActiveStyle(Active);
			});
		}
		release(): void {
			if (Active !== null) {
				//component style off
				CSS.removeActiveStyle(Active);
				//penetration
				if (Active.type === 'image') {
					Active.element.style.pointerEvents = 'none';
					Active.pointer = 'none';
				}
				if (Active.type === 'text') {
					Active.element.style.pointerEvents = 'none';
					Active.pointer = 'none';
					Active.element.contentEditable = 'false';
				}
				//pallet style off
				PalletActive.title.dom.el.textContent = '';
				Keyframe.delay.dom.el.textContent = '';
				Keyframe.iteration.dom.el.textContent = '';

				Active = null;
				Keyframe.clear();
				Trigger.hide();
				Trigger.clear();
			}
		}
		recover(): void {
			[ ...Scene._[Scene.now].Images, ...Scene._[Scene.now].Texts, Scene._[Scene.now].Camera ].forEach((e) => {
				if (e.touchable) {
					e.element.style.pointerEvents = 'auto';
					e.pointer = 'auto';
				}
			});
		}
		select(className: string): Component {
			switch (this.type) {
				case 'image':
					return Scene._[Scene.now].Images.filter((e) => e.className === className)[0];
				case 'text':
					return Scene._[Scene.now].Texts.filter((e) => e.className === className)[0];
				case 'sound':
					return Scene._[Scene.now].Sounds.filter((e) => e.className === className)[0];
				case 'camera':
					return Scene._[Scene.now].Camera;
			}
		}
	}

	export class Transform {
		translate(Active: Component, dx: number, dy: number, dz: number): void {
			if (Active.type !== 'sound') {
				const state: State = {
					src: Active.now.src,
					x: Active.now.x + dx,
					y: Active.now.y + dy,
					z: Active.now.z + ~~dz,
					width: Active.now.width,
					aspectRatio: Active.now.aspectRatio,
					rotate: Active.now.rotate,
					scale: Active.now.scale,
					blur: Active.now.blur,
					opacity: Active.now.opacity,
					chroma: Active.now.chroma,
					light: Active.now.light,
					duration: param.animation.defaultDuration,
					option: Active.now.option
				};
				Active.transition(state);
			}
		}

		rotate(Active: Component, delta: number): void {
			if (Active.type !== 'sound') {
				const state: State = {
					src: Active.now.src,
					x: Active.now.x,
					y: Active.now.y,
					z: Active.now.z,
					width: Active.now.width,
					aspectRatio: Active.now.aspectRatio,
					rotate: Active.now.rotate + ~~delta,
					scale: Active.now.scale,
					blur: Active.now.blur,
					opacity: Active.now.opacity,
					chroma: Active.now.chroma,
					light: Active.now.light,
					duration: param.animation.defaultDuration,
					option: Active.now.option
				};
				Active.transition(state);
			}
		}

		scale(Active: Component, delta: number): void {
			if (Active.type === 'image' || Active.type === 'text') {
				const state: State = {
					src: Active.now.src,
					x: Active.now.x,
					y: Active.now.y,
					z: Active.now.z,
					width: Active.now.width,
					aspectRatio: Active.now.aspectRatio,
					rotate: Active.now.rotate,
					scale: Active.now.scale + delta,
					blur: Active.now.blur,
					opacity: Active.now.opacity,
					chroma: Active.now.chroma,
					light: Active.now.light,
					duration: param.animation.defaultDuration,
					option: Active.now.option
				};
				Active.transition(state);
			}
		}

		blur(Active: Component, delta: number): void {
			if (Active.type === 'image' || Active.type === 'text') {
				const state: State = {
					src: Active.now.src,
					x: Active.now.x,
					y: Active.now.y,
					z: Active.now.z,
					width: Active.now.width,
					aspectRatio: Active.now.aspectRatio,
					rotate: Active.now.rotate,
					scale: Active.now.scale,
					blur: Math.max(Active.now.blur + delta, 0),
					opacity: Active.now.opacity,
					chroma: Active.now.chroma,
					light: Active.now.light,
					duration: param.animation.defaultDuration,
					option: Active.now.option
				};
				Active.transition(state);
			}
		}

		opacity(Active: Component, delta: number): void {
			if (Active.type === 'image' || Active.type === 'text') {
				const state: State = {
					src: Active.now.src,
					x: Active.now.x,
					y: Active.now.y,
					z: Active.now.z,
					width: Active.now.width,
					aspectRatio: Active.now.aspectRatio,
					rotate: Active.now.rotate,
					scale: Active.now.scale,
					blur: Active.now.blur,
					opacity: ~~Math.max(Math.min(Active.now.opacity + delta, 100), 0),
					chroma: Active.now.chroma,
					light: Active.now.light,
					duration: param.animation.defaultDuration,
					option: Active.now.option
				};
				Active.transition(state);
			}
		}
		chroma(Active: Component, delta: number): void {
			if (Active.type === 'image' || Active.type === 'text') {
				const state: State = {
					src: Active.now.src,
					x: Active.now.x,
					y: Active.now.y,
					z: Active.now.z,
					width: Active.now.width,
					aspectRatio: Active.now.aspectRatio,
					rotate: Active.now.rotate,
					scale: Active.now.scale,
					blur: Active.now.blur,
					opacity: Active.now.opacity,
					chroma: ~~Math.max(Active.now.chroma + delta, 0),
					light: Active.now.light,
					duration: param.animation.defaultDuration,
					option: Active.now.option
				};
				Active.transition(state);
			}
		}
		light(Active: Component, delta: number): void {
			if (Active.type === 'image' || Active.type === 'text') {
				const state: State = {
					src: Active.now.src,
					x: Active.now.x,
					y: Active.now.y,
					z: Active.now.z,
					width: Active.now.width,
					aspectRatio: Active.now.aspectRatio,
					rotate: Active.now.rotate,
					scale: Active.now.scale,
					blur: Active.now.blur,
					opacity: Active.now.opacity,
					chroma: Active.now.chroma,
					light: ~~Math.max(Active.now.light + delta, 0),
					duration: param.animation.defaultDuration,
					option: Active.now.option
				};
				Active.transition(state);
			}
		}
	}

	export class EventHandler {
		addNewScene(): void {
			const num: number = Scene._.length;
			const camera0: State = {
				src: '',
				x: param.camera.initialX,
				y: param.camera.initialY,
				z: param.camera.initialZ,
				width: null,
				aspectRatio: null,
				rotate: 0,
				scale: null,
				blur: null,
				opacity: null,
				chroma: null,
				light: null,
				duration: param.animation.defaultDuration,
				option: ''
			};
			const camera = new Camera({
				scene: num,
				type: 'camera',
				className: 'camera',
				title: 'Camera',
				touchable: true,
				pointer: 'auto',
				float: true,
				trigger: [],
				delay: 0,
				iteration: 1,
				state: [ camera0 ],
				now: camera0,
				running: false,
				element: document.querySelector('.camera')
			});
			Scene.add(camera, [], [], []);
			Scene.change(num);
			Canvas.dom.append(Scene._[num].dom.el);
		}
		CanvasDrop(X: number, Y: number, file: File): void {
			const x: number = X / (Canvas.element.offsetWidth + Canvas.element.offsetLeft) * 100;
			const y: number = Y / (Canvas.element.offsetHeight + Canvas.element.offsetTop) * 100;

			if (/.png|.gif|.jpg|jpeg|.PNG|.GIF|.JPG|.JPEG|.svg|.SVG$/.test(file.name)) {
				this.CanvasDropComponent(x, y, 'image', file, null);
			} else if (/.wav|.mp3|.ogg$/.test(file.name)) {
				this.CanvasDropComponent(x, y, 'sound', file, null);
			} else {
				this.CanvasDropComponent(x, y, 'text', file, null);
			}
		}
		CanvasDropComponent(x: number, y: number, type: string, file: File, given: Component): void {
			let struct: Struct;
			let state0: State;
			let component: Component;
			if (given === null) {
				if (type !== 'sound') {
					state0 = {
						src: file.name,
						x:
							(Scene._[Scene.now].Camera.now.z / param[type].initialZ - 1) *
								(x - param[type].defaultSize * 0.5) +
							Scene._[Scene.now].Camera.now.x +
							(2 - Scene._[Scene.now].Camera.now.z / param[type].initialZ) * param.camera.vanishingX,
						y:
							(Scene._[Scene.now].Camera.now.z / param[type].initialZ - 1) *
								(y - param[type].defaultSize * param[type].aspectRatio * 0.5) +
							Scene._[Scene.now].Camera.now.y +
							(2 - Scene._[Scene.now].Camera.now.z / param[type].initialZ) * param.camera.vanishingY,
						z: param[type].initialZ,
						width: param[type].defaultSize,
						aspectRatio: param[type].aspectRatio,
						rotate: 0,
						scale: 1,
						blur: 0,
						opacity: 100,
						chroma: 100,
						light: 100,
						duration: param.animation.defaultDuration,
						option: ''
					};
				} else {
					state0 = {
						src: file.name,
						x: null,
						y: null,
						z: null,
						width: null,
						aspectRatio: null,
						rotate: null,
						scale: null,
						blur: null,
						opacity: null,
						chroma: null,
						light: null,
						duration: param.animation.defaultDuration,
						option: ''
					};
				}
				struct = {
					scene: Scene.now,
					type: type,
					className: null,
					title: null,
					touchable: true,
					pointer: 'auto',
					float: true,
					trigger: [],
					iteration: 1,
					delay: 0,
					state: [ state0 ],
					now: null,
					running: false,
					element: null
				};
			} else {
				state0 = {
					src: given.now.src,
					x: x,
					y: y,
					z: given.now.z,
					width: given.now.width,
					aspectRatio: given.now.aspectRatio,
					rotate: given.now.rotate,
					scale: given.now.scale,
					blur: given.now.blur,
					opacity: given.now.opacity,
					chroma: given.now.chroma,
					light: given.now.light,
					duration: param.animation.defaultDuration,
					option: given.now.option
				};
				struct = {
					scene: given.scene,
					type: type,
					className: null,
					title: given.title,
					touchable: true,
					pointer: 'auto',
					float: given.float,
					trigger: given.trigger,
					iteration: given.iteration,
					delay: given.delay,
					state: [ state0 ],
					now: null,
					running: false,
					element: null
				};
			}
			if (type === 'image') {
				component = new Image(struct, Scene._[Scene.now].Camera.now);
				Scene._[Scene.now].Images.push(component);
				Scene._[Scene.now].dom.append(component.element);
				EditorSelector.activate(component.className, 'image');
			} else if (type === 'text') {
				component = new Text(struct, Scene._[Scene.now].Camera.now);
				Scene._[Scene.now].Texts.push(component);
				Scene._[Scene.now].dom.append(component.element);
				EditorSelector.activate(component.className, 'text');
			} else if (type === 'sound') {
				component = new Sound(struct);
				Scene._[Scene.now].Sounds.push(component);
				Scene._[Scene.now].dom.append(component.element);
				EditorSelector.activate(component.className, 'sound');
				new SoundPlayer.Register(Active);
			}
			Keyframe.render();
			Layer.render(EditorSelector);
			Trigger.render();
		}
		ComponentClick(className: string, type: string): void {
			EditorSelector.activate(className, type);
		}
		CameraClick(className: string): void {
			EditorSelector.recover();
			EditorSelector.activate(className, 'camera');
		}
		PushStateClick(): void {
			if (Active.type !== 'sound') {
				if (Active.state.length === 1){
					new Animation.Register(Active);
				}
				Active.transition(Active.now);
			}
			CSS.removeActiveStyle(Active);
			Active.state.push(Active.now);
			Keyframe.render();
			CSS.setActiveStyle(Active);
		}
		ShowLayerClick(): void {
			if (!Layer.opened) {
				Layer.render(EditorSelector);
				Layer.show();
			} else {
				Layer.hide();
			}
		}
		ShowTriggerClick(): void {
			if (!Trigger.opened) {
				Trigger.show();
			} else {
				Trigger.hide();
			}
		}
		PlayClick(): void {
			if (Active.type !== 'sound') {
				new Animation.Play(Active);
			} else {
				if (Active.running) {
					// (<HTMLAudioElement>Active.element).currentTime = 0.0;
					(<HTMLAudioElement>Active.element).pause();
					Active.running = false;
				} else {
					new SoundPlayer.Play(Active);
				}
			}
		}
		BaseLayerClick(): void {
			EditorSelector.recover();
		}
	}
}
export const EditorCSS = Editor.CSS;
export const EditorSelector = new Editor.Selector();
export const EditorTransform = new Editor.Transform();
export const EditorEventHandler = new Editor.EventHandler();
