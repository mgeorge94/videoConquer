import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ClipService } from '../services/clip.service';
import { DatePipe } from '@angular/common';
import { Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
@Component({
	selector: 'app-clips-list',
	templateUrl: './clips-list.component.html',
	styleUrls: ['./clips-list.component.css'],
	providers: [DatePipe],
	encapsulation: ViewEncapsulation.None,
})
export class ClipsListComponent implements OnInit, OnDestroy {
	@Input() scrollable = true;
	constructor(public clipService: ClipService, private router: Router) {
		this.clipService.getClips();
	}

	ngOnInit(): void {
		if (this.scrollable) {
			window.addEventListener('scroll', this.handleScroll);
		}
		//auto scroll to top
		this.router.events.subscribe((x) => {
			if (x instanceof NavigationEnd) {
				window.scrollTo(0, 0);
			}
		});
	}

	ngOnDestroy(): void {
		if (this.scrollable) {
			window.removeEventListener('scroll', this.handleScroll);
		}
		//each page should start with a fresh array of clips.
		//showing the same clips in different sections of the app is useless
		this.clipService.pageClips = [];
	}

	handleScroll = () => {
		const { scrollTop, offsetHeight } = document.documentElement;
		const { innerHeight } = window;
		const windowBottom = Math.round(scrollTop) + innerHeight === offsetHeight;
		if (windowBottom) {
			this.clipService.getClips();
		}
	};
}
