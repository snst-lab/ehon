import { Canvas } from './canvas';
import { Component } from './component';

export namespace Editor {
	export let Active: Component.Type = null;

	class activeStyle {
		static width: string = '3px';
		static style: string = 'solid';
		static color: string = '#00ffdd';
	}

	interface position {
		x: number;
		y: number;
	}

	export class EventHandler {
		private dragstart: position = { x: 0, y: 0 };
		constructor() {}
		ImageClick(event: any) {
			new Selector('image').activate(event);
		}
		ImageDoubleClick(event: any) {}
		CameraClick(event: any) {
			new Selector(null).release();
			new Selector(null).recover();
			new Selector('camera').activate(event);
		}
		BackgroundClick(event: any) {
			new Selector('background').activate(event);
		}
		BackgroundDoubleClick(event: any) {}
		ImageDragStart(event: any) {
			const className: string = event.target.classList.item(0);
			if (Editor.Active === null && Editor.Active.className !== className) return;
			this.dragstart.x = event.clientX;
			this.dragstart.y = event.clientY;
		}
		ImageDragEnd(event: any) {
			const correctXY = (Component.Camera.now.z - Active.now.z) / Active.now.z;
			const dx: number = (event.clientX - this.dragstart.x) * 100 / Canvas.Element.offsetWidth * correctXY;
			const dy: number = (event.clientY - this.dragstart.y) * 100 / Canvas.Element.offsetHeight * correctXY;
			new Transition().translate(Editor.Active, dx, dy, 0);
		}
		CanvasClick(event: any) {
			// new Selector(null).release();
		}
		CanvasDrop(event: any, file: File) {
			Component.Images.push(
				new Component.Image(
					file.name,
					event.clientX / (Canvas.Element.offsetWidth + Canvas.Element.offsetLeft) * 100,
					event.clientY / (Canvas.Element.offsetHeight + Canvas.Element.offsetTop) * 100
				)
			);
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
			Editor.Active.element.style.outlineWidth = activeStyle.width;
			Editor.Active.element.style.outlineStyle = activeStyle.style;
			Editor.Active.element.style.outlineColor = activeStyle.color;

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

	
	export class Transition {
		outlineStyle(): string {
			return Active.type !== 'camera'
				? `outline:${activeStyle.width} ${activeStyle.style} ${activeStyle.color};`
				: '';
		}

		translate(Active: Component.Type, dx: number, dy: number, dz: number) {
			Active.change(
				{
					src: Active.now.src,
					x: Active.now.x + dx,
					y: Active.now.y + dy,
					z: Active.now.z + dz,
					rotate: Active.now.rotate,
					scale: Active.now.scale,
					blur: Active.now.blur,
					opacity: Active.now.opacity
				},
				this.outlineStyle()
			);
		}

		rotate(Active: Component.Type, delta: number) {
			Active.change(
				{
					src: Active.now.src,
					x: Active.now.x,
					y: Active.now.y,
					z: Active.now.z,
					rotate: Active.now.rotate + delta,
					scale: Active.now.scale,
					blur: Active.now.blur,
					opacity: Active.now.opacity
				},
				this.outlineStyle()
			);
		}

		scale(Active: Component.Type, delta: number) {
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
						opacity: Active.now.opacity
					},
					this.outlineStyle()
				);
			}
		}

		blur(Active: Component.Type, delta: number) {
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
						opacity: Active.now.opacity
					},
					this.outlineStyle()
				);
			}
		}

		opacity(Active: Component.Type, delta: number) {
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
						opacity: Active.now.opacity + delta
					},
					this.outlineStyle()
				);
			}
		}
	}
}
