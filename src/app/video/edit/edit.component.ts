import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { Input } from '@angular/core';
import { ClipInterface } from 'src/app/models/clip.model';
@Component({
	selector: 'app-edit',
	templateUrl: './edit.component.html',
	styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy {
	@Input() activeClip: ClipInterface | null = null;

	constructor(private modal: ModalService) {}

	ngOnInit(): void {
		this.modal.register('editClip');
	}

	ngOnDestroy(): void {
		this.modal.unregister('editClip');
	}
}
