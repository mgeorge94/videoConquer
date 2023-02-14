import { Component, OnDestroy, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { Input } from '@angular/core';
import { ClipInterface } from 'src/app/models/clip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';
@Component({
	selector: 'app-edit',
	templateUrl: './edit.component.html',
	styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
	@Input() activeClip: ClipInterface | null = null;
	@Output() update = new EventEmitter();
	isSubmitting = false;
	showAlert = false;
	alertColor = 'blue';
	alertMsg = 'Please wait! Updating clip';

	clipId = new FormControl('', {
		nonNullable: true,
	});

	title = new FormControl('', {
		validators: [Validators.required, Validators.minLength(3)],
		nonNullable: true,
	});

	editForm = new FormGroup({
		title: this.title,
	});

	constructor(private modal: ModalService, private clipService: ClipService) {}

	ngOnInit(): void {
		this.modal.register('editClip');
	}

	ngOnDestroy(): void {
		this.modal.unregister('editClip');
	}
	ngOnChanges(): void {
		if (!this.activeClip) return;
		this.isSubmitting = false;
		this.showAlert = false;
		this.clipId.setValue(this.activeClip.docId as string);
		this.title.setValue(this.activeClip.title);
	}

	async submit() {
		if (!this.activeClip) return;

		this.isSubmitting = true;
		this.showAlert = true;
		this.alertColor = 'blue';
		this.alertMsg = 'Please wait! Updating clip';

		setTimeout(() => this.modal.toggleModal('editClip'), 1000);
		try {
			await this.clipService.updateClip(this.clipId.value, this.title.value);
		} catch {
			this.isSubmitting = false;
			this.alertColor = 'red';
			this.alertMsg = 'Something went wrong';
			return;
		}

		this.activeClip.title = this.title.value;
		this.update.emit(this.activeClip);
		this.isSubmitting = false;
		this.alertColor = 'green';
		this.alertMsg = 'Success!';
	}
}
