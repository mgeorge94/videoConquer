import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last } from 'rxjs/operators';
@Component({
	selector: 'app-upload',
	templateUrl: './upload.component.html',
	styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
	isDragover = false;
	file: File | null = null;
	nextStep = false;
	showAlert = false;
	alertColor = 'blue';
	alertMsg = 'Please wait! Your clip is being upload';
	isSubmitting = false;
	percentage = 0;
	showPercentage = false;

	title = new FormControl('', {
		validators: [Validators.required, Validators.minLength(3)],
		nonNullable: true,
	});
	uploadForm = new FormGroup({
		title: this.title,
	});
	constructor(private storage: AngularFireStorage) {}

	storeFile(e: Event) {
		this.isDragover = false;
		this.file = (e as DragEvent).dataTransfer?.files.item(0) ?? null;
		if (!this.file || this.file.type === 'video /mp4') {
			return;
		}
		this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
		this.nextStep = true;
	}
	uploadFile() {
		this.showAlert = true;
		this.alertColor = 'blue';
		this.alertMsg = 'Please wait! Your clip is being upload';
		this.isSubmitting = true;
		this.showPercentage = true;
		const clipFileName = uuid();
		const clipPath = `clips/${clipFileName}.mp4`;
		const task = this.storage.upload(clipPath, this.file);
		task.percentageChanges().subscribe((progress) => {
			this.percentage = (progress as number) / 100;
		});
		task.snapshotChanges()
			.pipe(last())
			.subscribe({
				next: (snapshot) => {
					this.alertColor = 'green';
					this.alertMsg = 'Be happy! You are ready to flex with your new uploaded clip';
					this.showPercentage = false;
				},
				error: (err) => {
					this.alertColor = 'red';
					this.alertMsg = 'Something went wrong!';
					this.showPercentage = false;
					console.error(err);
				},
			});
	}
}
