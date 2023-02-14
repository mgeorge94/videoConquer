import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ClipService } from 'src/app/services/clip.service';
@Component({
	selector: 'app-manage',
	templateUrl: './manage.component.html',
	styleUrls: ['./manage.component.css'],
})
export class ManageComponent {
	videoOrder: string = '1';
	constructor(private route: ActivatedRoute, private router: Router, private clipService: ClipService) {}
	ngOnInit() {
		this.route.queryParamMap.subscribe((params: Params) => {
			this.videoOrder = params.sort === '2' ? params.sort : '1';
		});
		this.clipService.getUserClips().subscribe(console.log);
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
