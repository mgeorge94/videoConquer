import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { combineLatest, forkJoin } from 'rxjs';
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
	screenshots: string[] = [];
	selectedSS = '';
	ssTask?: AngularFireUploadTask;

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
		if (this.ffmpegService.isRunning) return;

		this.isDragover = false;
		this.file = (e as DragEvent).dataTransfer?.files.item(0) ?? null;
		if (!this.file || this.file.type === 'video /mp4') {
			return;
		}
		this.screenshots = await this.ffmpegService.getScreenshots(this.file);
		this.selectedSS = this.screenshots[0];

		this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
		this.nextStep = true;
	}
	async uploadFile() {
		this.uploadForm.disable();
		this.showAlert = true;
		this.alertColor = 'blue';
		this.alertMsg = 'Please wait! Your clip is being upload';
		this.isSubmitting = true;
		this.showPercentage = true;
		const clipFileName = uuid();
		const clipPath = `clips/${clipFileName}.mp4`;
		const ssBlob = await this.ffmpegService.blobFromUrl(this.selectedSS);
		const ssPath = `screenshot/${clipFileName}.png`;

		//upload clip to firebase
		this.task = this.storage.upload(clipPath, this.file);
		const clipRef = this.storage.ref(clipPath);

		//upload ss to firebase
		this.ssTask = this.storage.upload(ssPath, ssBlob);

		const ssRef = this.storage.ref(ssPath);

		//visual representation of upload status via percentages
		combineLatest([this.task.percentageChanges(), this.ssTask.percentageChanges()]).subscribe((progress) => {
			const [clipProgress, ssProgress] = progress;
			if (!clipProgress || !ssProgress) return;
			const total = clipProgress + ssProgress;
			this.percentage = (total as number) / 200;
		});

		forkJoin([this.task.snapshotChanges(), this.ssTask.snapshotChanges()])
			.pipe(switchMap(() => forkJoin([clipRef.getDownloadURL(), ssRef.getDownloadURL()])))
			.subscribe({
				next: async (urls) => {
					const [clipURL, ssURL] = urls;
					const clip = {
						uid: this.user?.uid as string,
						displayName: this.user?.displayName as string,
						title: this.title.value,
						fileName: `${clipFileName}.mp4`,
						url: clipURL,
						ssURL,
						timestamp: firebase.firestore.FieldValue.serverTimestamp(),
					};
					const clipDocRef = await this.clipService.createClip(clip);
					this.alertColor = 'green';
					this.alertMsg = 'Be happy! You are ready to flex with your new uploaded clip';
					this.showPercentage = false;

					// this is required in order for the user to see the success message, and only after be redirected
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
