import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ClipService } from 'src/app/services/clip.service';
import { ClipInterface } from 'src/app/models/clip.model';

@Component({
	selector: 'app-manage',
	templateUrl: './manage.component.html',
	styleUrls: ['./manage.component.css'],
})
export class ManageComponent {
	videoOrder: string = '1';
	clips: ClipInterface[] = [];
	constructor(private route: ActivatedRoute, private router: Router, private clipService: ClipService) {}
	ngOnInit() {
		this.route.queryParamMap.subscribe((params: Params) => {
			this.videoOrder = params.sort === '2' ? params.sort : '1';
		});
		this.clipService.getUserClips().subscribe((docs) => {
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
}
