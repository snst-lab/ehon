export const param: { [key: string]: { [key: string]: number } } = {
	canvas: {
		Z: 3
	},
	background: {
		initialZ: 50,
		defaultSize: 150,
		aspectRatio: 0.5
	},
	image: {
		initialZ: 50,
		defaultSize: 30,
		aspectRatio : 1
	},
	camera: {
		initialX: 50,
		initialY: 50,
		initialZ: 200,
		depthOfField: 50,
		vanishingX:50,
		vanishingY:50
	},
	wheelResponse: {
		XY: 0.05,
		Z: 0.01,
		scale: 0.0005,
		rotate: 0.05,
		opacity: 0.001,
		blur: 0.01
	},
	animation:{
		skipFrame:2,
		defaultDuration:30
	}
};
export const config: { [key: string]: string } = {
	mode:'edit',
	imageSrcPath: 'assets/img/',
	imageSrcUrl: '../../assets/img/',
	backgroundFile: 'background.jpg',
	activeOutlineWidth:  '3px',
	activeOutlineStyle:  'solid',
	activeOutlineColor:  '#00ffdd',
	imageClick: 'imageClick',
	imageDoubleClick: 'imageDoubleClick',
	imageDragStart: 'imageDragStart',
	imageDragEnd: 'imageDragEnd'
};
