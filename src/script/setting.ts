import { fileReader } from './fileManager';

export let config: { [key: string]: number | string | boolean };
export let param: { [key: string]: { [key: string]: number } };
export let css: { [key: string]: CSSStyleDeclaration };

namespace Setting {
	export async function start(): Promise<string> {
		return new Promise((resolve: (value?: string | PromiseLike<string> | undefined) => void, reject: (reason?: string) => void) => {
			fileReader({ 'url': 'ehon.json', 'type': 'GET', 'async': true, 'data': '' }).then((data: XMLHttpRequest) => {
				// tslint:disable-next-line:no-any
				const json: any = JSON.parse(data.responseText);
				// tslint:disable-next-line: no-unsafe-any
				[config, param, css] = [json.config, json.param, json.css];
				resolve();
			})
				.catch((error: XMLHttpRequest) => {
					reject(error.responseText);
				});
		});
	}
}
export const readSetting: () => Promise<string> = Setting.start;
