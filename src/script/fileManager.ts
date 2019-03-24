namespace FileManager {
	export function read(option: any): Promise<XMLHttpRequest> {
		var xhr = new XMLHttpRequest();
		if (option.type === 'GET') {
			return new Promise((resolve, reject) => {
				xhr.open('GET', option.url, option.async);
				xhr.onload = () => {
					if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) resolve(xhr);
					else reject(xhr);
				};
				xhr.send();
			});
		} else if (option.type === 'POST') {
			return new Promise((resolve, reject) => {
				xhr.open('POST', option.url, option.async);
				xhr.onload = () => {
					if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) resolve(xhr);
					else reject(xhr);
				};
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
				xhr.send(option.data);
			});
		}
	}
}
export const fileReader = FileManager.read;
