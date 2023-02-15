import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
	providedIn: 'root',
})
export class FfmpegService {
	isReady = false;
	isRunning = false;
	private ffmpeg;
	constructor() {
		this.ffmpeg = createFFmpeg({
			log: true,
		});
	}
	async init() {
		if (this.isReady) {
			return;
		}

		await this.ffmpeg.load();

		this.isReady = true;
	}

	async getScreenshots(file: File) {
		this.isRunning = true;
		const data = await fetchFile(file);
		this.ffmpeg.FS('writeFile', file.name, data);

		const seconds = [1, 5, 9];
		const commands: string[] = [];

		seconds.forEach((second) => {
			commands.push(
				//run command line ffmpeg commands
				//they are gonna be handled by WebAssembly

				// ---> Input
				'-i',
				file.name,

				//---> Output Options
				//timestamp where the screenshot should be created
				'-ss',
				`00:00:0${second}`,
				// how many frames to focus on
				'-frames:v',
				'1',
				//resize the image
				//-1 for maintaining  original aspect ratio
				'-filter:v',
				'scale=510:-1',

				//---> Output
				`output_0${second}.png`
			);
		});
		await this.ffmpeg.run(...commands);

		const screenshots: string[] = [];
		seconds.forEach((second) => {
			//converting Unit8 file data to png
			const ssFile = this.ffmpeg.FS('readFile', `output_0${second}.png`);
			const ssBlob = new Blob([ssFile.buffer], {
				type: 'image/png',
			});
			//create url for screenshot
			const ssURL = URL.createObjectURL(ssBlob);
			screenshots.push(ssURL);
		});
		this.isRunning = false;

		return screenshots;
	}
}
