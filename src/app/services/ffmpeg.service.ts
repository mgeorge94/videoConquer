import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
	providedIn: 'root',
})
export class FfmpegService {
	isReady = false;
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
		const data = await fetchFile(file);
		this.ffmpeg.FS('writeFile', file.name, data);
		await this.ffmpeg.run(
			//run command line ffmpeg commands
			//they are gonna be handled by WebAssembly

			// ---> Input
			'-i',
			file.name,

			//---> Output Options
			//timestamp where the screenshot should be created
			'-ss',
			'00:00:01',
			// how many frames to focus on
			'-frames:v',
			'1',
			//resize the image
			'-filter:v',
			//-1 for maintaining  original aspect ratio
			'scale=510:-1',

			//---> Output
			'output_01.png'
		);
	}
}
