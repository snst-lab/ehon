import { ComponentState as State, ComponentStructure } from './component';
import { CanvasType } from './canvas';

namespace Calculation {
	/**
	 * ### Calculation.CSS
	 *   Calculate cssText of components
	 */
	export class CSS {
		public image_transition(
			Target: ComponentStructure,
			Canvas: CanvasType,
			Image: State,
			Camera: State,
			config: { [key: string]: number | string | boolean },
			param: { [key: string]: { [key: string]: number } }
		): void {
			Target.element.style.cssText = Target.float
				? this.image_float(Canvas, Image, Camera, config, param, Target.pointer)
				: this.image_fix(Canvas, Image, Camera, config, Target.pointer);
		}
		public image_transition_for_camera(Target: ComponentStructure,
			Canvas: CanvasType,
			Image: State,
			Camera: State,
			param: { [key: string]: { [key: string]: number } }): void {
			if (Target.float) {
				const distanceInv: number = 1 / Math.max(Camera.z - Image.z, 1);
				const size: number = (param.camera.initialZ - param.image.initialZ) * distanceInv;
				Target.element.style.left = ((Image.x - Camera.x - param.camera.vanishingX) * Image.z * distanceInv + param.camera.vanishingX) as unknown as string + '%';
				Target.element.style.top = ((Image.y - Camera.y - param.camera.vanishingY) * Image.z * distanceInv + param.camera.vanishingY) as unknown as string + '%';
				Target.element.style.width = (Image.width * size) as unknown as string + '%';
				Target.element.style.height = (Image.width * Image.aspectRatio / Canvas.aspectRatio * size) as unknown as string + '%';
				Target.element.style.filter = `filter:blur(${Image.blur +
					Math.abs(Camera.z - Image.z - param.camera.initialZ + param.image.initialZ) /
					param.camera
						.depthOfField}px) opacity(${Image.opacity}%) saturate(${Image.chroma}%) brightness(${Image.light}%);`;
			}
		}
		public image_float(Canvas: CanvasType, Image: State, Camera: State, config: { [key: string]: number | string | boolean }, param: { [key: string]: { [key: string]: number } }, pointer: string): string {
			const distanceInv: number = 1 / Math.max(Camera.z - Image.z, 1);
			const size: number = (param.camera.initialZ - param.image.initialZ) * distanceInv;
			return `background-image:url(${config.imageSrcUrl}${Image.src});
				left:${(Image.x - Camera.x - param.camera.vanishingX) * Image.z * distanceInv + param.camera.vanishingX}%;
				top:${(Image.y - Camera.y - param.camera.vanishingY) * Image.z * distanceInv + param.camera.vanishingY}%;
				z-index:${~~Image.z + Canvas.z};
				width:${Image.width * size}%;
				height:${Image.width * Image.aspectRatio / Canvas.aspectRatio * size}%;
				transform: rotate(${Image.rotate}deg) scale(${Image.scale});
				filter:blur(${Image.blur +
					 Math.abs(Camera.z - Image.z - param.camera.initialZ + param.image.initialZ) / param.camera.depthOfField
					}px) opacity(${Image.opacity}%) saturate(${Image.chroma}%) brightness(${Image.light}%);
				pointer-events:${pointer};${Image.option}
			`;
		}
		public image_fix(Canvas: CanvasType, Image: State, Camera: State, config: { [key: string]: number | string | boolean }, pointer: string): string {
			return `background-image:url(${config.imageSrcUrl}${Image.src});
				left:${Image.x}%;
				top:${Image.y}%;
				z-index:${~~Camera.z};
				width:${Image.width}%;
				height:${Image.width * Image.aspectRatio / Canvas.aspectRatio}%;
				transform: rotate(${Image.rotate}deg) scale(${Image.scale});
				filter:blur(${Image.blur}px) opacity(${Image.opacity}%) saturate(${Image.chroma}%) brightness(${Image.light}%);
				pointer-events:${pointer};${Image.option}
			`;
		}

		public text_transition(
			Target: ComponentStructure,
			Canvas: CanvasType,
			Text: State,
			Camera: State,
			param: { [key: string]: { [key: string]: number } }
		): void {
			Target.element.style.cssText = Target.float
				? this.text_float(Canvas, Text, Camera, param, Target.pointer)
				: this.text_fix(Canvas, Text, Camera, Target.pointer);
		}

		public text_transition_for_camera(Target: ComponentStructure,
			Canvas: CanvasType,
			Text: State,
			Camera: State,
			// _config: { [key: string]: number | string | boolean },
			param: { [key: string]: { [key: string]: number } }
		): void {
			if (Target.float) {
				const distanceInv: number = 1 / Math.max(Camera.z - Text.z, 1);
				const size: number = (param.camera.initialZ - param.image.initialZ) * distanceInv;
				Target.element.style.left = ((Text.x - Camera.x - param.camera.vanishingX) * Text.z * distanceInv + param.camera.vanishingX) as unknown as string + '%';
				Target.element.style.top = ((Text.y - Camera.y - param.camera.vanishingY) * Text.z * distanceInv + param.camera.vanishingY) as unknown as string + '%';
				Target.element.style.width = (Text.width * size) as unknown as string + '%';
				Target.element.style.height = (Text.width * Text.aspectRatio / Canvas.aspectRatio * size) as unknown as string + '%';
				Target.element.style.filter = `filter:blur(${Text.blur +
					Math.abs(Camera.z - Text.z - param.camera.initialZ + param.text.initialZ) /
					param.camera
						.depthOfField}px) opacity(${Text.opacity}%) saturate(${Text.chroma}%) brightness(${Text.light}%);`;
			}
		}
		public text_float(Canvas: CanvasType, Text: State, Camera: State,
			param: { [key: string]: { [key: string]: number } },
			pointer: string): string {
			const distanceInv: number = 1 / Math.max(Camera.z - Text.z, 1);
			const size: number = (param.camera.initialZ - param.image.initialZ) * distanceInv;
			return `
				left:${(Text.x - Camera.x - param.camera.vanishingX) * Text.z * distanceInv + param.camera.vanishingX}%;
				top:${(Text.y - Camera.y - param.camera.vanishingY) * Text.z * distanceInv + param.camera.vanishingY}%;
				z-index:${~~Text.z + Canvas.z};
				width:${Text.width * size}%;
				height:${Text.width * Text.aspectRatio / Canvas.aspectRatio * size}%;
				transform: rotate(${Text.rotate}deg) scale(${Text.scale});
				filter:blur(${Text.blur +
				Math.abs(Camera.z - Text.z - param.camera.initialZ + param.text.initialZ) /
				param.camera
					.depthOfField}px) opacity(${Text.opacity}%) saturate(${Text.chroma}%) brightness(${Text.light}%);
				pointer-events:${pointer};${Text.option}
			`;
		}

		public text_fix(Canvas: CanvasType, Text: State, Camera: State, pointer: string): string {
			return `
				left:${Text.x}%;
				top:${Text.y}%;
				z-index:${~~Camera.z + 1};
				width:${Text.width}%;
				height:${Text.width * Text.aspectRatio / Canvas.aspectRatio}%;
				transform: rotate(${Text.rotate}deg) scale(${Text.scale});
				filter:blur(${Text.blur}px) opacity(${Text.opacity}%) saturate(${Text.chroma}%) brightness(${Text.light}%);
				pointer-events:${pointer};${Text.option}
			`;
		}
	}
}
// tslint:disable-next-line: typedef
export let CalcCSS = new Calculation.CSS();
