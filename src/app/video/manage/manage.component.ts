import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
	selector: 'app-manage',
	templateUrl: './manage.component.html',
	styleUrls: ['./manage.component.css'],
})
export class ManageComponent {
	videoOrder: string = '1';
	constructor(private route: ActivatedRoute, private router: Router) {}
	ngOnInit() {
		this.route.queryParamMap.subscribe((params: Params) => {
			this.videoOrder = params.sort === '2' ? params.sort : '1';
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
