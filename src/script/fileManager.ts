namespace FileManager {
	export async function read(option: { type: string; url: string; async: boolean; data: string }): Promise<XMLHttpRequest> {
		const xhr: XMLHttpRequest = new XMLHttpRequest();
		if (option.type === 'POST') {
			return new Promise(
				(resolve: (value?: XMLHttpRequest | PromiseLike<XMLHttpRequest> | undefined) => void,
					reject: (value?: XMLHttpRequest | PromiseLike<XMLHttpRequest> | undefined) => void) => {
					xhr.open('POST', option.url, option.async);
					xhr.onload = () => {
						if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) resolve(xhr);
						else reject(xhr);
					};
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
					xhr.send(option.data);
				});
		} else {
			return new Promise(
				(resolve: (value?: XMLHttpRequest | PromiseLike<XMLHttpRequest> | undefined) => void,
					reject: (value?: XMLHttpRequest | PromiseLike<XMLHttpRequest> | undefined) => void) => {
					xhr.open('GET', option.url, option.async);
					xhr.onload = () => {
						if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) resolve(xhr);
						else reject(xhr);
					};
					xhr.send();
				});
		}
	}
}
// tslint:disable-next-line:typedef
export const fileReader = FileManager.read;

