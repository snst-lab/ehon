import { param, config } from './parameter';
import { Canvas, Scenes as scene, Now as now } from './canvas';
import { PalletActive,PalletKeyframe as Keyframe } from './pallet';
import {
	ComponentType as Component,
	ComponentStructure as Struct,
	ComponentState as State,
	ComponentImage as Image
} from './component';
import { AnimationRegister, AnimationPlay } from './animation';

export let Active: Component = null;

export namespace Editor {
	const outlineStyle: string = `outline:${config.activeOutlineWidth} ${config.activeOutlineStyle} ${config.activeOutlineColor};`;

	export class Selector {
		private type: string | null;

		activate(className: string, type: string): void {
			if (Active !== null && Active.className === className) {
				this.release();
				return;
			}
			this.type = type;
			[ ...scene[now].Images, scene[now].Camera ].forEach((e) => {
				if (e.className !== className) {
					e.element.style.outlineWidth = '';
					e.element.style.outlineStyle = '';
					e.element.style.outlineColor = '';
				}
			});
			Active = this.select(className);
			Active.element.style.outlineWidth = config.activeOutlineWidth;
			Active.element.style.outlineStyle = config.activeOutlineStyle;
			Active.element.style.outlineColor = config.activeOutlineColor;
			Keyframe.render(Active);
		}
		release(): void {
			if (Active !== null) {
				//style off
				Active.element.style.outlineWidth = '';
				Active.element.style.outlineStyle = '';
				Active.element.style.outlineColor = '';
				PalletActive.title.dom.el.textContent = '';
				Keyframe.delay.dom.el.textContent = '';
				Keyframe.iteration.dom.el.textContent = '';
				//penetration
				if (Active.type === 'image') {
					Active.element.style.pointerEvents = 'none';
					Active.pointer = 'none';
				}
				Active = null;
				Keyframe.clear();
			}
		}
		recover(): void {
			[ ...scene[now].Images, scene[now].Camera ].forEach((e) => {
				if (e.touchable) {
					e.element.style.pointerEvents = 'auto';
					e.pointer = 'auto';
				}
			});
		}
		select(className: string): Component {
			switch (this.type) {
				case 'image':
					return scene[now].Images.filter((e) => e.className === className)[0];
				case 'camera':
					return scene[now].Camera;
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
				rotate: Active.now.rotate,
				scale: Active.now.scale,
				blur: Active.now.blur,
				opacity: Active.now.opacity,
				duration: param.animation.defaultDuration
			};
			Active.transition(state, outlineStyle);
		}

		rotate(Active: Component, delta: number): void {
			const state: State = {
				src: Active.now.src,
				x: Active.now.x,
				y: Active.now.y,
				z: Active.now.z,
				rotate: Active.now.rotate + ~~delta,
				scale: Active.now.scale,
				blur: Active.now.blur,
				opacity: Active.now.opacity,
				duration: param.animation.defaultDuration
			};
			Active.transition(state, outlineStyle);
		}

		scale(Active: Component, delta: number): void {
			if (Active.type !== 'camera') {
				const state: State = {
					src: Active.now.src,
					x: Active.now.x,
					y: Active.now.y,
					z: Active.now.z,
					rotate: Active.now.rotate,
					scale: Active.now.scale + delta,
					blur: Active.now.blur,
					opacity: Active.now.opacity,
					duration: param.animation.defaultDuration
				};
				Active.transition(state, outlineStyle);
			}
		}

		blur(Active: Component, delta: number): void {
			if (Active.type !== 'camera') {
				const state: State = {
					src: Active.now.src,
					x: Active.now.x,
					y: Active.now.y,
					z: Active.now.z,
					rotate: Active.now.rotate,
					scale: Active.now.scale,
					blur: Active.now.blur + delta,
					opacity: Active.now.opacity,
					duration: param.animation.defaultDuration
				};
				Active.transition(state, outlineStyle);
			}
		}

		opacity(Active: Component, delta: number): void {
			if (Active.type !== 'camera') {
				const state: State = {
					src: Active.now.src,
					x: Active.now.x,
					y: Active.now.y,
					z: Active.now.z,
					rotate: Active.now.rotate,
					scale: Active.now.scale,
					blur: Active.now.blur,
					opacity: Active.now.opacity + delta,
					duration: param.animation.defaultDuration
				};
				Active.transition(state, outlineStyle);
			}
		}
	}

	export class EventHandler {
		CanvasDrop(X: number, Y: number, file: File): void {
			const x: number = X / (Canvas.element.offsetWidth + Canvas.element.offsetLeft) * 100;
			const y: number = Y / (Canvas.element.offsetHeight + Canvas.element.offsetTop) * 100;
			const state0: State = {
				src: file.name,
				x:
					(scene[now].Camera.now.z / param.image.initialZ - 1) * (x - param.image.defaultSize * 0.5) +
					scene[now].Camera.now.x +
					(2 - scene[now].Camera.now.z / param.image.initialZ) * param.camera.vanishingX,
				y:
					(scene[now].Camera.now.z / param.image.initialZ - 1) *
						(y - param.image.defaultSize * param.image.aspectRatio * 0.5) +
					scene[now].Camera.now.y +
					(2 - scene[now].Camera.now.z / param.image.initialZ) * param.camera.vanishingY,
				z: param.image.initialZ,
				rotate: 0,
				scale: 1,
				blur: 0,
				opacity: 1,
				duration: param.animation.defaultDuration
			};
			const struct: Struct = {
				type: null,
				element: null,
				className: null,
				title:null,
				touchable: null,
				trigger:null,
				iteration:null,
				delay:null,
				running:null,
				state: null,
				now: state0
			};
			const image = new Image(now, struct);
			scene[now].Images.push(image);
			scene[now].dom.append(image.element);

			selector.activate(image.className, 'image');
			Active.state.push(Active.now);
			Keyframe.render(Active);
		}
		CanvasResize(): void {
			new Canvas.Resize(() => {
				Canvas.aspectRatio = Canvas.element.offsetHeight / Canvas.element.offsetWidth;
				scene[now].Images.forEach((e) => {
					e.transition(e.now, e.className === Active.className ? outlineStyle : '');
				});
			});
		}
		ImageClick(className: string): void {
			selector.activate(className, 'image');
		}
		CameraClick(className: string): void {
			selector.release();
			selector.recover();
			selector.activate(className, 'camera');
		}
		PushStateClick(): void {
			if (Active === null) return;
			if (Active.state.length === 1) {
				new AnimationRegister(Active, Active, 'contextmenu');
			}
			Active.transition(Active.now, outlineStyle);
			Active.state.push(Active.now);
			Keyframe.render(Active);
		}
		PlayClick(): void {
			new AnimationPlay(Active);
		}
		BaseLayerClick(): void {
			console.log()
			selector.recover();
		}
	}
	const selector = new Editor.Selector();
}
export const EditorSelector = Editor.Selector;
export const EditorTransform = Editor.Transform;
export const EditorEventHandler = Editor.EventHandler;
