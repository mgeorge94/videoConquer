import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
@Component({
	selector: 'app-upload',
	templateUrl: './upload.component.html',
	styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
	isDragover = false;
	file: File | null = null;
	nextStep = false;
	showAlert = false;
	alertColor = 'blue';
	alertMsg = 'Please wait! Your clip is being upload';
	isSubmitting = false;
	percentage = 0;
	showPercentage = false;
	user: firebase.User | null = null;
	task?: AngularFireUploadTask;

	title = new FormControl('', {
		validators: [Validators.required, Validators.minLength(3)],
		nonNullable: true,
	});

	uploadForm = new FormGroup({
		title: this.title,
	});

	constructor(
		private storage: AngularFireStorage,
		private auth: AngularFireAuth,
		private clipService: ClipService,
		private router: Router,
		public ffmpegService: FfmpegService
	) {
		auth.user.subscribe((user) => (this.user = user));
		this.ffmpegService.init();
	}
	ngOnDestroy(): void {
		this.task?.cancel();
	}

	async storeFile(e: Event) {
		this.isDragover = false;
		this.file = (e as DragEvent).dataTransfer?.files.item(0) ?? null;
		if (!this.file || this.file.type === 'video /mp4') {
			return;
		}
		await this.ffmpegService.getScreenshots(this.file);

		this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
		this.nextStep = true;
	}
	uploadFile() {
		this.uploadForm.disable();
		this.showAlert = true;
		this.alertColor = 'blue';
		this.alertMsg = 'Please wait! Your clip is being upload';
		this.isSubmitting = true;
		this.showPercentage = true;
		const clipFileName = uuid();
		const clipPath = `clips/${clipFileName}.mp4`;
		this.task = this.storage.upload(clipPath, this.file);
		const clipRef = this.storage.ref(clipPath);

		this.task.percentageChanges().subscribe((progress) => {
			this.percentage = (progress as number) / 100;
		});

		this.task
			.snapshotChanges()
			.pipe(
				last(),
				switchMap(() => clipRef.getDownloadURL())
			)
			.subscribe({
				next: async (url) => {
					const clip = {
						uid: this.user?.uid as string,
						displayName: this.user?.displayName as string,
						title: this.title.value,
						fileName: `${clipFileName}.mp4`,
						url,
						timestamp: firebase.firestore.FieldValue.serverTimestamp(),
					};
					const clipDocRef = await this.clipService.createClip(clip);
					this.alertColor = 'green';
					this.alertMsg = 'Be happy! You are ready to flex with your new uploaded clip';
					this.showPercentage = false;

					setTimeout(() => {
						this.router.navigate(['clip', clipDocRef.id]);
					}, 1000);
				},
				error: (err) => {
					this.uploadForm.enable();

					this.alertColor = 'red';
					this.alertMsg = 'Something went wrong!';
					this.showPercentage = false;
					console.error(err);
				},
			});
	}
}
