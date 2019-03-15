import { param, config } from './parameter';
import { Canvas } from './canvas';
import { ComponentState as State } from './component';

namespace Calculation {
	export class CSS {
		private styleFix: string = `position:absolute;transform-origin:50% 50%;background-size:contain;background-position:center;background-repeat:no-repeat;`;

		image(Image: State, Camera: State, pointer: string, option: string): string {
			const distanceInv: number = 1 / Math.max(Camera.z - Image.z, 1);
			const size: number = (param.camera.initialZ - param.image.initialZ) * distanceInv;
			return `${this.styleFix}${option}
				background-image:url(${config.imageSrcUrl}${Image.src});
				left:${(Image.x - Camera.x - param.camera.vanishingX) * Image.z * distanceInv + param.camera.vanishingX}%;
				top:${(Image.y - Camera.y - param.camera.vanishingY) * Image.z * distanceInv + param.camera.vanishingY}%;
				z-index:${~~Image.z + Canvas.z};
				width:${param.image.defaultSize * size}%;
				height:${param.image.defaultSize * param.image.aspectRatio / Canvas.aspectRatio * size}%;
				transform: rotate(${~~(Image.rotate - Camera.rotate)}deg) scale(${Image.scale});
				filter:blur(${~~(
					Image.blur +
					Math.abs(Camera.z - Image.z - param.camera.initialZ + param.image.initialZ) /
						param.camera.depthOfField
				)}px);
				opacity:${Camera.z < Image.z ? 0 : ~~Image.opacity || 1};
				pointer-events:${pointer};
			`;
		}
	}
}
export const CalcCSS = Calculation.CSS;
