import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ClipService } from 'src/app/services/clip.service';
import { ClipInterface } from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { BehaviorSubject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
@Component({
	selector: 'app-manage',
	templateUrl: './manage.component.html',
	styleUrls: ['./manage.component.css'],
})
export class ManageComponent {
	videoOrder: string = '1';
	clips: ClipInterface[] = [];
	activeClip: ClipInterface | null = null;
	sort$: BehaviorSubject<string>;
	active: number | null = null;
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private clipService: ClipService,
		private modal: ModalService
	) {
		this.sort$ = new BehaviorSubject(this.videoOrder);
	}
	ngOnInit() {
		this.route.queryParamMap.subscribe(({ params }: Params) => {
			this.videoOrder = params.sort === '2' ? params.sort : '1';
			this.sort$.next(this.videoOrder);
		});
		this.clipService.getUserClips(this.sort$).subscribe((docs) => {
			this.clips = [];
			docs.forEach((doc) => {
				this.clips.push({
					docId: doc.id,
					...doc.data(),
				});
			});
		});
	}
	sort(e: Event) {
		const { value } = e.target as HTMLSelectElement;
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: {
				sort: value,
			},
		});
	}
	openModal(e: Event, clip: ClipInterface) {
		e.preventDefault();
		this.modal.toggleModal('editClip');
		this.activeClip = clip;
	}
	update(e: ClipInterface) {
		this.clips.forEach((clip, index) => {
			if (clip.docId === e.docId) {
				this.clips[index].title = e.title;
			}
		});
	}

	deleteClip(e: Event, clip: ClipInterface) {
		e.preventDefault();
		this.clipService.deleteClip(clip);
		this.clips.forEach((clipEl, index) => {
			if (clipEl.docId === clip.docId) {
				this.clips.splice(index, 1);
			}
		});
	}
	async copyToClipboard(e: MouseEvent, clip: ClipInterface) {
		this.activeClip = clip;
		e.preventDefault();
		if (!clip.docId) return;
		const url = `${location.origin}/clip/${clip.docId}`;
		await navigator.clipboard.writeText(url);
	}
}
