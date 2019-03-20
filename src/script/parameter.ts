export let param: { [key: string]: { [key: string]: number } } = {
	image: {
		initialZ: 50,
		defaultSize: 50,
		aspectRatio: 1
	},
	text: {
		initialZ: 50,
		defaultSize: 10,
		aspectRatio: 5
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
	backgroundFile: 'background.jpg'
};

export let css: { [key: string]: any } = {
	common: 'position:absolute;transform-origin:center;backface-visibility:hidden;',
	text:'font-size:5rem;text-align:center;writing-mode: vertical-rl;color:white;text-shadow: 2px 2px 0 #000,-2px 2px 0 #000,2px -2px 0 #000,-2px -2px 0 #000;',
	active: {
		outlineColor: 'rgb(0,200,180)',
		defaultColor: 'rgb(0,200,180)',
		editableColor: 'rgb(0,0,240)',
		outlineStyle: 'solid',
		outlineWidth: '3px'
	},
	resize: {
		resize: 'both',
		overflow: 'hidden',
		cursor: 'move'
	},
	option: {
		outlineColor: 'rgb(255,50,200)',
		outlineStyle: 'solid',
		outlineWidth: '3px'
	}
};
