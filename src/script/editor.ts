import { param, config, css } from './parameter';
import { Canvas, Scene } from './canvas';
import { PalletActive, PalletKeyframe as Keyframe, PalletLayer as Layer, PalletTrigger as Trigger } from './pallet';
import {
	ComponentType as Component,
	ComponentStructure as Struct,
	ComponentState as State,
	ComponentImage as Image,
	ComponentText as Text
} from './component';
import { Animation } from './animation';

export let Active: Component = null;

export namespace Editor {
	class CSS {
		static setActiveStyle(c: Component) {
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

		static removeActiveStyle(c: Component) {
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
			if (Active !== null && Active.className === className) {
				this.release();
				return;
			}
			this.type = type;
			[ ...Scene._[Scene.now].Images, ...Scene._[Scene.now].Texts, Scene._[Scene.now].Camera ].forEach((e) => {
				if (e.className !== className) {
					CSS.removeActiveStyle(e);
				}
			});
			Active = this.select(className);
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
				if (Active.type === 'image' || Active.type === 'text') {
					Active.element.style.pointerEvents = 'none';
					Active.pointer = 'none';
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
				case 'camera':
					return Scene._[Scene.now].Camera;
			}
		}
	}

	export class Transform {
		translate(Active: Component, dx: number, dy: number, dz: number): void {
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
				duration: param.animation.defaultDuration,
				option: Active.now.option
			};
			Active.transition(state);
		}

		rotate(Active: Component, delta: number): void {
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
				duration: param.animation.defaultDuration,
				option: Active.now.option
			};
			Active.transition(state);
		}

		scale(Active: Component, delta: number): void {
			if (Active.type !== 'camera') {
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
					duration: param.animation.defaultDuration,
					option: Active.now.option
				};
				Active.transition(state);
			}
		}

		blur(Active: Component, delta: number): void {
			if (Active.type !== 'camera') {
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
					duration: param.animation.defaultDuration,
					option: Active.now.option
				};
				Active.transition(state);
			}
		}

		opacity(Active: Component, delta: number): void {
			if (Active.type !== 'camera') {
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
					opacity: Math.max(Math.min(Active.now.opacity + delta, 1), 0),
					duration: param.animation.defaultDuration,
					option: Active.now.option
				};
				Active.transition(state);
			}
		}
	}

	export class EventHandler {
		CanvasDrop(X: number, Y: number, file: File): void {
			const x: number = X / (Canvas.element.offsetWidth + Canvas.element.offsetLeft) * 100;
			const y: number = Y / (Canvas.element.offsetHeight + Canvas.element.offsetTop) * 100;

			if (/.png|.gif|.jpg|jpeg|.PNG|.GIF|.JPG|.JPEG$/.test(file.name)) {
				this.CanvasDropComponent(x, y, 'image', file, null);
			} else if (/.wav|.mp3$/.test(file.name)) {
			} else {
				this.CanvasDropComponent(x, y, 'text', file, null);
			}
		}
		CanvasDropComponent(x: number, y: number, type: string, file: File, given: Component): void {
			let struct: Struct;
			let component: Component;
			if (given === null) {
				let state0: State = {
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
					opacity: 1,
					duration: param.animation.defaultDuration,
					option: ''
				};
				struct = {
					scene: Scene.now,
					type: null,
					className: null,
					title: null,
					touchable: null,
					float: null,
					trigger: null,
					iteration: null,
					delay: null,
					running: null,
					state: null,
					now: state0,
					element: null
				};
			} else {
				const state0: State = {
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
					duration: given.now.duration,
					option: given.now.option
				};
				struct = {
					scene: Scene.now,
					type: type,
					className: null,
					title: given.title,
					touchable: true,
					float: given.float,
					trigger: given.trigger,
					iteration: given.iteration,
					delay: given.delay,
					running: null,
					state: null,
					now: state0,
					element: null
				};
			}
			if (type === 'image') {
				component = new Image(Scene.now, struct);
				Scene._[Scene.now].Images.push(component);
				Scene._[Scene.now].dom.append(component.element);
				EditorSelector.activate(component.className, 'image');
			} else if (type === 'text') {
				component = new Text(Scene.now, struct);
				Scene._[Scene.now].Texts.push(component);
				Scene._[Scene.now].dom.append(component.element);
				EditorSelector.activate(component.className, 'text');
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
			if (Active.state.length === 1) {
				new Animation.Register(Active, 'contextmenu');
			}
			Active.transition(Active.now);
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
			new Animation.Play(Active);
		}
		BaseLayerClick(): void {
			EditorSelector.recover();
		}
	}
}
export const EditorSelector = new Editor.Selector();
export const EditorTransform = new Editor.Transform();
export const EditorEventHandler = new Editor.EventHandler();
