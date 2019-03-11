import { param } from './parameter';

export interface Style {
	src: string | null;
	x: number | null;
	y: number | null;
	z: number | null;
	rotate: number | null;
	scale: number | null;
	blur: number | null;
	opacity: number | null;
	duration: number | null;
}

export class StyleEditor {
	add(style1: Style, style2: Style): Style {
		return {
			src: style1.src,
			x: style1.x + style2.x,
			y: style1.y + style2.y,
			z: style1.z + style2.z,
			rotate: style1.rotate + style2.rotate,
			scale: style1.scale + style2.scale,
			blur: style1.blur + style2.blur,
			opacity: style1.opacity + style2.opacity,
			duration: style1.duration
		};
	}
	diff(oldStyle: Style, newStyle: Style): Style {
		const durInv:number = newStyle.duration ? 1 / newStyle.duration * param.animation.skipFrame : 0;
		return {
			src: oldStyle.src,
			x: (newStyle.x - oldStyle.x) * durInv,
			y:(newStyle.y - oldStyle.y)*durInv,
			z:(newStyle.z - oldStyle.z)*durInv,
			rotate:(newStyle.rotate - oldStyle.rotate)*durInv,
			scale:(newStyle.scale - oldStyle.scale)*durInv,
			blur:(newStyle.blur - oldStyle.blur)*durInv,
			opacity:(newStyle.opacity - oldStyle.opacity)*durInv,
			duration: oldStyle.duration
		};
	}
}
