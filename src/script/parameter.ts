export let param: { [key: string]: { [key: string]: number } } = {
	image: {
		initialZ: 50,
		defaultSize: 50,
		aspectRatio: 1
	},
	camera: {
		initialX: 50,
		initialY: 50,
		initialZ: 200,
		depthOfField: 50,
		vanishingX: 50,
		vanishingY: 50
	},
	wheelResponse: {
		XY: 0.05,
		Z: 0.02,
		scale: 0.0005,
		rotate: 0.05,
		opacity: 0.001,
		blur: 0.01
	},
	animation: {
		skipFrame: 2,
		defaultDuration: 30
	}
};
export let config: { [key: string]: string } = {
	mode: 'edit',
	scenePath: 'assets/scene/',
	imageSrcPath: 'assets/img/',
	imageSrcUrl: '../../assets/img/',
	backgroundFile: 'background.jpg',
	activeOutlineWidth: '3px',
	activeOutlineStyle: 'solid',
	activeOutlineColor: 'rgb(0, 200, 180)',
	triggerOutlineWidth: '3px',
	triggerOutlineStyle: 'solid',
	triggerOutlineColor: 'rgb(220, 80, 210)',
	imageClick: 'imageClick',
	imageDoubleClick: 'imageDoubleClick',
	imageDragStart: 'imageDragStart',
	imageDragEnd: 'imageDragEnd'
};
