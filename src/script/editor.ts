import { param, config } from './parameter';
import { Canvas } from './canvas';
import { ToolPallet as Tool } from './toolPallet';
import { Component } from './component';
import { Transition } from './transition';

export namespace Editor {
	export let Active: Component.Type = null;
    const outlineStyle: string = `outline:${config.activeOutlineWidth} ${config.activeOutlineStyle} ${config.activeOutlineColor};`;

	interface position {
		x: number;
		y: number;
	}

	export class EventHandler {
		private dragstart: position = { x: 0, y: 0 };
		constructor() {}
		ImageClick(event: any): void {
			new Selector('image').activate(event);
		}
		ImageDoubleClick(event: any): void {}
		CameraClick(event: any): void {
			new Selector(null).release();
			new Selector(null).recover();
			new Selector('camera').activate(event);
		}
		BackgroundClick(event: any): void {
			new Selector('background').activate(event);
		}
		BackgroundDoubleClick(event: any): void {}

		ImageDragStart(event: any): void {
			if (Editor.Active === null) return;
			const className: string = event.target.classList.item(0);
			if (Editor.Active.className !== className) return;
			this.dragstart.x = event.clientX;
			this.dragstart.y = event.clientY;
		}
		ImageDragEnd(event: any): void {
			if (Editor.Active === null) return;
			const className: string = event.target.classList.item(0);
			if (Editor.Active.className !== className) return;
			const correctXY = (Component.Camera.now.z - Active.now.z) / Active.now.z;
			const dx: number = (event.clientX - this.dragstart.x) * 100 / Canvas.Element.offsetWidth * correctXY;
			const dy: number = (event.clientY - this.dragstart.y) * 100 / Canvas.Element.offsetHeight * correctXY;
			new Transform().translate(Editor.Active, dx, dy, 0);
		}
		CanvasClick(event: any): void {
			// new Selector(null).release();
		}
		CanvasDrop(event: any, file: File): void {
			Component.Images.push(
				new Component.Image(
					file.name,
					event.clientX / (Canvas.Element.offsetWidth + Canvas.Element.offsetLeft) * 100,
					event.clientY / (Canvas.Element.offsetHeight + Canvas.Element.offsetTop) * 100
				)
			);
		}
		PushStateClick(event: any): void {
			if (Editor.Active === null) return;
			if (Active.state.length === 1) {
				new Transition.Animation().register(Active,Active, 'contextmenu');
			}
			Active.state.push(Active.now);
			Tool.stateList.render(Active);
		}
	}

	class Selector {
		private type: string | null;

		constructor(type: string) {
			this.type = type;
		}
		activate(event: any): void {
			const className: string = event.target.classList.item(0);
			if (Editor.Active !== null && Editor.Active.className === className) {
				this.release();
				return;
			}

			Editor.Active = this.select(className);
			Editor.Active.element.style.outlineWidth = config.activeOutlineWidth;
			Editor.Active.element.style.outlineStyle = config.activeOutlineStyle;
			Editor.Active.element.style.outlineColor = config.activeOutlineColor;
			Tool.stateList.render(Active);
			[ ...Component.Images, Component.Camera, Component.Background ].forEach((e) => {
				if (e.className !== className) {
					e.element.style.outlineWidth = '';
					e.element.style.outlineStyle = '';
					e.element.style.outlineColor = '';
				}
			});
		}
		release(): void {
			if (Editor.Active !== null) {
				//penetration
				if (Editor.Active.type === 'image') Editor.Active.element.style.pointerEvents = 'none';
				else if (Editor.Active.type === 'background') this.recover();
				//style off
				Editor.Active.element.style.outlineWidth = '';
				Editor.Active.element.style.outlineStyle = '';
				Editor.Active.element.style.outlineColor = '';
				Editor.Active = null;
				Tool.stateList.clear();
			}
		}
		recover(): void {
			[ ...Component.Images, Component.Camera, Component.Background ].forEach((e) => {
				if (e.pointer) {
					e.element.style.pointerEvents = 'auto';
				}
			});
		}
		select(className: string): Component.Type {
			switch (this.type) {
				case 'image':
					return Component.Images.filter((e) => e.className === className)[0];
				case 'camera':
					return Component.Camera;
				case 'background':
					return Component.Background;
			}
		}
	}

	export class Transform {

		translate(Active: Component.Type, dx: number, dy: number, dz: number): void {
			Active.change(
				{
					src: Active.now.src,
					x: Active.now.x + dx,
					y: Active.now.y + dy,
					z: Active.now.z + dz,
					rotate: Active.now.rotate,
					scale: Active.now.scale,
					blur: Active.now.blur,
					opacity: Active.now.opacity,
					duration: param.animation.defaultDuration
				},
				outlineStyle
			);
		}

		rotate(Active: Component.Type, delta: number): void {
			Active.change(
				{
					src: Active.now.src,
					x: Active.now.x,
					y: Active.now.y,
					z: Active.now.z,
					rotate: Active.now.rotate + delta,
					scale: Active.now.scale,
					blur: Active.now.blur,
					opacity: Active.now.opacity,
					duration: param.animation.defaultDuration
				},
				outlineStyle
			);
		}

		scale(Active: Component.Type, delta: number): void {
			if (Active.type !== 'camera') {
				Active.change(
					{
						src: Active.now.src,
						x: Active.now.x,
						y: Active.now.y,
						z: Active.now.z,
						rotate: Active.now.rotate,
						scale: Active.now.scale + delta,
						blur: Active.now.blur,
						opacity: Active.now.opacity,
						duration: param.animation.defaultDuration
					},
					outlineStyle
				);
			}
		}

		blur(Active: Component.Type, delta: number): void {
			if (Active.type !== 'camera') {
				Active.change(
					{
						src: Active.now.src,
						x: Active.now.x,
						y: Active.now.y,
						z: Active.now.z,
						rotate: Active.now.rotate,
						scale: Active.now.scale,
						blur: Active.now.blur + delta,
						opacity: Active.now.opacity,
						duration: param.animation.defaultDuration
					},
					outlineStyle
				);
			}
		}

		opacity(Active: Component.Type, delta: number): void {
			if (Active.type !== 'camera') {
				Active.change(
					{
						src: Active.now.src,
						x: Active.now.x,
						y: Active.now.y,
						z: Active.now.z,
						rotate: Active.now.rotate,
						scale: Active.now.scale,
						blur: Active.now.blur,
						opacity: Active.now.opacity + delta,
						duration: param.animation.defaultDuration
					},
					outlineStyle
				);
			}
		}
	}
}
