import { Component } from '@angular/core';

@Component({
	selector: 'app-upload',
	templateUrl: './upload.component.html',
	styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
	isDragover = false;
	storeFile(e: Event) {
		console.log('e', e);
		this.isDragover = false;
	}
}
