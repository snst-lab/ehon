import { fileReader } from './fileManager';

export let config: { [key: string]: string };
export let param: { [key: string]: { [key: string]: number } };
export let css: { [key: string]: any };

namespace Setting{
	export function start(): Promise<string> {
		return new Promise((resolve, reject) => {
			fileReader({ url: 'ehon.json', type: 'GET', async: true })
				.then((data: XMLHttpRequest) => {
					const json = JSON.parse(data.responseText);
					[ config, param, css ] = [ json.config, json.param, json.css ];
					resolve();
				})
				.catch((error: XMLHttpRequest) => {
					reject(error.responseText);
				});
		});
	}
}
export const readSetting = Setting.start;